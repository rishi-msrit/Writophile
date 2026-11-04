'use client';

import { useEffect } from 'react';

/** Initialises copy buttons on code blocks after hydration. */
export function CopyButtonInit() {
  useEffect(() => {
    function handleCopy(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest('.copy-btn') as HTMLButtonElement | null;
      if (!btn) return;

      const block = btn.closest('.code-block');
      if (!block) return;

      const code = block.querySelector('code, pre');
      const text = code?.textContent ?? '';

      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Clipboard API unavailable — fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    }

    document.addEventListener('click', handleCopy);
    return () => document.removeEventListener('click', handleCopy);
  }, []);

  return null;
}

