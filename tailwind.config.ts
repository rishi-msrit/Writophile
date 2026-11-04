import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-newsreader)', 'var(--font-lora)', 'Georgia', 'serif'],
        body: ['var(--font-newsreader)', 'var(--font-lora)', 'Georgia', 'serif'],
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        bg: 'var(--color-bg)',
        paper: 'var(--color-paper)',
        ink: 'var(--color-ink)',
        rule: 'var(--color-rule)',
        accent: 'var(--color-accent)',
        highlight: 'var(--color-highlight)',
        'margin-line': 'var(--color-margin-line)',
        'paper-dark': 'var(--color-paper-dark)',
      },
      lineHeight: {
        prose: '1.8',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-ink)',
            '--tw-prose-headings': 'var(--color-ink)',
            '--tw-prose-lead': 'var(--color-ink)',
            '--tw-prose-links': 'var(--color-accent)',
            '--tw-prose-bold': 'var(--color-ink)',
            '--tw-prose-counters': 'var(--color-ink)',
            '--tw-prose-bullets': 'var(--color-ink)',
            '--tw-prose-hr': 'var(--color-rule)',
            '--tw-prose-quotes': 'var(--color-ink)',
            '--tw-prose-quote-borders': 'var(--color-accent)',
            '--tw-prose-captions': 'var(--color-ink)',
            '--tw-prose-code': 'var(--color-ink)',
            '--tw-prose-pre-code': 'var(--color-ink)',
            '--tw-prose-pre-bg': 'var(--color-paper-dark)',
            '--tw-prose-th-borders': 'var(--color-rule)',
            '--tw-prose-td-borders': 'var(--color-rule)',
            fontFamily: 'var(--font-newsreader), var(--font-lora), Georgia, serif',
            lineHeight: '1.8',
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontWeight: '600',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
