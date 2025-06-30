export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const POSTS_STORAGE_KEY = 'blog_posts';

// 로컬 스토리지에서 모든 글 가져오기
export function getAllPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const posts = localStorage.getItem(POSTS_STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

// 새 글 저장
export function savePost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
  if (typeof window === 'undefined') throw new Error('localStorage is not available');

  const now = new Date().toISOString();
  const newPost: Post = {
    ...postData,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: now,
    updatedAt: now,
  };

  const existingPosts = getAllPosts();
  const updatedPosts = [newPost, ...existingPosts];
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
  
  return newPost;
}

// 글 ID로 특정 글 가져오기
export function getPostById(id: string): Post | null {
  const posts = getAllPosts();
  return posts.find(post => post.id === id) || null;
}

// 글 삭제
export function deletePost(id: string): boolean {
  if (typeof window === 'undefined') return false;

  const posts = getAllPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length === posts.length) {
    return false; // 삭제할 글이 없음
  }
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(filteredPosts));
  return true;
}

// 카테고리별 글 필터링
export function getPostsByCategory(category: string): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => post.category === category);
}

// 태그별 글 필터링
export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
}

// 글 검색
export function searchPosts(query: string): Post[] {
  const posts = getAllPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
} 