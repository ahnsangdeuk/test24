import { NextRequest, NextResponse } from 'next/server';
import { getBoardBySlug, getBoardPosts, createBoardPost } from '@/lib/boards';

// GET /api/boards/[slug]/posts - 특정 게시판의 글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const board = await getBoardBySlug(params.slug);
    if (!board) {
      return NextResponse.json(
        { error: '게시판을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const posts = await getBoardPosts(board.id, page, limit);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/boards/[slug]/posts:', error);
    return NextResponse.json(
      { error: '게시글 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/boards/[slug]/posts - 새 게시글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { title, content, author, isNotice } = body;

    // 유효성 검사
    if (!title?.trim() || !content?.trim() || !author?.trim()) {
      return NextResponse.json(
        { error: '제목, 내용, 작성자는 필수입니다.' },
        { status: 400 }
      );
    }

    const board = await getBoardBySlug(params.slug);
    if (!board) {
      return NextResponse.json(
        { error: '게시판을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      boardId: board.id,
      isNotice: isNotice || false,
    };

    const newPost = await createBoardPost(postData);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/boards/[slug]/posts:', error);
    return NextResponse.json(
      { error: '게시글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 