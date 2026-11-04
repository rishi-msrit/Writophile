import { getFictionItems, getStory, getChapter } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReadingProgress from '@/components/ReadingProgress';
import AttachedLink from '@/components/AttachedLink';
import { ChapterNavClient } from './ChapterNavClient';
import type { Metadata } from 'next';

interface Props {
  params: { story: string; chapter: string };
}

export async function generateStaticParams() {
  const { stories } = await getFictionItems();
  const params: { story: string; chapter: string }[] = [];
  for (const story of stories) {
    for (const ch of story.chapters) {
      params.push({ story: story.slug, chapter: ch.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [story, chapter] = await Promise.all([
    getStory(params.story),
    getChapter(params.story, params.chapter),
  ]);
  if (!chapter) return {};
  return {
    title: `${chapter.title}${story ? ` — ${story.title}` : ''}`,
    description: chapter.summary || story?.summary || '',
  };
}

export default async function ChapterPage({ params }: Props) {
  const [story, chapter] = await Promise.all([
    getStory(params.story),
    getChapter(params.story, params.chapter),
  ]);
  if (!chapter || !story) notFound();

  const chapterIndex = story.chapters.findIndex((c) => c.slug === params.chapter);
  const prevChapter = chapterIndex > 0 ? story.chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < story.chapters.length - 1 ? story.chapters[chapterIndex + 1] : null;

  return (
    <>
      <ReadingProgress />
      <article className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-[var(--color-ink-muted)] mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/fiction/" className="hover:text-[var(--color-accent)] no-underline hover:underline">
            Fiction
          </Link>
          <span className="opacity-40">/</span>
          <Link
            href={`/fiction/${story.slug}/`}
            className="hover:text-[var(--color-accent)] no-underline hover:underline"
          >
            {story.title}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-[var(--color-ink)]">Chapter {chapter.chapterNum}</span>
        </nav>

        {story.link && (
          <div className="mb-8">
            <AttachedLink link={story.link} label={story.linkLabel} />
          </div>
        )}

        {/* Header */}
        <header className="mb-10 pb-8 border-b border-[var(--color-rule)]">
          <p className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider mb-2">
            Chapter {chapter.chapterNum} of {story.chapters.length}
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[var(--color-ink)] mb-3 leading-tight tracking-tight">
            {chapter.title}
          </h1>
          <p className="text-xs font-mono text-[var(--color-ink-muted)] m-0">{chapter.readingTime}</p>
        </header>

        {/* Top chapter navigation */}
        <ChapterNavClient
          storySlug={story.slug}
          currentSlug={params.chapter}
          currentNum={chapter.chapterNum ?? 1}
          chapters={story.chapters}
          prevSlug={prevChapter?.slug ?? null}
          nextSlug={nextChapter?.slug ?? null}
          position="top"
        />

        {/* Prose Content */}
        <div
          className="prose prose-lg my-12"
          dangerouslySetInnerHTML={{ __html: chapter.contentHtml }}
        />

        {/* Bottom chapter navigation */}
        <ChapterNavClient
          storySlug={story.slug}
          currentSlug={params.chapter}
          currentNum={chapter.chapterNum ?? 1}
          chapters={story.chapters}
          prevSlug={prevChapter?.slug ?? null}
          nextSlug={nextChapter?.slug ?? null}
          position="bottom"
        />

        <div className="mt-14 pt-8 border-t border-[var(--color-rule)] flex items-center justify-between text-sm font-mono">
          <Link
            href={`/fiction/${story.slug}/`}
            className="text-[var(--color-accent)] hover:underline no-underline"
          >
            ← Back to {story.title}
          </Link>
          {story.link && (
            <AttachedLink link={story.link} label={story.linkLabel} />
          )}
        </div>
      </article>
    </>
  );
}
