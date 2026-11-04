'use client';

import { useEffect, useState } from 'react';

const SIZES = [15, 17, 19, 22]; // px

export default function FontSizeControls() {
  const [sizeIdx, setSizeIdx] = useState(1); // default: 17px

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fontSize');
      if (saved) {
        const px = parseInt(saved, 10);
        const idx = SIZES.indexOf(px);
        if (idx !== -1) {
          setSizeIdx(idx);
          applySize(px);
        }
      }
    } catch {}
  }, []);

  function applySize(px: number) {
    document.documentElement.style.fontSize = `${px}px`;
    document.documentElement.style.setProperty('--prose-font-size', `${px}px`);
  }

  function decrease() {
    const next = Math.max(0, sizeIdx - 1);
    setSizeIdx(next);
    applySize(SIZES[next]);
    try { localStorage.setItem('fontSize', String(SIZES[next])); } catch {}
  }

  function increase() {
    const next = Math.min(SIZES.length - 1, sizeIdx + 1);
    setSizeIdx(next);
    applySize(SIZES[next]);
    try { localStorage.setItem('fontSize', String(SIZES[next])); } catch {}
  }

  return (
    <div className="flex items-center gap-1 font-mono text-xs border border-[var(--color-rule)] rounded px-1.5 py-0.5" aria-label="Adjust font size" data-noprint>
      <button
        onClick={decrease}
        disabled={sizeIdx === 0}
        aria-label="Decrease font size"
        className="px-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-25 transition-opacity"
      >
        A−
      </button>
      <span className="text-[var(--color-rule)] text-[10px]">|</span>
      <button
        onClick={increase}
        disabled={sizeIdx === SIZES.length - 1}
        aria-label="Increase font size"
        className="px-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-25 transition-opacity font-semibold"
      >
        A+
      </button>
    </div>
  );
}
