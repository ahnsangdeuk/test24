'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Board {
  id: string;
  name: string;
  description: string | null;
  slug: string;
}

interface BoardPost {
  id: string;
  title: string;
  content: string;
  author: string;
  boardId: string;
  viewCount: number;
  isNotice: boolean;
  createdAt: string;
  updatedAt: string;
  board?: Board;
  commentCount?: number;
}

interface BoardPostListProps {
  boardSlug: string;
}

export function BoardPostList({ boardSlug }: BoardPostListProps) {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoard();
    fetchPosts();
  }, [boardSlug]);

  const fetchBoard = async () => {
    try {
      const response = await fetch(`/api/boards/${boardSlug}`);
      
      if (!response.ok) {
        throw new Error('게시판 정보를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setBoard(data);
    } catch (error) {
      console.error('Error fetching board:', error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/boards/${boardSlug}/posts`);
      
      if (!response.ok) {
        throw new Error('게시글 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/boards/${boardSlug}/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('게시글 삭제에 실패했습니다.');
      }

      // 목록에서 삭제된 게시글 제거
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : '게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/boards"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              게시판 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-8">
        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                {board?.name || '게시판'}
              </h1>
              {board?.description && (
                <p className="text-sm sm:text-base text-muted-foreground">{board.description}</p>
              )}
            </div>
          </div>
          
          {/* 모바일 최적화된 액션 버튼 */}
          <div className="flex gap-2 sm:gap-3">
            <Link
              href="/boards"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base border border-border rounded-md hover:bg-muted transition-colors text-center"
            >
              목록
            </Link>
            <Link
              href={`/boards/${boardSlug}/write`}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center"
            >
              글쓰기
            </Link>
          </div>
        </div>

        {/* 게시글 목록 */}
        {isLoading ? (
          <div className="animate-pulse space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 sm:h-20 bg-muted rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className={cn(
                  "border border-border rounded-lg p-3 sm:p-4 transition-all duration-200",
                  "hover:border-primary/50 hover:shadow-md active:bg-muted/50",
                  post.isNotice && "bg-yellow-50 border-yellow-200"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isNotice && (
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex-shrink-0">
                          공지
                        </span>
                      )}
                      <Link
                        href={`/boards/${boardSlug}/posts/${post.id}`}
                        className="text-base sm:text-lg font-semibold text-foreground hover:text-primary line-clamp-2 break-all"
                      >
                        {post.title}
                      </Link>
                    </div>
                    
                    {/* 모바일에서는 세로로 배치, 데스크톱에서는 가로로 배치 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span>👤 {post.author}</span>
                        <span>👁️ {post.viewCount}</span>
                        <span>💬 {post.commentCount || 0}</span>
                      </div>
                      <span className="hidden sm:block">📅 {formatDate(post.createdAt)}</span>
                      <span className="sm:hidden">📅 {formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 text-xs sm:text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

            {posts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  아직 게시글이 없습니다.
                </p>
                <Link
                  href={`/boards/${boardSlug}/write`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  첫 번째 글 작성하기
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 