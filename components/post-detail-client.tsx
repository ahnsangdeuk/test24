'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostDetailClientProps {
  postId: string;
}

export function PostDetailClient({ postId }: PostDetailClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('정말로 이 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/posts/${postId}`, {
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
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 disabled:opacity-50"
      title="글 삭제"
    >
      {isDeleting ? '⏳' : '🗑️'}
    </button>
  );
} 