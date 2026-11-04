import { getAboutPage } from '@/lib/content';
import siteConfig from '@/site.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: siteConfig.aboutBlurb,
};

export default async function AboutPage() {
  const { html, title } = await getAboutPage();

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <header className="mb-10 pb-8 border-b border-[var(--color-rule)]">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--color-accent)] mb-3">
          Author · {siteConfig.authorName}
        </p>
        <h1 className="text-4xl sm:text-6xl font-serif font-semibold text-[var(--color-ink)] mb-4 tracking-tight">
          {title}
        </h1>
      </header>

      <div
        className="prose prose-lg my-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Socials */}
      <section className="mt-14 pt-8 border-t border-[var(--color-rule)]">
        <h2 className="text-2xl font-serif font-semibold text-[var(--color-ink)] mb-4">
          Connect &amp; Contact
        </h2>
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
