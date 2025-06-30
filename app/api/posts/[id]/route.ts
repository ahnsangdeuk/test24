import { NextRequest, NextResponse } from 'next/server';
import { getPostById, deletePost } from '@/lib/posts-db';

// GET /api/posts/[id] - 특정 글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getPostById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: '글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error);
    return NextResponse.json(
      { error: '글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - 글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deletePost(params.id);

    if (!success) {
      return NextResponse.json(
        { error: '글을 찾을 수 없거나 삭제할 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: '글이 성공적으로 삭제되었습니다.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/posts/[id]:', error);
    return NextResponse.json(
      { error: '글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 