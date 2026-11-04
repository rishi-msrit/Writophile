'use client';

import Link from 'next/link';
import { useContinue } from '@/components/StoryProgress';
import type { ChapterMeta } from '@/lib/types';

interface Props {
  storySlug: string;
  firstChapterSlug: string;
  chapters: ChapterMeta[];
}

export function StoryIndexClient({ storySlug, firstChapterSlug, chapters }: Props) {
  const lastChapter = useContinue(storySlug, chapters.length);

  const continueChapter = lastChapter
    ? chapters.find((c) => c.num === lastChapter) ?? chapters[0]
    : null;

  const startHref = `/fiction/${storySlug}/${firstChapterSlug}/`;
  const continueHref = continueChapter
    ? `/fiction/${storySlug}/${continueChapter.slug}/`
    : startHref;

  return (
    <div>
      {/* Start / Continue Button */}
      <div className="mb-12 flex items-center gap-4 flex-wrap">
        <Link
          href={continueChapter ? continueHref : startHref}
          className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity no-underline"
        >
          <span>{continueChapter ? `Continue from Chapter ${continueChapter.num}` : 'Start Reading'}</span>
          <span>→</span>
        </Link>
        {continueChapter && (
          <Link href={startHref} className="text-xs font-mono text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] no-underline">
            Restart from Chapter 1
          </Link>
        )}
      </div>

      {/* Chapter list */}
      <section>
        <h2 className="text-2xl font-serif font-semibold text-[var(--color-ink)] mb-4">
          Chapters ({chapters.length})
        </h2>
        <ol className="list-none m-0 p-0 border-t border-[var(--color-rule)]">
          {chapters.map((ch) => (
            <li key={ch.slug} className="border-b border-[var(--color-rule)] py-4">
              <Link
                href={`/fiction/${storySlug}/${ch.slug}/`}
                className="flex items-baseline justify-between gap-4 text-[var(--color-ink)] hover:text-[var(--color-accent)] no-underline group transition-colors"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-xs text-[var(--color-ink-muted)] font-mono">
                    {String(ch.num).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-medium group-hover:underline">
                    {ch.title}
                  </span>
                </div>
                <span className="text-xs text-[var(--color-ink-muted)] font-mono flex-shrink-0">
                  {ch.readingTime}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
