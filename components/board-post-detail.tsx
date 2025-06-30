'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

interface Comment {
  id: string;
  content: string;
  author: string;
  postId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface BoardPostDetailProps {
  boardSlug: string;
  postId: string;
}

interface CommentForm {
  content: string;
  author: string;
  parentId?: string;
}

export function BoardPostDetail({ boardSlug, postId }: BoardPostDetailProps) {
  const router = useRouter();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 댓글 작성 상태
  const [commentForm, setCommentForm] = useState<CommentForm>({
    content: '',
    author: '',
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/boards/${boardSlug}/posts/${postId}`);
      
      if (!response.ok) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/boards/${boardSlug}/posts/${postId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleDelete = async () => {
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

      alert('게시글이 삭제되었습니다.');
      router.push(`/boards/${boardSlug}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : '게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.content.trim() || !commentForm.author.trim()) {
      alert('내용과 작성자를 모두 입력해주세요.');
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await fetch(`/api/boards/${boardSlug}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentForm.content.trim(),
          author: commentForm.author.trim(),
          parentId: replyTo,
        }),
      });

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.');
      }

      // 댓글 목록 새로고침
      await fetchComments();
      
      // 폼 초기화
      setCommentForm({ content: '', author: '' });
      setReplyTo(null);
      
    } catch (error) {
      console.error('Error creating comment:', error);
      alert(error instanceof Error ? error.message : '댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
            <Link
              href={`/boards/${boardSlug}`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              게시판으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* 게시글 내용 */}
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-8">
        {/* 헤더 */}
        <div className="mb-4 sm:mb-6">
          {/* 브레드크럼 */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4 text-sm">
            <Link
              href={`/boards/${boardSlug}`}
              className="text-primary hover:underline truncate"
            >
              {post.board?.name || '게시판'}
            </Link>
            <span className="text-muted-foreground">›</span>
            <span className="text-muted-foreground">글 보기</span>
          </div>
          
          {/* 액션 버튼 - 모바일에서는 하단에 고정 */}
          <div className="flex justify-end mb-3">
            <button
              onClick={handleDelete}
              className="px-3 py-2 text-red-500 hover:text-red-700 text-sm border border-red-200 rounded hover:bg-red-50 min-h-[44px] min-w-[44px]"
            >
              삭제
            </button>
          </div>
        </div>

        {/* 제목 */}
        <div className="mb-4">
          {post.isNotice && (
            <span className="inline-block px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded mb-2">
              공지
            </span>
          )}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words leading-tight">
            {post.title}
          </h1>
        </div>

        {/* 메타 정보 */}
        <div className="mb-4 sm:mb-6 pb-4 border-b border-border">
          {/* 모바일에서는 세로로, 데스크톱에서는 가로로 배치 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-3 sm:gap-4">
              <span>👤 {post.author}</span>
              <span>👁️ {post.viewCount}</span>
              <span>💬 {comments.length}</span>
            </div>
            <span>📅 {formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* 내용 */}
        <div className="prose prose-sm sm:prose max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed break-words">
            {post.content}
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
          댓글 ({comments.length})
        </h2>

        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {replyTo && (
            <div className="bg-muted p-3 rounded-md flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                답글을 작성하고 있습니다.
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-red-500 hover:text-red-700 text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                취소
              </button>
            </div>
          )}
          
          {/* 모바일에서는 세로로 배치 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="작성자"
              value={commentForm.author}
              onChange={(e) => setCommentForm(prev => ({ ...prev, author: e.target.value }))}
              className="w-full sm:w-32 px-3 py-3 sm:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
              disabled={isSubmittingComment}
            />
            <input
              type="text"
              placeholder="댓글을 입력하세요..."
              value={commentForm.content}
              onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
              className="flex-1 px-3 py-3 sm:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
              disabled={isSubmittingComment}
            />
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="px-4 py-3 sm:py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 min-h-[44px] text-sm sm:text-base"
            >
              {isSubmittingComment ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>

        {/* 댓글 목록 */}
        <div className="space-y-3 sm:space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-border rounded-lg p-3 sm:p-4">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                  <span className="font-medium text-foreground text-sm sm:text-base">{comment.author}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-xs sm:text-sm text-primary hover:underline flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  답글
                </button>
              </div>
              
              <p className="text-foreground whitespace-pre-wrap mb-3 text-sm sm:text-base break-words leading-relaxed">
                {comment.content}
              </p>

              {/* 대댓글 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-3 sm:ml-6 space-y-3 border-l-2 border-muted pl-3 sm:pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <span className="font-medium text-foreground text-sm">{reply.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap text-sm break-words leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">아직 댓글이 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-1">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 