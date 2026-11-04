import Link from 'next/link';
import type { Post } from '@/lib/types';
import { linkLabel } from '@/lib/frontmatter';

interface PostCardProps {
  post: Post;
  showSection?: boolean;
}

const SECTION_LABEL: Record<string, string> = {
  technical: 'Technical',
  fiction: 'Fiction',
  'bits-and-bytes': 'Bits & Bytes',
  blog: 'Blog',
};

export default function PostCard({ post, showSection }: PostCardProps) {
  const sectionPath =
    post.section === 'technical' ? 'technical'
    : post.section === 'bits-and-bytes' ? 'bits-and-bytes'
    : post.section === 'blog' ? 'blog'
    : 'fiction';

  const href = `/${sectionPath}/${post.slug}/`;
  const label = post.link ? linkLabel(post.link, post.linkLabel) : null;

  return (
    <article className="py-7 border-b border-[var(--color-rule)] last:border-b-0 group">
      {/* Metadata line */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10.5px] sm:text-xs text-[var(--color-ink-muted)] mb-2 font-mono flex-wrap">
        {showSection && (
          <span className="uppercase tracking-wider text-[var(--color-accent)] font-medium whitespace-nowrap">
            {SECTION_LABEL[post.section] ?? post.section}
          </span>
        )}
        {showSection && <span className="opacity-40">·</span>}
        {post.date && (
          <time dateTime={post.date} className="whitespace-nowrap">
            {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </time>
        )}
        {!post.date && <span className="whitespace-nowrap">Undated</span>}
        <span className="opacity-40">·</span>
        <span className="whitespace-nowrap">{post.readingTime}</span>
        {post.pinned && (
          <span className="ml-0.5 sm:ml-1 text-[var(--color-accent)] font-medium text-[10px] sm:text-[11px] uppercase tracking-wider whitespace-nowrap">
            ★ Pinned
          </span>
        )}

        {/* External link icon if attached */}
        {post.link && label && (
          <a
            href={post.link}
            rel="noopener noreferrer"
            target="_blank"
            aria-label={label}
            title={label}
            className="ml-auto text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1 text-[10px] sm:text-[11px] whitespace-nowrap"
          >
            <span className="hidden sm:inline opacity-80">{label}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M8.914 6.025a.75.75 0 011.06 0 3.5 3.5 0 000 4.95l-2 2a3.5 3.5 0 01-4.95-4.95l1.172-1.172a.75.75 0 011.06 1.061L4.085 9.086a2 2 0 002.829 2.828l2-2a2 2 0 000-2.829.75.75 0 010-1.06zm1.172-1.172a.75.75 0 011.06 0 3.5 3.5 0 014.95 4.95l-1.172 1.172a.75.75 0 01-1.06-1.06l1.172-1.173a2 2 0 00-2.829-2.828l-2 2a2 2 0 000 2.828.75.75 0 01-1.06 1.06 3.5 3.5 0 010-4.95l2-2z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-serif font-semibold leading-snug mb-2 mt-0">
        <Link href={href} className="text-[var(--color-ink)] hover:text-[var(--color-accent)] no-underline transition-colors">
          {post.title}
        </Link>
      </h2>

      {/* Summary */}
      {post.summary && (
        <p className="text-sm sm:text-base text-[var(--color-ink-muted)] m-0 leading-relaxed line-clamp-2 max-w-3xl">
          {post.summary}
        </p>
      )}

      {/* Subtle tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 text-xs text-[var(--color-ink-muted)]">
          {post.tags.map((tag) => (
            <span key={tag} className="hover:text-[var(--color-ink)] transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
