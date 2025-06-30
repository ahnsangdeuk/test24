'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        if (typeof params.id !== 'string') {
          throw new Error('잘못된 글 ID입니다.');
        }

        const response = await fetch(`/api/posts/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('글을 찾을 수 없습니다.');
          }
          const errorData = await response.json();
          throw new Error(errorData.error || '글을 불러오는데 실패했습니다.');
        }

        const postData = await response.json();
        setPost(postData);
      } catch (error) {
        console.error('Error loading post:', error);
        setError(error instanceof Error ? error.message : '글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id]);

  const handleDelete = async () => {
    if (!post || !confirm('정말로 이 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '글 삭제에 실패했습니다.');
      }

      router.push('/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : '글 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-12">
              <div className="text-lg text-muted">글을 불러오는 중...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {error || '글을 찾을 수 없습니다'}
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <article className="max-w-4xl mx-auto p-6">
          {/* 네비게이션 */}
          <div className="mb-6">
            <Link
              href="/posts"
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              ← 글 목록으로 돌아가기
            </Link>
          </div>

          {/* 글 헤더 */}
          <header className="bg-card rounded-lg shadow p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-4">{post.title}</h1>
                
                {/* 메타 정보 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                  <span>작성일: {formatDate(post.createdAt)}</span>
                  {post.createdAt !== post.updatedAt && (
                    <span>수정일: {formatDate(post.updatedAt)}</span>
                  )}
                  {post.category && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50"
                  title="글 삭제"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* 글 내용 */}
          <div className="bg-card rounded-lg shadow p-8">
            <div className="prose max-w-none">
              <div className="text-foreground whitespace-pre-wrap leading-relaxed text-base">
                {post.content}
              </div>
            </div>
          </div>

          {/* 하단 네비게이션 */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex justify-between items-center">
              <Link
                href="/posts"
                className={cn(
                  "inline-flex items-center px-4 py-2 border border-border text-foreground rounded-md font-medium",
                  "hover:bg-muted transition-colors"
                )}
              >
                글 목록
              </Link>
              
              <Link
                href="/write"
                className={cn(
                  "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium",
                  "hover:bg-primary/90 transition-colors"
                )}
              >
                새 글 작성
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
} 