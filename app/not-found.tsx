import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <p className="text-7xl font-serif font-light text-[var(--color-ink-muted)] mb-3 opacity-30 select-none">
        404
      </p>
      <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-ink)] mb-4">
        Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-[var(--color-ink-muted)] mb-8 leading-relaxed max-w-md">
        This document could not be found or has moved to another section.
      </p>
      <div className="flex items-center gap-4 justify-center">
        <Link href="/" className="stamp-btn">
          Return Home
        </Link>
        <Link href="/search/" className="stamp-btn">
          Search All Writing
        </Link>
      </div>
    </div>
  );
}
