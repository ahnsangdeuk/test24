import { NextRequest, NextResponse } from 'next/server';
import { getBoardPostById, deleteBoardPost } from '@/lib/boards';

// GET /api/boards/[slug]/posts/[id] - 특정 게시글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const post = await getBoardPostById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/boards/[slug]/posts/[id]:', error);
    return NextResponse.json(
      { error: '게시글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/[slug]/posts/[id] - 게시글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const success = await deleteBoardPost(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('Error in DELETE /api/boards/[slug]/posts/[id]:', error);
    return NextResponse.json(
      { error: '게시글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 