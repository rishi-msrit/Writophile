// lib/remote-sources.ts – fetch README content from GitHub at build time

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { renderMarkdown } from './markdown';
import readingTime from 'reading-time';
import { parseFrontmatter, titleFromFilename, linkLabel } from './frontmatter';
import type { Post, RemoteSource } from './types';

const SOURCES_FILE = path.join(process.cwd(), 'content', 'technical', '_sources.yml');

export async function getRemoteSources(): Promise<Post[]> {
  if (!fs.existsSync(SOURCES_FILE)) return [];

  let sources: RemoteSource[];
  try {
    const raw = fs.readFileSync(SOURCES_FILE, 'utf-8');
    sources = (yaml.load(raw) as RemoteSource[]) ?? [];
  } catch (e) {
    console.warn(`[remote] Could not parse _sources.yml: ${e}`);
    return [];
  }

  const posts: Post[] = [];

  for (const src of sources) {
    const branch = src.branch ?? 'main';
    const rawUrl = `https://raw.githubusercontent.com/${src.owner}/${src.repo}/${branch}/${src.path}`;
    const repoBaseUrl = `https://raw.githubusercontent.com/${src.owner}/${src.repo}/${branch}/${path.dirname(src.path)}`;
    const repoWebUrl = `https://github.com/${src.owner}/${src.repo}`;

    let rawContent: string;
    try {
      const res = await fetch(rawUrl);
      if (res.status === 404) {
        console.warn(`[remote] 404 for ${rawUrl} — skipped`);
        continue;
      }
      if (!res.ok) {
        // Network/server error — fail the build
        throw new Error(`[remote] Fetch failed for ${rawUrl}: HTTP ${res.status}`);
      }
      rawContent = await res.text();
    } catch (e) {
      if ((e as Error).message.startsWith('[remote] Fetch failed')) throw e;
      // Network-level error — fail the build
      throw new Error(`[remote] Network error fetching ${rawUrl}: ${e}`);
    }

    const { data: fm, content } = parseFrontmatter(rawContent, rawUrl);
    if (fm.draft) continue;

    // Rewrite relative images and links to absolute GitHub URLs
    const rewrittenContent = content
      .replace(
        /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
        (_, alt, relPath) => `![${alt}](${repoBaseUrl}/${relPath})`
      )
      .replace(
        /\[([^\]]+)\]\((?!https?:\/\/|#)([^)]+)\)/g,
        (_, text, relPath) => `[${text}](${repoWebUrl}/blob/${branch}/${relPath})`
      );

    const { html: contentHtml, headings } = await renderMarkdown(rewrittenContent);
    const rt = readingTime(content);

    posts.push({
      slug: src.slug,
      section: 'technical',
      title: src.title ?? fm.title ?? titleFromFilename(src.slug),
      date: fm.date ?? null,
      summary: src.summary ?? fm.summary ?? '',
      tags: src.tags ?? fm.tags ?? [],
      link: repoWebUrl,
      linkLabel: 'View on GitHub',
      pinned: false,
      draft: false,
      readingTime: rt.text,
      contentHtml,
      headings,
    });
  }

  return posts;
}

