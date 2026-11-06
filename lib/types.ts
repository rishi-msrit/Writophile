// lib/types.ts – shared types across the content pipeline

export type Section = 'technical' | 'fiction' | 'bits-and-bytes' | 'blog';

/** Frontmatter that every content file may optionally contain */
export interface Frontmatter {
  title?: string;
  date?: string;         // YYYY-MM-DD
  summary?: string;
  tags?: string[];
  link?: string;         // external URL
  linkLabel?: string;
  pinned?: boolean;
  draft?: boolean;
  // fiction story.md extras
  status?: 'ongoing' | 'complete';
}

/** A fully-resolved post for list / page rendering */
export interface Post {
  slug: string;
  section: Section;
  title: string;
  date: string | null;   // null = undated
  summary: string;
  tags: string[];
  link?: string;
  linkLabel?: string;
  pinned: boolean;
  draft: boolean;
  readingTime: string;
  contentHtml: string;
  headings: { id: string; text: string; level: number }[];
  /** Fiction chapter number, if applicable */
  chapterNum?: number;
}

/** A multi-chapter story index */
export interface Story {
  slug: string;
  title: string;
  date: string | null;
  summary: string;
  tags: string[];
  link?: string;
  linkLabel?: string;
  pinned: boolean;
  draft: boolean;
  status: 'ongoing' | 'complete';
  chapters: ChapterMeta[];
  totalReadingTime: string;
}

export interface ChapterMeta {
  slug: string;    // e.g. "01-the-start"
  num: number;
  title: string;
  readingTime: string;
}

/** A standalone fiction piece (not a story) */
export type StandalonePiece = Post;


