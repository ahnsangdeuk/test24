import { NextRequest, NextResponse } from 'next/server';
import { getBoardBySlug } from '@/lib/boards';

// GET /api/boards/[slug] - 특정 게시판 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const board = await getBoardBySlug(params.slug);
    
    if (!board) {
      return NextResponse.json(
        { error: '게시판을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error('Error in GET /api/boards/[slug]:', error);
    return NextResponse.json(
      { error: '게시판 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 