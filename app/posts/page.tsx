import { PostsList } from '@/components/posts-list';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그 - 커뮤니티',
  description: '다양한 주제의 블로그 글을 확인해보세요.',
};

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <PostsList />
      </main>
      <Footer />
    </div>
  );
} 