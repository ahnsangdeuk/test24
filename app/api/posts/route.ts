import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, savePost, searchPosts, getPostsByCategory } from '@/lib/posts-db';

// GET /api/posts - 글 목록 조회 (검색, 카테고리 필터링 포함)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    let posts;

    if (query) {
      // 검색 쿼리가 있는 경우
      posts = await searchPosts(query);
    } else if (category && category !== '전체') {
      // 카테고리 필터가 있는 경우
      posts = await getPostsByCategory(category);
    } else {
      // 전체 글 목록
      posts = await getAllPosts();
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      { error: '글 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/posts - 새 글 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, tags } = body;

    // 유효성 검사
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      category: category || '',
      tags: Array.isArray(tags) ? tags : []
    };

    const newPost = await savePost(postData);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json(
      { error: '글 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 