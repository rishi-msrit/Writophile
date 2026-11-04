// lib/frontmatter.ts – safe frontmatter parsing with graceful fallbacks

import matter from 'gray-matter';
import type { Frontmatter } from './types';

const VALID_STATUSES = new Set(['ongoing', 'complete']);

/**
 * Parse frontmatter from a file's raw string.
 * Never throws — invalid fields are skipped with a warning.
 */
export function parseFrontmatter(
  raw: string,
  filePath: string
): { data: Frontmatter; content: string } {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch {
    console.warn(`[frontmatter] Could not parse frontmatter in ${filePath} — treating as plain content`);
    return { data: {}, content: raw };
  }

  const src = parsed.data as Record<string, unknown>;
  const data: Frontmatter = {};

  // title
  if (typeof src.title === 'string') {
    data.title = src.title.trim() || undefined;
  } else if (src.title !== undefined) {
    console.warn(`[frontmatter] 'title' in ${filePath} is not a string — skipped`);
  }

  // date
  if (typeof src.date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(src.date)) {
      data.date = src.date;
    } else {
      console.warn(`[frontmatter] 'date' in ${filePath} is not YYYY-MM-DD — skipped`);
    }
  } else if (src.date instanceof Date) {
    // gray-matter parses bare dates as Date objects
    data.date = src.date.toISOString().slice(0, 10);
  } else if (src.date !== undefined) {
    console.warn(`[frontmatter] 'date' in ${filePath} has unexpected type — skipped`);
  }

  // summary
  if (typeof src.summary === 'string') {
    data.summary = src.summary;
  } else if (src.summary !== undefined) {
    console.warn(`[frontmatter] 'summary' in ${filePath} is not a string — skipped`);
  }

  // tags
  if (Array.isArray(src.tags)) {
    data.tags = src.tags
      .filter((t) => typeof t === 'string')
      .map((t) => (t as string).trim())
      .filter(Boolean);
    if (data.tags.length !== src.tags.length) {
      console.warn(`[frontmatter] Some tags in ${filePath} were not strings — skipped`);
    }
  } else if (src.tags !== undefined) {
    console.warn(`[frontmatter] 'tags' in ${filePath} is not an array — skipped`);
  }

  // link
  if (typeof src.link === 'string') {
    data.link = src.link.trim();
  } else if (src.link !== undefined) {
    console.warn(`[frontmatter] 'link' in ${filePath} is not a string — skipped`);
  }

  // linkLabel
  if (typeof src.linkLabel === 'string') {
    data.linkLabel = src.linkLabel.trim();
  } else if (src.linkLabel !== undefined) {
    console.warn(`[frontmatter] 'linkLabel' in ${filePath} is not a string — skipped`);
  }

  // pinned
  if (typeof src.pinned === 'boolean') {
    data.pinned = src.pinned;
  } else if (src.pinned !== undefined) {
    console.warn(`[frontmatter] 'pinned' in ${filePath} is not boolean — skipped`);
  }

  // draft
  if (typeof src.draft === 'boolean') {
    data.draft = src.draft;
  } else if (src.draft !== undefined) {
    console.warn(`[frontmatter] 'draft' in ${filePath} is not boolean — skipped`);
  }

  // status (fiction stories)
  if (typeof src.status === 'string') {
    if (VALID_STATUSES.has(src.status)) {
      data.status = src.status as 'ongoing' | 'complete';
    } else {
      console.warn(`[frontmatter] 'status' in ${filePath} must be 'ongoing' or 'complete' — skipped`);
    }
  } else if (src.status !== undefined) {
    console.warn(`[frontmatter] 'status' in ${filePath} is not a string — skipped`);
  }

  return { data, content: parsed.content };
}

/**
 * Extract the first H1 from markdown content, stripping the # prefix.
 */
export function extractH1(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Derive a title from a filename (strip numeric prefix, extension, dashes→spaces).
 */
export function titleFromFilename(filename: string): string {
  // remove extension
  let name = filename.replace(/\.[^.]+$/, '');
  // remove leading numeric prefix like "01-" or "01_"
  name = name.replace(/^\d+[-_]/, '');
  // replace dashes and underscores with spaces
  name = name.replace(/[-_]/g, ' ');
  // title-case
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extract date from filename prefix like "2024-01-15-my-post.md"
 */
export function dateFromFilename(filename: string): string | null {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : null;
}

/**
 * Derive an external link label from a URL.
 */
export function linkLabel(url: string, override?: string): string {
  if (override) return override;
  if (url.includes('github.com')) return 'View on GitHub';
  if (url.includes('wattpad.com')) return 'Read on Wattpad';
  return 'Open link';
}

