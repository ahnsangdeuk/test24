import { BoardPostList } from '@/components/board-post-list';
import { getStaticBoardBySlug, isStaticBuild } from '@/lib/static-data';

interface BoardPageProps {
  params: {
    slug: string;
  };
}

// 정적 빌드를 위한 params 생성
export async function generateStaticParams() {
  // GitHub Actions 환경에서만 정적 params 생성
  if (process.env.GITHUB_ACTIONS === 'true') {
    return [
      { slug: 'notice' },
      { slug: 'free' },
      { slug: 'qna' },
      { slug: 'dev' }
    ];
  }
  return [];
}

export default function BoardPage({ params }: BoardPageProps) {
  return <BoardPostList boardSlug={params.slug} />;
}

export async function generateMetadata({ params }: BoardPageProps) {
  // 정적 빌드 환경에서는 mock 데이터 사용
  if (isStaticBuild) {
    const board = getStaticBoardBySlug(params.slug);
    return {
      title: board ? `${board.name} - 게시판` : '게시판',
      description: board ? board.description : '게시판에서 소통해보세요.',
    };
  }

  // 개발 환경에서는 API 호출
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