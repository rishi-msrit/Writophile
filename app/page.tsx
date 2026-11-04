import Link from 'next/link';
import { getAllPosts, getPinnedPosts, getLatestPosts } from '@/lib/content';
import siteConfig from '@/site.config';
import PostCard from '@/components/PostCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.tagline,
};

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const pinned = getPinnedPosts(allPosts);
  const latest = getLatestPosts(allPosts, 10);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14">

      {/* ── Pinned ───────────────────────────────────── */}
      {pinned.length > 0 && (
        <section className="pb-14 border-b border-[var(--color-rule)]" aria-label="Pinned posts">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--color-ink)]">
              Pinned Writing
            </h2>
            <span className="text-[11px] sm:text-xs font-mono text-[var(--color-ink-muted)] whitespace-nowrap">
              {pinned.length} selected piece{pinned.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div>
            {pinned.map((post) => (
              <PostCard key={`${post.section}/${post.slug}`} post={post} showSection />
            ))}
          </div>
        </section>
      )}

      {/* ── Latest ───────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="py-14 border-b border-[var(--color-rule)]" aria-label="Latest posts">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--color-ink)]">
              Latest Writing
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs font-mono flex-wrap">
              <Link href="/technical/" className="text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] no-underline">
                Technical
              </Link>
              <span className="text-[var(--color-rule)]">/</span>
              <Link href="/fiction/" className="text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] no-underline">
                Fiction
              </Link>
              <span className="text-[var(--color-rule)]">/</span>
              <Link href="/bits-and-bytes/" className="text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] no-underline">
                Bits &amp; Bytes
              </Link>
              <span className="text-[var(--color-rule)]">/</span>
              <Link href="/blog/" className="text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] no-underline">
                Blog
              </Link>
            </div>
          </div>
          <div>
            {latest.map((post) => (
              <PostCard key={`${post.section}/${post.slug}`} post={post} showSection />
            ))}
          </div>
        </section>
      )}

      {/* ── Find me elsewhere ────────────────────────── */}
      <section className="py-14" aria-label="Find me elsewhere">
        <h2 className="text-2xl font-serif font-semibold text-[var(--color-ink)] mb-4">
          Elsewhere
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)] mb-6 max-w-lg">
          Profiles, repositories, fiction serialization, and direct contact.
        </p>
        <ul className="flex flex-wrap gap-3 list-none m-0 p-0">
          {siteConfig.socials.map((s) => (
            <li key={s.platform}>
              <a
                href={s.href}
                rel="noopener noreferrer"
                target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                className="stamp-btn"
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
