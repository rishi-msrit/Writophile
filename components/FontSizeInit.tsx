'use client';

import { useEffect } from 'react';

/** Applies persisted font size on first paint to avoid a flash */
export function FontSizeInit() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fontSize');
      if (saved) {
        const px = parseInt(saved, 10);
        if (!isNaN(px)) {
          document.documentElement.style.setProperty('--prose-font-size', `${px}px`);
        }
      }
    } catch {}
  }, []);

  return null;
}
