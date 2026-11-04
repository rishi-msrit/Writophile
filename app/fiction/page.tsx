import { getFictionItems } from '@/lib/content';
import { getAllTags } from '@/lib/content';
import Link from 'next/link';
import SectionList from '@/components/SectionList';
import AttachedLink from '@/components/AttachedLink';
import type { Metadata } from 'next';
import type { Story } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Fiction',
  description: 'Short stories, satire, and multi-chapter works.',
};

function StoryCard({ story }: { story: Story }) {
  return (
    <article className="py-7 border-b border-[var(--color-rule)] last:border-b-0 group">
      <div className="flex items-center gap-1.5 sm:gap-3 text-[10.5px] sm:text-xs text-[var(--color-ink-muted)] mb-2 font-mono flex-wrap">
        <span className="uppercase tracking-wider text-[var(--color-accent)] font-medium whitespace-nowrap">
          {story.chapters.length} {story.chapters.length === 1 ? 'Chapter' : 'Chapters'}
        </span>
        <span className="opacity-40">·</span>
        <span className={`whitespace-nowrap font-medium ${story.status === 'complete' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
          {story.status}
        </span>
        <span className="opacity-40">·</span>
        <span className="whitespace-nowrap">{story.totalReadingTime} total</span>
        {story.pinned && (
          <span className="text-[var(--color-accent)] font-medium text-[10px] sm:text-[11px] uppercase tracking-wider ml-0.5 sm:ml-1 whitespace-nowrap">
            ★ Pinned
          </span>
        )}
      </div>

      <h3 className="text-xl sm:text-2xl font-serif font-semibold leading-snug mb-2 mt-0">
        <Link
          href={`/fiction/${story.slug}/`}
          className="text-[var(--color-ink)] hover:text-[var(--color-accent)] no-underline transition-colors"
        >
          {story.title}
        </Link>
      </h3>

      {story.summary && (
        <p className="text-sm sm:text-base text-[var(--color-ink-muted)] m-0 leading-relaxed max-w-3xl">
          {story.summary}
        </p>
      )}

      {story.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 text-xs text-[var(--color-ink-muted)]">
          {story.tags.map((tag) => (
            <span key={tag} className="hover:text-[var(--color-ink)] transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {story.link && (
        <div className="mt-4">
          <AttachedLink link={story.link} label={story.linkLabel} />
        </div>
      )}
    </article>
  );
}

export default async function FictionPage() {
  const { stories, standalones } = await getFictionItems();
  const allTags = getAllTags(standalones);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14">
      {/* Stories */}
      {stories.length > 0 && (
        <section className="mb-14">
          <div>
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </section>
      )}

      {/* Standalone pieces */}
      {standalones.length > 0 && (
        <section>
          <SectionList posts={standalones} allTags={allTags} />
        </section>
      )}
    </div>
  );
}
