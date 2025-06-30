import { NextResponse } from 'next/server';
import { getAllBoards } from '@/lib/boards';

// GET /api/boards - 모든 게시판 목록 조회
export async function GET() {
  try {
    const boards = await getAllBoards();
    return NextResponse.json(boards);
  } catch (error) {
    console.error('Error in GET /api/boards:', error);
    return NextResponse.json(
      { error: '게시판 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 