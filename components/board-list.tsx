'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Board {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
}

export function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/boards');
      
      if (!response.ok) {
        throw new Error('게시판 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBoards}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">게시판</h1>
        
        <div className="space-y-3 sm:space-y-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.slug}`}
              className={cn(
                "block p-4 sm:p-6 border border-border rounded-lg transition-all duration-200",
                "hover:border-primary/50 hover:shadow-md hover:bg-muted/50",
                "active:bg-muted/70 touch-manipulation"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                    {board.name}
                  </h2>
                  {board.description && (
                    <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                      {board.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>📝 {board.postCount || 0}개의 글</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-3 sm:ml-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm sm:text-base">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {boards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              아직 게시판이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 