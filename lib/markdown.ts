// lib/markdown.ts – unified/remark/rehype pipeline for .md files

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeExternalLinks from 'rehype-external-links';
import { visit } from 'unist-util-visit';
import type { Root as HastRoot, Element as HastElement, ElementContent } from 'hast';
import type { Root as MdastRoot, Heading, Text, Parent } from 'mdast';
import { toString as mdastToString } from 'mdast-util-to-string';
import { h } from 'hastscript';
import { createHighlighter } from 'shiki';

export interface ParsedHeading {
  id: string;
  text: string;
  level: number;
}

let _highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;
let _highlighterPromise: Promise<Awaited<ReturnType<typeof createHighlighter>>> | null = null;

async function getHighlighter() {
  if (_highlighter) return _highlighter;
  if (!_highlighterPromise) {
    _highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'typescript', 'javascript', 'tsx', 'jsx', 'json', 'bash', 'sh',
        'python', 'rust', 'go', 'yaml', 'toml', 'markdown', 'html', 'css',
        'sql', 'docker', 'diff', 'plaintext',
      ],
    });
  }
  _highlighter = await _highlighterPromise;
  return _highlighter;
}

/**
 * Transform ==highlighted text== into <mark> elements.
 * Done as a remark plugin operating on text nodes.
 */
function remarkHighlight() {
  return (tree: MdastRoot) => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (!node.value.includes('==')) return;
      const parts = node.value.split(/(==.+?==)/g);
      if (parts.length <= 1) return;

      const newNodes: (Text | { type: 'html'; value: string })[] = parts.map((part) => {
        const inner = part.match(/^==(.+)==$/);
        if (inner) {
          return {
            type: 'html' as const,
            value: `<mark>${inner[1]}</mark>`,
          };
        }
        return { type: 'text' as const, value: part };
      });

      if (parent && index !== undefined) {
        parent.children.splice(index, 1, ...newNodes as never[]);
        return index + newNodes.length;
      }
    });
  };
}

/**
 * Rehype plugin: transform GitHub-style alerts > [!NOTE] etc.
 */
function rehypeGithubAlerts() {
  const ALERT_TYPES: Record<string, string> = {
    NOTE: 'note',
    TIP: 'tip',
    IMPORTANT: 'important',
    WARNING: 'warning',
    CAUTION: 'caution',
  };

  return (tree: HastRoot) => {
    visit(tree, 'element', (node: HastElement) => {
      if (node.tagName !== 'blockquote') return;

      const firstP = node.children.find(
        (c): c is HastElement => (c as HastElement).tagName === 'p'
      );
      if (!firstP) return;

      const firstChild = firstP.children[0];
      if (!firstChild || firstChild.type !== 'text') return;

      const match = (firstChild as { value: string }).value.match(
        /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i
      );
      if (!match) return;

      const type = match[1].toUpperCase();
      const kind = ALERT_TYPES[type];

      (firstChild as { value: string }).value = (firstChild as { value: string }).value.slice(
        match[0].length
      );

      node.tagName = 'div';
      node.properties = {
        ...node.properties,
        className: [`alert alert-${kind}`],
        'data-alert': kind,
      };

      const titleSpan = h('span', { className: ['alert-title'] }, type) as ElementContent;
      firstP.children.unshift(titleSpan);
    });
  };
}

/**
 * Rehype plugin: make tables horizontally scrollable on mobile.
 */
function rehypeScrollableTables() {
  return (tree: HastRoot) => {
    visit(
      tree,
      'element',
      (
        node: HastElement,
        index: number | undefined,
        parent: HastRoot | HastElement | undefined
      ) => {
        if (node.tagName !== 'table' || !parent || index === undefined) return;
        const wrapper = h('div', { className: ['table-scroll'] }, [node]) as HastElement;
        (parent.children as ElementContent[])[index] = wrapper;
      }
    );
  };
}

/**
 * Extract headings from markdown AST for ToC generation.
 */
function extractHeadings(tree: MdastRoot): ParsedHeading[] {
  const headings: ParsedHeading[] = [];
  visit(tree, 'heading', (node: Heading) => {
    const text = mdastToString(node);
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    headings.push({ id, text, level: node.depth });
  });
  return headings;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function renderMarkdown(
  raw: string,
  options: { imageBase?: string } = {}
): Promise<{ html: string; headings: ParsedHeading[] }> {
  const highlighter = await getHighlighter();
  const headings: ParsedHeading[] = [];

  function collectHeadings() {
    return (tree: MdastRoot) => {
      const h = extractHeadings(tree);
      headings.push(...h);
    };
  }

  function rehypeShiki() {
    return (tree: HastRoot) => {
      visit(tree, 'element', (node: HastElement) => {
        if (node.tagName !== 'pre') return;
        const codeEl = node.children.find(
          (c): c is HastElement => (c as HastElement).tagName === 'code'
        );
        if (!codeEl) return;

        const className = (codeEl.properties?.className as string[]) || [];
        const langClass = className.find((c) => c.startsWith('language-'));
        const lang = langClass ? langClass.replace('language-', '') : 'plaintext';

        const rawCode = (codeEl.children[0] as { value?: string })?.value || '';

        let highlighted = '';
        try {
          const loadedLangs = highlighter.getLoadedLanguages();
          const targetLang = loadedLangs.includes(lang) ? lang : 'plaintext';
          highlighted = highlighter.codeToHtml(rawCode, {
            lang: targetLang as Parameters<typeof highlighter.codeToHtml>[1]['lang'],
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
          });
        } catch {
          highlighted = `<pre><code>${escapeHtml(rawCode)}</code></pre>`;
        }

        // Replace node with raw HTML
        Object.assign(node, {
          type: 'raw',
          value: `<div class="code-block">${highlighted}<button class="copy-btn" aria-label="Copy code" type="button">Copy</button></div>`,
        });
      });
    };
  }

  function rehypeRewriteImages() {
    return (tree: HastRoot) => {
      if (!options.imageBase) return;
      visit(tree, 'element', (node: HastElement) => {
        if (node.tagName !== 'img') return;
        const src = node.properties?.src as string;
        if (src && !src.startsWith('http') && !src.startsWith('/')) {
          node.properties!.src = `${options.imageBase}/${src}`;
        }
      });
    };
  }

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkHighlight)
    .use(collectHeadings)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeGithubAlerts)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      content: h('span', { 'aria-hidden': 'true', className: ['anchor-link'] }, '#') as ElementContent,
    })
    .use(rehypeExternalLinks, {
      rel: ['noopener', 'noreferrer'],
      target: '_blank',
    })
    .use(rehypeRewriteImages)
    .use(rehypeShiki)
    .use(rehypeScrollableTables)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(raw);
  const html = String(result);

  return { html, headings };
}
