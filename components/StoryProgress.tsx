'use client';

import { useEffect, useState } from 'react';

interface Props {
  storySlug: string;
  chapterCount: number;
}

export function useContinue(storySlug: string, chapterCount: number) {
  const [lastChapter, setLastChapter] = useState<number | null>(null);

  useEffect(() => {
    try {
      const val = localStorage.getItem(`story:${storySlug}:lastChapter`);
      if (val) {
        const n = parseInt(val, 10);
        if (!isNaN(n) && n >= 1 && n <= chapterCount) {
          setLastChapter(n);
        }
      }
    } catch {}
  }, [storySlug, chapterCount]);

  return lastChapter;
}

export function saveLastChapter(storySlug: string, chapterNum: number) {
  try {
    localStorage.setItem(`story:${storySlug}:lastChapter`, String(chapterNum));
  } catch {}
}

