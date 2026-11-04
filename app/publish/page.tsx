import type { Metadata } from 'next';
import PublishClient from './PublishClient';

export const metadata: Metadata = {
  title: 'Publish Assistant',
  robots: { index: false, follow: false },
};

export default function PublishPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <header className="mb-10 pb-8 border-b border-[var(--color-rule)]">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--color-accent)] mb-3">
          Authoring Assistant
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[var(--color-ink)] mb-3 tracking-tight">
          Publish a Post
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-ink-muted)] leading-relaxed max-w-xl">
          Fill in parameters, attach external links, compose or paste your writing, and download the ready-to-push <code className="text-xs bg-[var(--color-paper-dark)] border border-[var(--color-rule)] px-1.5 py-0.5 rounded font-mono">.md</code> or <code className="text-xs bg-[var(--color-paper-dark)] border border-[var(--color-rule)] px-1.5 py-0.5 rounded font-mono">.txt</code> file.
        </p>
      </header>
      <PublishClient />
    </div>
  );
}
