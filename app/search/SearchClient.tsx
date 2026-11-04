'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SearchEntry } from '@/lib/search-index';

interface Props {
  index: SearchEntry[];
}

function normalise(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
}

function search(index: SearchEntry[], query: string): SearchEntry[] {
  if (!query.trim()) return [];
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  return index.filter((entry) => {
    const haystack = normalise(
      [entry.title, entry.summary, entry.tags.join(' '), entry.body].join(' ')
    );
    return terms.every((t) => haystack.includes(t));
  });
}

export default function SearchClient({ index }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => search(index, query), [index, query]);

  return (
    <>
      <div className="relative mb-8">
        <label htmlFor="search-input" className="sr-only">
          Search posts
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documentation, stories, notes, and tags…"
          className="w-full border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)] px-5 py-3.5 rounded-lg font-serif text-lg focus:outline-none focus:border-[var(--color-accent)] placeholder:text-[var(--color-ink-muted)] placeholder:font-sans transition-colors shadow-sm"
          aria-label="Search posts"
          autoFocus
        />
      </div>

      {query && (
        <p className="text-xs font-mono text-[var(--color-ink-muted)] mb-6">
          {results.length === 0
            ? 'No matches found.'
            : `${results.length} result${results.length === 1 ? '' : 's'}`}
        </p>
      )}

      {results.length > 0 && (
        <div className="border-t border-[var(--color-rule)]">
          {results.map((entry) => (
            <article
              key={`${entry.section}/${entry.slug}`}
              className="border-b border-[var(--color-rule)] py-6"
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider">
                <span>{entry.section === 'bits-and-bytes' ? 'Bits & Bytes' : entry.section}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold m-0 mb-1.5">
                <Link
                  href={entry.url}
                  className="text-[var(--color-ink)] hover:text-[var(--color-accent)] no-underline transition-colors"
                >
                  {entry.title}
                </Link>
              </h2>
              {entry.summary && (
                <p className="text-sm text-[var(--color-ink-muted)] m-0 leading-relaxed max-w-2xl">
                  {entry.summary}
                </p>
              )}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5 text-xs text-[var(--color-ink-muted)]">
                  {entry.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
