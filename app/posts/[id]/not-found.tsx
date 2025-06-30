import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              글을 찾을 수 없습니다
            </h1>
            <p className="text-muted mb-6">요청하신 글이 존재하지 않거나 삭제되었을 수 있습니다.</p>
            <Link
              href="/posts"
              className={cn(
                "inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium",
                "hover:bg-primary/90 transition-colors"
              )}
            >
              글 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 