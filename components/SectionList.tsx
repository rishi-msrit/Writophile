'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import type { Post } from '@/lib/types';

interface SectionListProps {
  posts: Post[];
  allTags: string[];
}

const PAGE_SIZE = 10;

export default function SectionList({ posts, allTags }: SectionListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedPosts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleTagClick(tag: string | null) {
    setActiveTag(tag);
    setCurrentPage(1);
  }

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      {/* Tag filter pills (top tags only, max 8) */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[var(--color-rule)]" role="group" aria-label="Filter by tag">
          <span className="text-xs font-mono text-[var(--color-ink-muted)] mr-2">Filter:</span>
          <button
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
              activeTag === null
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-medium'
                : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-dark)]'
            }`}
            onClick={() => handleTagClick(null)}
            aria-pressed={activeTag === null}
          >
            All ({posts.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                activeTag === tag
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-medium'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-dark)]'
              }`}
              onClick={() => handleTagClick(tag === activeTag ? null : tag)}
              aria-pressed={activeTag === tag}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Posts (10 per page) */}
      <div>
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-[var(--color-ink-muted)] font-serif italic text-lg">
            No entries found under this tag.
          </p>
        ) : (
          paginatedPosts.map((post) => (
            <PostCard key={`${post.section}/${post.slug}`} post={post} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-between pt-10 mt-6 border-t border-[var(--color-rule)] font-mono text-xs text-[var(--color-ink-muted)]"
          aria-label="Pagination Navigation"
        >
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-3 py-1.5 rounded border border-[var(--color-rule)] transition-colors ${
              currentPage <= 1
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]'
            }`}
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-semibold'
                    : 'hover:bg-[var(--color-paper-dark)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-1.5 rounded border border-[var(--color-rule)] transition-colors ${
              currentPage >= totalPages
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]'
            }`}
          >
            Next →
          </button>
        </nav>
      )}
    </>
  );
}
