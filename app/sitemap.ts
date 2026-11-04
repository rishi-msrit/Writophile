import { MetadataRoute } from 'next';
import { getAllPosts, getFictionItems } from '@/lib/content';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://writeophilia.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allPosts, { stories }] = await Promise.all([
    getAllPosts(),
    getFictionItems(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}/technical/`, priority: 0.9 },
    { url: `${baseUrl}/fiction/`, priority: 0.9 },
    { url: `${baseUrl}/bits-and-bytes/`, priority: 0.9 },
    { url: `${baseUrl}/about/`, priority: 0.8 },
    { url: `${baseUrl}/search/`, priority: 0.5 },
  ];

  const postPages: MetadataRoute.Sitemap = allPosts.map((p) => {
    let url: string;
    if (p.section === 'technical') url = `${baseUrl}/technical/${p.slug}/`;
    else if (p.section === 'bits-and-bytes') url = `${baseUrl}/bits-and-bytes/${p.slug}/`;
    else url = `${baseUrl}/fiction/${p.slug}/`;
    return {
      url,
      lastModified: p.date ? new Date(p.date) : undefined,
      priority: 0.7,
    };
  });

  const storyPages: MetadataRoute.Sitemap = stories.flatMap((s) => [
    { url: `${baseUrl}/fiction/${s.slug}/`, priority: 0.8 },
    ...s.chapters.map((ch) => ({
      url: `${baseUrl}/fiction/${s.slug}/${ch.slug}/`,
      priority: 0.6,
    })),
  ]);

  return [...staticPages, ...postPages, ...storyPages];
}

