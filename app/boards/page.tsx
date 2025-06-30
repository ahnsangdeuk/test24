import { BoardList } from '@/components/board-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '게시판 - 커뮤니티',
  description: '다양한 주제의 게시판에서 소통해보세요.',
};

export default function BoardsPage() {
  return <BoardList />;
} 