import { getAllPosts } from '@/lib/content';
import { generateRss } from '@/lib/rss';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const posts = await getAllPosts();
  const rss = generateRss(posts);
  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

