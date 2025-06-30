import { WriteForm } from '@/components/write-form';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '글쓰기 - 커뮤니티',
  description: '새로운 블로그 글을 작성해보세요.',
};

export default function WritePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <WriteForm />
      </main>
      <Footer />
    </div>
  );
} 