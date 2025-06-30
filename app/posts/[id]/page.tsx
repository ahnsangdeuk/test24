import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PostDetailClient } from '@/components/post-detail-client';
import { cn } from '@/lib/utils';
import { getStaticPostById, isStaticBuild } from '@/lib/static-data';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

// 정적 빌드를 위한 params 생성
export async function generateStaticParams() {
  // GitHub Actions 환경에서만 정적 params 생성
  if (process.env.GITHUB_ACTIONS === 'true') {
    return [
      { id: '1' },
      { id: '2' }
    ];
  }
  return [];
}

async function getPost(id: string): Promise<Post | null> {
  // 정적 빌드 환경에서는 mock 데이터 사용
  if (isStaticBuild) {
    return getStaticPostById(id);
  }

  // 개발 환경에서는 API 호출
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

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

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
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
              {!isStaticBuild && (
                <div className="flex gap-2">
                  <PostDetailClient postId={post.id} />
                </div>
              )}
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
            <div 
              className="prose prose-lg max-w-none text-foreground"
              style={{ 
                lineHeight: '1.8',
                fontSize: '16px'
              }}
            >
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* 네비게이션 */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <Link
                href="/posts"
                className={cn(
                  "inline-flex items-center px-4 py-2 text-sm bg-muted text-muted-foreground rounded-md",
                  "hover:bg-muted/80 transition-colors"
                )}
              >
                ← 글 목록
              </Link>
              
              <div className="text-sm text-muted">
                글 ID: {post.id}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
} 