import { getBlogPosts, getAllTags } from '@/lib/content';
import SectionList from '@/components/SectionList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Essays, reflections, and thoughts on writing, software, and systems by Rishi Raj.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const tags = getAllTags(posts);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14">
      <SectionList posts={posts} allTags={tags} />
    </div>
  );
}

