import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByPostId, createComment } from '@/lib/boards';

// GET /api/boards/[slug]/posts/[id]/comments - 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const comments = await getCommentsByPostId(params.id);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error in GET /api/boards/[slug]/posts/[id]/comments:', error);
    return NextResponse.json(
      { error: '댓글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/boards/[slug]/posts/[id]/comments - 새 댓글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const body = await request.json();
    const { content, author, parentId } = body;

    // 유효성 검사
    if (!content?.trim() || !author?.trim()) {
      return NextResponse.json(
        { error: '내용과 작성자는 필수입니다.' },
        { status: 400 }
      );
    }

    const commentData = {
      content: content.trim(),
      author: author.trim(),
      postId: params.id,
      parentId: parentId || undefined,
    };

    const newComment = await createComment(commentData);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/boards/[slug]/posts/[id]/comments:', error);
    return NextResponse.json(
      { error: '댓글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 