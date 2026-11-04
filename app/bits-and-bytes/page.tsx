import { getBitsAndBytesPosts, getAllTags } from '@/lib/content';
import SectionList from '@/components/SectionList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bits & Bytes',
  description: 'Short observations, tools, and lessons learned.',
};

export default async function BitsAndBytesPage() {
  const posts = await getBitsAndBytesPosts();
  const tags = getAllTags(posts);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14">
      <SectionList posts={posts} allTags={tags} />
    </div>
  );
}
