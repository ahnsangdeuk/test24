import prisma from './prisma';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 모든 글 가져오기
export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      category: post.category || '',
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('글 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 새 글 저장
export async function savePost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  try {
    const newPost = await prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        category: postData.category || null,
        tags: JSON.stringify(postData.tags)
      }
    });

    return {
      ...newPost,
      tags: JSON.parse(newPost.tags || '[]'),
      category: newPost.category || '',
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('글 저장 중 오류가 발생했습니다.');
  }
}

// 글 ID로 특정 글 가져오기
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) return null;

    return {
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      category: post.category || '',
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('글을 불러오는 중 오류가 발생했습니다.');
  }
}

// 글 삭제
export async function deletePost(id: string): Promise<boolean> {
  try {
    await prisma.post.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// 카테고리별 글 필터링
export async function getPostsByCategory(category: string): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        category: category
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      category: post.category || '',
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw new Error('카테고리별 글 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 글 검색
export async function searchPosts(query: string): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            tags: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      category: post.category || '',
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error searching posts:', error);
    throw new Error('글 검색 중 오류가 발생했습니다.');
  }
} 