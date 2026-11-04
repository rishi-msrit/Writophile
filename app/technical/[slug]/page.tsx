import { getTechnicalPosts, getTechnicalPost } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import AttachedLink from '@/components/AttachedLink';
import ReadingProgress from '@/components/ReadingProgress';
import type { Metadata } from 'next';
import siteConfig from '@/site.config';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getTechnicalPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getTechnicalPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary || siteConfig.tagline,
    openGraph: { title: post.title, description: post.summary || siteConfig.tagline },
  };
}

export default async function TechnicalPostPage({ params }: Props) {
  const post = await getTechnicalPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <article className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">

        {/* Top Attached Link Stamp */}
        {post.link && (
          <div className="mb-8">
            <AttachedLink link={post.link} label={post.linkLabel} />
          </div>
        )}

        {/* Header */}
        <header className="mb-10 pb-8 border-b border-[var(--color-rule)]">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider mb-3">
            <span>Technical</span>
            {post.pinned && <span>· ★ Pinned</span>}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-[var(--color-ink)] mb-4 leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[10.5px] sm:text-xs font-mono text-[var(--color-ink-muted)] mb-4">
            {post.date && (
              <time dateTime={post.date} className="whitespace-nowrap">
                {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </time>
            )}
            {post.date && <span className="opacity-40">·</span>}
            <span className="whitespace-nowrap">{post.readingTime}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-[var(--color-ink-muted)]">
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Table of Contents */}
        {post.headings.length >= 3 && (
          <TableOfContents headings={post.headings} />
        )}

        {/* Article Body */}
        <div
          className="prose prose-lg my-10"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Bottom Navigation */}
        <div className="mt-14 pt-8 border-t border-[var(--color-rule)] flex items-center justify-between text-sm font-mono">
          <Link href="/technical/" className="text-[var(--color-accent)] hover:underline no-underline">
            ← All Technical Writing
          </Link>
          {post.link && (
            <AttachedLink link={post.link} label={post.linkLabel} />
          )}
        </div>
      </article>
    </>
  );
}
