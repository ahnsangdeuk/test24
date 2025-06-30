'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BoardPostFormProps {
  boardSlug: string;
  boardName?: string;
}

interface PostForm {
  title: string;
  content: string;
  author: string;
  isNotice: boolean;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

export function BoardPostForm({ boardSlug, boardName }: BoardPostFormProps) {
  const router = useRouter();
  const [post, setPost] = useState<PostForm>({
    title: '',
    content: '',
    author: '',
    isNotice: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // 유효성 검사
    if (!post.title.trim() || !post.content.trim() || !post.author.trim()) {
      setMessage({ type: 'error', text: '제목, 내용, 작성자를 모두 입력해주세요.' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await fetch(`/api/boards/${boardSlug}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title.trim(),
          content: post.content.trim(),
          author: post.author.trim(),
          isNotice: post.isNotice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '게시글 저장에 실패했습니다.');
      }

      const savedPost = await response.json();
      
      setMessage({ type: 'success', text: '게시글이 성공적으로 저장되었습니다!' });
      
      // 2초 후 게시글 상세 페이지로 이동
      setTimeout(() => {
        router.push(`/boards/${boardSlug}/posts/${savedPost.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '게시글 저장 중 오류가 발생했습니다.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between mb-4 gap-3">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
              새 글 작성 {boardName && <span className="block sm:inline text-base sm:text-xl text-muted-foreground">- {boardName}</span>}
            </h1>
            <button
              onClick={() => router.back()}
              className="px-3 sm:px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm sm:text-base min-h-[44px] min-w-[44px] flex-shrink-0"
            >
              취소
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* 작성자 */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-foreground mb-2">
              작성자 *
            </label>
            <input
              type="text"
              id="author"
              value={post.author}
              onChange={(e) => setPost(prev => ({ ...prev, author: e.target.value }))}
              className={cn(
                "w-full px-3 sm:px-4 py-3 border border-border rounded-md text-base",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-foreground bg-background"
              )}
              placeholder="작성자 이름을 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              제목 *
            </label>
            <input
              type="text"
              id="title"
              value={post.title}
              onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
              className={cn(
                "w-full px-3 sm:px-4 py-3 border border-border rounded-md text-base",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-foreground bg-background"
              )}
              placeholder="글 제목을 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          {/* 공지사항 체크박스 */}
          <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-muted/30">
            <input
              type="checkbox"
              id="isNotice"
              checked={post.isNotice}
              onChange={(e) => setPost(prev => ({ ...prev, isNotice: e.target.checked }))}
              className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary"
              disabled={isSubmitting}
            />
            <label htmlFor="isNotice" className="text-sm sm:text-base text-foreground cursor-pointer">
              공지사항으로 등록
            </label>
          </div>

          {/* 내용 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              내용 *
            </label>
            <textarea
              id="content"
              value={post.content}
              onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
              rows={12}
              className={cn(
                "w-full px-3 sm:px-4 py-3 border border-border rounded-md resize-vertical text-base",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-foreground bg-background min-h-[200px] sm:min-h-[300px]"
              )}
              placeholder="글 내용을 입력하세요..."
              disabled={isSubmitting}
            />
          </div>

          {/* 메시지 */}
          {message && (
            <div className={cn(
              "p-4 rounded-md",
              message.type === 'success' 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            )}>
              {message.text}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className={cn(
                "order-2 sm:order-1 py-3 px-6 border border-border rounded-md",
                "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors font-medium text-sm sm:text-base min-h-[48px]"
              )}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "order-1 sm:order-2 flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-md",
                "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors font-medium text-sm sm:text-base min-h-[48px]"
              )}
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 