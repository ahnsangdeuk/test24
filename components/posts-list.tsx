'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['전체', '기술', '일상', '여행', '음식', '취미', '기타'];

  // 글 목록 로드
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // URL 파라미터 구성
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }
      if (selectedCategory && selectedCategory !== '전체') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/posts?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '글 목록을 불러오는데 실패했습니다.');
      }

      const postsData = await response.json();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError(error instanceof Error ? error.message : '글 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadPosts();
  }, []);

  // 검색 및 필터 변경 시 다시 로드
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPosts();
    }, 300); // 디바운싱

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  // 글 삭제 핸들러
  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말로 이 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '글 삭제에 실패했습니다.');
      }

      // 성공시 목록에서 제거
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : '글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 날짜 포맷팅
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

  // 내용 미리보기 (150자 제한)
  const getPreview = (content: string) => {
    if (content.length <= 150) return content;
    return content.substring(0, 150) + '...';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-lg text-muted">글 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button
            onClick={loadPosts}
            className={cn(
              "px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium",
              "hover:bg-primary/90 transition-colors"
            )}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 md:mb-0">글 목록</h1>
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

      {/* 검색 및 필터 */}
      <div className="bg-card rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="제목, 내용, 태그로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-foreground bg-background"
              )}
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-foreground bg-background"
              )}
            >
              {categories.map(category => (
                <option key={category} value={category === '전체' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 글 목록 */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-lg text-muted mb-4">
            {searchQuery || selectedCategory ? '검색 결과가 없습니다.' : '아직 작성된 글이 없습니다.'}
          </div>
          <Link
            href="/write"
            className={cn(
              "inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium",
              "hover:bg-primary/90 transition-colors"
            )}
          >
            첫 번째 글 작성하기
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-card rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              {/* 글 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-2 hover:text-primary">
                    <Link href={`/posts/${post.id}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  {/* 메타 정보 */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                    <span>{formatDate(post.createdAt)}</span>
                    {post.category && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {post.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="글 삭제"
                >
                  🗑️
                </button>
              </div>

              {/* 글 미리보기 */}
              <div className="text-foreground mb-4">
                <p>{getPreview(post.content)}</p>
              </div>

              {/* 태그 */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 더 보기 링크 */}
              <div className="pt-4 border-t border-border">
                <Link
                  href={`/posts/${post.id}`}
                  className="text-primary hover:text-primary/80 font-medium text-sm"
                >
                  전체 글 보기 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 통계 */}
      <div className="mt-8 text-center text-sm text-muted">
        전체 {posts.length}개의 글
        {(searchQuery || selectedCategory) && ' 검색 결과'}
      </div>
    </div>
  );
} 