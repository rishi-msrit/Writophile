// lib/rss.ts – generates /rss.xml content

import siteConfig from '@/site.config';
import type { Post } from './types';

export function generateRss(posts: Post[]): string {
  const site = siteConfig;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://writeophilia.vercel.app';

  const items = posts
    .filter((p) => p.date)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 20)
    .map((p) => {
      let url: string;
      if (p.section === 'technical') url = `${baseUrl}/technical/${p.slug}/`;
      else if (p.section === 'bits-and-bytes') url = `${baseUrl}/bits-and-bytes/${p.slug}/`;
      else url = `${baseUrl}/fiction/${p.slug}/`;

      return `
  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate>
    <description><![CDATA[${p.summary}]]></description>
    <category>${p.section}</category>
  </item>`.trim();
    })
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${site.name}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${site.tagline}]]></description>
    <language>en</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items}
  </channel>
</rss>`;
}

