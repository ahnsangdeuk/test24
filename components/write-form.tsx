'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PostForm {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export function WriteForm() {
  const router = useRouter();
  const [post, setPost] = useState<PostForm>({
    title: '',
    content: '',
    category: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    '기술',
    '일상',
    '여행',
    '음식',
    '취미',
    '기타'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // 유효성 검사
    if (!post.title.trim() || !post.content.trim()) {
      setMessage({ type: 'error', text: '제목과 내용을 모두 입력해주세요.' });
      setIsSubmitting(false);
      return;
    }

    try {
      // API를 통해 글 저장
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title.trim(),
          content: post.content.trim(),
          category: post.category,
          tags: post.tags
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '글 저장에 실패했습니다.');
      }

      const savedPost = await response.json();
      
      setMessage({ type: 'success', text: '글이 성공적으로 저장되었습니다!' });
      
      // 2초 후 글 목록 페이지로 이동
      setTimeout(() => {
        router.push('/posts');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '글 저장 중 오류가 발생했습니다.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !post.tags.includes(trimmedTag)) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">새 글 작성</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                "w-full px-4 py-3 border border-border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-foreground bg-background"
              )}
              placeholder="글 제목을 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              카테고리
            </label>
            <select
              id="category"
              value={post.category}
              onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
              className={cn(
                "w-full px-4 py-3 border border-border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-foreground bg-background"
              )}
              disabled={isSubmitting}
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 태그 */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
              태그
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={cn(
                    "flex-1 px-4 py-2 border border-border rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    "text-foreground bg-background"
                  )}
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className={cn(
                    "px-4 py-2 bg-primary text-primary-foreground rounded-md",
                    "hover:bg-primary/90 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  disabled={isSubmitting || !tagInput.trim()}
                >
                  추가
                </button>
              </div>
              
              {/* 태그 목록 */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-primary hover:text-primary/70"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
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
              rows={15}
              className={cn(
                "w-full px-4 py-3 border border-border rounded-md resize-vertical",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-foreground bg-background"
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
              {message.type === 'success' && (
                <div className="mt-2 text-sm">
                  잠시 후 글 목록 페이지로 이동합니다...
                </div>
              )}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1 sm:flex-none sm:px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? '저장 중...' : '글 저장'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setPost({ title: '', content: '', category: '', tags: [] });
                setTagInput('');
                setMessage(null);
              }}
              disabled={isSubmitting}
              className={cn(
                "px-6 py-3 border border-border text-foreground rounded-md font-medium",
                "hover:bg-muted transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              초기화
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 