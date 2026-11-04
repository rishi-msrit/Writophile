// site.config.ts – Central site identity & socials

export interface SocialLink {
  platform: 'github' | 'portfolio' | 'linkedin' | 'wattpad' | 'email';
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  authorName: string;
  aboutBlurb: string;
  defaultOgImage: string;
  socials: SocialLink[];
}

const siteConfig: SiteConfig = {
  name: 'Writophile',
  tagline: 'Technical documentation, speculative fiction, and engineering observations.',
  authorName: 'Rishi Raj',

  aboutBlurb:
    'Written works by Rishi Raj — bridging complex engineering architectures, clear documentation, and literary storytelling.',

  defaultOgImage: '/og-default.png',

  socials: [
    {
      platform: 'github',
      label: 'GitHub',
      href: 'https://github.com/rishi-msrit',
    },
    {
      platform: 'portfolio',
      label: 'Portfolio',
      href: 'https://rishi-msrit.vercel.app/',
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/rishi-msrit/',
    },
    {
      platform: 'email',
      label: 'Email',
      href: 'mailto:rishi.msrit@gmail.com',
    },
    {
      platform: 'wattpad',
      label: 'Wattpad',
      href: 'https://www.wattpad.com/user/rebeln_raven',
    },
  ],
};

export default siteConfig;
