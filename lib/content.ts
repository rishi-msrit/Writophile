// lib/content.ts – content pipeline: reads /content and builds Post/Story objects

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import {
  parseFrontmatter,
  extractH1,
  titleFromFilename,
  dateFromFilename,
} from './frontmatter';
import { renderMarkdown } from './markdown';
import { renderTxt } from './txt';
import type { Post, Story, ChapterMeta, StandalonePiece, Section } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SUPPORTED_EXTS = new Set(['.md', '.txt']);

function warnUnsupported(filePath: string) {
  const ext = path.extname(filePath);
  if (ext && !SUPPORTED_EXTS.has(ext)) {
    console.warn(
      `[content] Unsupported extension "${ext}" in ${filePath} — skipped`
    );
  }
}

function isSupportedFile(filename: string): boolean {
  const ext = path.extname(filename);
  return SUPPORTED_EXTS.has(ext);
}

/** Slugify a filename to use as URL slug */
function fileSlug(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '') // strip extension
    .replace(/^\d{4}-\d{2}-\d{2}-/, '') // strip date prefix
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build a resolved Post from a file on disk */
async function buildPost(
  filePath: string,
  section: Section,
  slug?: string
): Promise<Post | null> {
  const filename = path.basename(filePath);
  const ext = path.extname(filename);

  if (!isSupportedFile(filename)) {
    warnUnsupported(filePath);
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: fm, content } = parseFrontmatter(raw, filePath);

  if (fm.draft) return null;

  const resolvedSlug = slug ?? fileSlug(filename);

  // Render content
  let contentHtml: string;
  let headings: { id: string; text: string; level: number }[] = [];

  if (ext === '.md') {
    const result = await renderMarkdown(content, {
      imageBase: `/content-images/${section}/${resolvedSlug}`,
    });
    contentHtml = result.html;
    headings = result.headings;
  } else {
    contentHtml = renderTxt(raw);
  }

  // Reading time
  const rt = readingTime(content || raw);

  // Title resolution: frontmatter > first H1 > filename
  let title =
    fm.title ||
    (ext === '.md' ? extractH1(content) : null) ||
    titleFromFilename(filename);

  // Date resolution: frontmatter > filename prefix > auto-date for blog
  let date = fm.date ?? dateFromFilename(filename);
  if (!date && section === 'blog') {
    date = new Date().toISOString().slice(0, 10);
  }

  return {
    slug: resolvedSlug,
    section,
    title,
    date,
    summary: fm.summary ?? '',
    tags: fm.tags ?? [],
    link: fm.link,
    linkLabel: fm.linkLabel,
    pinned: fm.pinned ?? false,
    draft: false,
    readingTime: rt.text,
    contentHtml,
    headings,
  };
}

// ─── Technical posts ──────────────────────────────────────────────────────────

export async function getTechnicalPosts(): Promise<Post[]> {
  const dir = path.join(CONTENT_DIR, 'technical');
  if (!fs.existsSync(dir)) return [];

  const slugsSeen = new Set<string>();
  const posts: Post[] = [];

  for (const filename of fs.readdirSync(dir)) {
    if (filename.startsWith('_') || filename.startsWith('.')) continue;
    const filePath = path.join(dir, filename);
    if (!fs.statSync(filePath).isFile()) continue;

    if (!isSupportedFile(filename)) {
      warnUnsupported(filePath);
      continue;
    }

    const slug = fileSlug(filename);
    if (slugsSeen.has(slug)) {
      console.warn(`[content] Duplicate slug "${slug}" in technical — skipped ${filename}`);
      continue;
    }
    slugsSeen.add(slug);

    const post = await buildPost(filePath, 'technical', slug);
    if (post) posts.push(post);
  }

  return sortPosts(posts);
}

export async function getTechnicalPost(slug: string): Promise<Post | null> {
  const dir = path.join(CONTENT_DIR, 'technical');
  if (!fs.existsSync(dir)) return null;

  for (const filename of fs.readdirSync(dir)) {
    if (!isSupportedFile(filename)) continue;
    if (fileSlug(filename) === slug) {
      return buildPost(path.join(dir, filename), 'technical', slug);
    }
  }
  return null;
}

// ─── Bits & Bytes posts ───────────────────────────────────────────────────────

export async function getBitsAndBytesPosts(): Promise<Post[]> {
  const dir = path.join(CONTENT_DIR, 'bits-and-bytes');
  if (!fs.existsSync(dir)) return [];

  const slugsSeen = new Set<string>();
  const posts: Post[] = [];

  for (const filename of fs.readdirSync(dir)) {
    if (filename.startsWith('_') || filename.startsWith('.')) continue;
    const filePath = path.join(dir, filename);
    if (!fs.statSync(filePath).isFile()) continue;

    if (!isSupportedFile(filename)) {
      warnUnsupported(filePath);
      continue;
    }

    const slug = fileSlug(filename);
    if (slugsSeen.has(slug)) {
      console.warn(`[content] Duplicate slug "${slug}" in bits-and-bytes — skipped ${filename}`);
      continue;
    }
    slugsSeen.add(slug);

    const post = await buildPost(filePath, 'bits-and-bytes', slug);
    if (post) posts.push(post);
  }

  return sortPosts(posts);
}

export async function getBitsAndBytesPost(slug: string): Promise<Post | null> {
  const dir = path.join(CONTENT_DIR, 'bits-and-bytes');
  if (!fs.existsSync(dir)) return null;

  for (const filename of fs.readdirSync(dir)) {
    if (!isSupportedFile(filename)) continue;
    if (fileSlug(filename) === slug) {
      return buildPost(path.join(dir, filename), 'bits-and-bytes', slug);
    }
  }
  return null;
}

// ─── Blog posts ───────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<Post[]> {
  const dir = path.join(CONTENT_DIR, 'blog');
  if (!fs.existsSync(dir)) return [];

  const slugsSeen = new Set<string>();
  const posts: Post[] = [];

  for (const filename of fs.readdirSync(dir)) {
    if (filename.startsWith('_') || filename.startsWith('.')) continue;
    const filePath = path.join(dir, filename);
    if (!fs.statSync(filePath).isFile()) continue;

    if (!isSupportedFile(filename)) {
      warnUnsupported(filePath);
      continue;
    }

    const slug = fileSlug(filename);
    if (slugsSeen.has(slug)) {
      console.warn(`[content] Duplicate slug "${slug}" in blog — skipped ${filename}`);
      continue;
    }
    slugsSeen.add(slug);

    const post = await buildPost(filePath, 'blog', slug);
    if (post) posts.push(post);
  }

  return sortPosts(posts);
}

export async function getBlogPost(slug: string): Promise<Post | null> {
  const dir = path.join(CONTENT_DIR, 'blog');
  if (!fs.existsSync(dir)) return null;

  for (const filename of fs.readdirSync(dir)) {
    if (!isSupportedFile(filename)) continue;
    if (fileSlug(filename) === slug) {
      return buildPost(path.join(dir, filename), 'blog', slug);
    }
  }
  return null;
}

// ─── Fiction ──────────────────────────────────────────────────────────────────

/**
 * Get all fiction items: standalone pieces and story indices.
 * Returns a mix of StandalonePiece[] and Story[].
 */
export async function getFictionItems(): Promise<{
  stories: Story[];
  standalones: StandalonePiece[];
}> {
  const dir = path.join(CONTENT_DIR, 'fiction');
  if (!fs.existsSync(dir)) return { stories: [], standalones: [] };

  const stories: Story[] = [];
  const standalones: StandalonePiece[] = [];

  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue;
    const entryPath = path.join(dir, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      // Multi-chapter story
      const story = await buildStory(entryPath, entry);
      if (story) stories.push(story);
    } else if (stat.isFile()) {
      if (!isSupportedFile(entry)) {
        warnUnsupported(entryPath);
        continue;
      }
      // Standalone piece
      const piece = await buildPost(entryPath, 'fiction', fileSlug(entry));
      if (piece) standalones.push(piece);
    }
  }

  return { stories, standalones };
}

export async function buildStory(storyDir: string, dirName: string): Promise<Story | null> {
  const metaPath = path.join(storyDir, 'story.md');
  if (!fs.existsSync(metaPath)) {
    console.warn(`[content] Story folder "${dirName}" has no story.md — skipped`);
    return null;
  }

  const raw = fs.readFileSync(metaPath, 'utf-8');
  const { data: fm } = parseFrontmatter(raw, metaPath);

  if (fm.draft) return null;

  const storySlug = dirName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  // Find chapters: files with numeric prefix, excluding story.md
  const chapterFiles: string[] = [];
  for (const f of fs.readdirSync(storyDir)) {
    if (f === 'story.md') continue;
    if (!isSupportedFile(f)) {
      warnUnsupported(path.join(storyDir, f));
      continue;
    }
    if (/^\d+/.test(f)) chapterFiles.push(f);
  }

  // Sort by numeric prefix
  chapterFiles.sort((a, b) => {
    const na = parseInt(a.match(/^(\d+)/)?.[1] ?? '0', 10);
    const nb = parseInt(b.match(/^(\d+)/)?.[1] ?? '0', 10);
    return na - nb;
  });

  const chapters: ChapterMeta[] = [];
  let totalWords = 0;

  for (let i = 0; i < chapterFiles.length; i++) {
    const f = chapterFiles[i];
    const chPath = path.join(storyDir, f);
    const chRaw = fs.readFileSync(chPath, 'utf-8');
    const { data: chFm, content: chContent } = parseFrontmatter(chRaw, chPath);
    if (chFm.draft) continue;

    const rt = readingTime(chContent || chRaw);
    totalWords += rt.words;
    const num = parseInt(f.match(/^(\d+)/)?.[1] ?? String(i + 1), 10);

    chapters.push({
      slug: fileSlug(f),
      num,
      title: chFm.title || titleFromFilename(f),
      readingTime: rt.text,
    });
  }

  const totalRt = readingTime('x '.repeat(totalWords));

  return {
    slug: storySlug,
    title: fm.title || titleFromFilename(dirName),
    date: fm.date ?? null,
    summary: fm.summary ?? '',
    tags: fm.tags ?? [],
    link: fm.link,
    linkLabel: fm.linkLabel,
    pinned: fm.pinned ?? false,
    draft: false,
    status: fm.status ?? 'ongoing',
    chapters,
    totalReadingTime: totalRt.text,
  };
}

export async function getStory(storySlug: string): Promise<Story | null> {
  const dir = path.join(CONTENT_DIR, 'fiction');
  if (!fs.existsSync(dir)) return null;

  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    const slug = entry.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (slug === storySlug) {
      return buildStory(entryPath, entry);
    }
  }
  return null;
}

export async function getChapter(
  storySlug: string,
  chapterSlug: string
): Promise<Post | null> {
  const dir = path.join(CONTENT_DIR, 'fiction');
  if (!fs.existsSync(dir)) return null;

  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    const slug = entry.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (slug !== storySlug) continue;

    // Found the story dir, find the chapter
    for (const f of fs.readdirSync(entryPath)) {
      if (!isSupportedFile(f)) continue;
      if (fileSlug(f) === chapterSlug) {
        const chPath = path.join(entryPath, f);
        const post = await buildPost(chPath, 'fiction', chapterSlug);
        if (post) {
          // Add chapter number
          const num = parseInt(f.match(/^(\d+)/)?.[1] ?? '1', 10);
          return { ...post, chapterNum: num };
        }
      }
    }
  }
  return null;
}

export async function getStandalonePiece(slug: string): Promise<StandalonePiece | null> {
  const dir = path.join(CONTENT_DIR, 'fiction');
  if (!fs.existsSync(dir)) return null;

  for (const f of fs.readdirSync(dir)) {
    const fPath = path.join(dir, f);
    if (!fs.statSync(fPath).isFile()) continue;
    if (!isSupportedFile(f)) continue;
    if (fileSlug(f) === slug) {
      return buildPost(fPath, 'fiction', slug);
    }
  }
  return null;
}

// ─── About page ───────────────────────────────────────────────────────────────

export async function getAboutPage(): Promise<{ html: string; title: string }> {
  const filePath = path.join(CONTENT_DIR, 'about.md');
  if (!fs.existsSync(filePath)) {
    return { html: '<p>No about page found.</p>', title: 'About' };
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: fm, content } = parseFrontmatter(raw, filePath);
  const { html } = await renderMarkdown(content);
  return { html, title: fm.title ?? 'About' };
}

// ─── All posts (for home, search index) ──────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  const [technical, bitsAndBytes, blog, { standalones }] = await Promise.all([
    getTechnicalPosts(),
    getBitsAndBytesPosts(),
    getBlogPosts(),
    getFictionItems(),
  ]);
  return sortPosts([...technical, ...bitsAndBytes, ...blog, ...standalones]);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortPosts(posts: Post[]): Post[] {
  return posts.sort((a, b) => {
    // Pinned first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // Then by date descending
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    // Then by title
    return a.title.localeCompare(b.title);
  });
}

export function getLatestPosts(all: Post[], n = 5): Post[] {
  return all
    .filter((p) => !p.pinned)
    .slice(0, n);
}

export function getPinnedPosts(all: Post[]): Post[] {
  return all.filter((p) => p.pinned);
}

export function getAllTags(posts: Post[], max = 8): string[] {
  const counts = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([t]) => t);
}

