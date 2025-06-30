import { BoardPostForm } from '@/components/board-post-form';

interface WritePageProps {
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

export default async function WritePage({ params }: WritePageProps) {
  // 게시판 정보 가져오기
  let boardName = '';
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/boards/${params.slug}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const board = await response.json();
      boardName = board.name;
    }
  } catch {
    // 에러 무시 (클라이언트에서 처리)
  }

  return <BoardPostForm boardSlug={params.slug} boardName={boardName} />;
}

export async function generateMetadata({ params }: WritePageProps) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/boards/${params.slug}`);
    const board = response.ok ? await response.json() : null;
    
    return {
      title: board ? `글쓰기 - ${board.name}` : '글쓰기',
      description: '새로운 게시글을 작성해보세요.',
    };
  } catch {
    return {
      title: '글쓰기',
      description: '새로운 게시글을 작성해보세요.',
    };
  }
} 