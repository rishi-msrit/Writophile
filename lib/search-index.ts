// lib/search-index.ts – build-time search index for client-side search

import type { Post, Story } from './types';

export interface SearchEntry {
  slug: string;
  section: string;
  title: string;
  summary: string;
  tags: string[];
  /** Stripped body text for search */
  body: string;
  url: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSearchIndex(
  posts: Post[],
  stories: Story[]
): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const p of posts) {
    let url: string;
    if (p.section === 'technical') url = `/technical/${p.slug}/`;
    else if (p.section === 'bits-and-bytes') url = `/bits-and-bytes/${p.slug}/`;
    else url = `/fiction/${p.slug}/`;

    entries.push({
      slug: p.slug,
      section: p.section,
      title: p.title,
      summary: p.summary,
      tags: p.tags,
      body: stripHtml(p.contentHtml).slice(0, 2000),
      url,
    });
  }

  for (const s of stories) {
    entries.push({
      slug: s.slug,
      section: 'fiction',
      title: s.title,
      summary: s.summary,
      tags: s.tags,
      body: '',
      url: `/fiction/${s.slug}/`,
    });
  }

  return entries;
}

