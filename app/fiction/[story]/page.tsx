import { getFictionItems, getStory, getStandalonePiece } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AttachedLink from '@/components/AttachedLink';
import ReadingProgress from '@/components/ReadingProgress';
import { StoryIndexClient } from './StoryIndexClient';
import type { Metadata } from 'next';
import siteConfig from '@/site.config';

interface Props {
  params: { story: string };
}

export async function generateStaticParams() {
  const { stories, standalones } = await getFictionItems();
  return [
    ...stories.map((s) => ({ story: s.slug })),
    ...standalones.map((s) => ({ story: s.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await getStory(params.story);
  if (story) {
    return {
      title: story.title,
      description: story.summary || siteConfig.tagline,
    };
  }
  const piece = await getStandalonePiece(params.story);
  if (piece) {
    return {
      title: piece.title,
      description: piece.summary || siteConfig.tagline,
    };
  }
  return {};
}

export default async function FictionStoryPage({ params }: Props) {
  // Try as a multi-chapter story first
  const story = await getStory(params.story);

  if (story) {
    const firstChapterSlug = story.chapters[0]?.slug;

    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        {story.link && (
          <div className="mb-8">
            <AttachedLink link={story.link} label={story.linkLabel} />
          </div>
        )}

        <header className="mb-10 pb-8 border-b border-[var(--color-rule)]">
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-ink-muted)] mb-3">
            <span className="uppercase tracking-wider text-[var(--color-accent)] font-medium">Fiction</span>
            <span className="opacity-40">·</span>
            <span>{story.chapters.length} Chapters</span>
            <span className="opacity-40">·</span>
            <span className={story.status === 'complete' ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-amber-700 dark:text-amber-400 font-medium'}>
              {story.status}
            </span>
            {story.pinned && <span>· ★ Pinned</span>}
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-semibold text-[var(--color-ink)] mb-4 leading-tight tracking-tight">
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[var(--color-ink-muted)] mb-4">
            {story.date && (
              <time dateTime={story.date}>
                {new Date(story.date + 'T00:00:00').toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
            )}
            {story.date && <span className="opacity-40">·</span>}
            <span>{story.totalReadingTime} total reading time</span>
          </div>

          {story.summary && (
            <p className="text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed max-w-2xl mb-4">
              {story.summary}
            </p>
          )}

          {story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-[var(--color-ink-muted)]">
              {story.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Start / Continue Reading & Chapter List */}
        <StoryIndexClient
          storySlug={story.slug}
          firstChapterSlug={firstChapterSlug ?? ''}
          chapters={story.chapters}
        />

        <div className="mt-14 pt-8 border-t border-[var(--color-rule)] text-sm font-mono">
          <Link href="/fiction/" className="text-[var(--color-accent)] hover:underline no-underline">
            ← All Fiction
          </Link>
        </div>
      </div>
    );
  }

  // Try as a standalone piece
  const piece = await getStandalonePiece(params.story);
  if (!piece) notFound();

  return (
    <>
      <ReadingProgress />
      <article className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        {piece.link && (
          <div className="mb-8">
            <AttachedLink link={piece.link} label={piece.linkLabel} />
          </div>
        )}

        <header className="mb-10 pb-8 border-b border-[var(--color-rule)]">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider mb-3">
            <span>Fiction · Standalone</span>
            {piece.pinned && <span>· ★ Pinned</span>}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-[var(--color-ink)] mb-4 leading-[1.15] tracking-tight">
            {piece.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[var(--color-ink-muted)] mb-4">
            {piece.date && (
              <time dateTime={piece.date}>
                {new Date(piece.date + 'T00:00:00').toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
            )}
            {piece.date && <span className="opacity-40">·</span>}
            <span>{piece.readingTime}</span>
          </div>

          {piece.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-[var(--color-ink-muted)]">
              {piece.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-lg my-10"
          dangerouslySetInnerHTML={{ __html: piece.contentHtml }}
        />

        <div className="mt-14 pt-8 border-t border-[var(--color-rule)] flex items-center justify-between text-sm font-mono">
          <Link href="/fiction/" className="text-[var(--color-accent)] hover:underline no-underline">
            ← All Fiction
          </Link>
          {piece.link && (
            <AttachedLink link={piece.link} label={piece.linkLabel} />
          )}
        </div>
      </article>
    </>
  );
}
