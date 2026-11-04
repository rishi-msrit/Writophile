import { getAllPosts, getFictionItems } from '@/lib/content';
import { buildSearchIndex } from '@/lib/search-index';
import SearchClient from './SearchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
};

export default async function SearchPage() {
  const [allPosts, { stories }] = await Promise.all([
    getAllPosts(),
    getFictionItems(),
  ]);
  const index = buildSearchIndex(allPosts, stories);

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <header className="mb-10 pb-6 border-b border-[var(--color-rule)]">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--color-accent)] mb-3">
          Instant Client-Side Search
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[var(--color-ink)] mb-2 tracking-tight">
          Search Writing
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Search across all documentation, fiction chapters, satire, and technical notes.
        </p>
      </header>
      <SearchClient index={index} />
    </div>
  );
}
