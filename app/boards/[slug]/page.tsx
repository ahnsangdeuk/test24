import { BoardPostList } from '@/components/board-post-list';

interface BoardPageProps {
  params: {
    slug: string;
  };
}

export default function BoardPage({ params }: BoardPageProps) {
  return <BoardPostList boardSlug={params.slug} />;
}

export async function generateMetadata({ params }: BoardPageProps) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/boards/${params.slug}`);
    const board = response.ok ? await response.json() : null;
    
    return {
      title: board ? `${board.name} - 게시판` : '게시판',
      description: board ? board.description : '게시판에서 소통해보세요.',
    };
  } catch {
    return {
      title: '게시판',
      description: '게시판에서 소통해보세요.',
    };
  }
} 