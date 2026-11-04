'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveLastChapter } from '@/components/StoryProgress';
import type { ChapterMeta } from '@/lib/types';

interface Props {
  storySlug: string;
  currentSlug: string;
  currentNum: number;
  chapters: ChapterMeta[];
  prevSlug: string | null;
  nextSlug: string | null;
  position: 'top' | 'bottom';
}

export function ChapterNavClient({
  storySlug,
  currentSlug,
  currentNum,
  chapters,
  prevSlug,
  nextSlug,
  position,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    saveLastChapter(storySlug, currentNum);
  }, [storySlug, currentNum]);

  const prevHref = prevSlug ? `/fiction/${storySlug}/${prevSlug}/` : null;
  const nextHref = nextSlug ? `/fiction/${storySlug}/${nextSlug}/` : null;

  return (
    <nav
      aria-label={`Chapter navigation (${position})`}
      className="flex flex-wrap items-center justify-between gap-4 my-6 py-2"
    >
      {/* Prev */}
      <div>
        {prevHref ? (
          <Link
            href={prevHref}
            className="stamp-btn text-xs font-mono"
          >
            ← Previous
          </Link>
        ) : (
          <span className="stamp-btn text-xs font-mono opacity-25 cursor-not-allowed select-none" aria-disabled>
            ← Previous
          </span>
        )}
      </div>

      {/* Chapter jump dropdown */}
      <select
        aria-label="Jump to chapter"
        className="font-mono text-xs bg-[var(--color-paper-dark)] border border-[var(--color-rule)] text-[var(--color-ink)] px-3 py-1.5 rounded focus:outline-none focus:border-[var(--color-accent)]"
        value={currentSlug}
        onChange={(e) => {
          router.push(`/fiction/${storySlug}/${e.target.value}/`);
        }}
      >
        {chapters.map((ch) => (
          <option key={ch.slug} value={ch.slug}>
            Chapter {ch.num}: {ch.title}
          </option>
        ))}
      </select>

      {/* Next */}
      <div>
        {nextHref ? (
          <Link
            href={nextHref}
            className="stamp-btn text-xs font-mono"
          >
            Next →
          </Link>
        ) : (
          <span className="stamp-btn text-xs font-mono opacity-25 cursor-not-allowed select-none" aria-disabled>
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}
