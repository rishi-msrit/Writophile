import type { ParsedHeading } from '@/lib/markdown';

interface TableOfContentsProps {
  headings: ParsedHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length < 3) return null;

  // Only show h2 and h3
  const filtered = headings.filter((h) => h.level === 2 || h.level === 3);
  if (filtered.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="my-8 p-5 bg-[var(--color-paper-dark)]/70 border-l-2 border-[var(--color-accent)] rounded-r-lg"
    >
      <p className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] font-mono m-0 mb-3 font-semibold">
        Table of Contents
      </p>
      <ol className="list-none m-0 p-0 space-y-1.5">
        {filtered.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: h.level === 3 ? '1.25rem' : '0' }}
          >
            <a
              href={`#${h.id}`}
              className="text-sm text-[var(--color-ink)] hover:text-[var(--color-accent)] no-underline leading-snug block transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
