import { BoardPostDetail } from '@/components/board-post-detail';

interface PostDetailPageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  return <BoardPostDetail boardSlug={params.slug} postId={params.id} />;
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/boards/${params.slug}/posts/${params.id}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const post = await response.json();
      return {
        title: `${post.title} - ${post.board?.name || '게시판'}`,
        description: post.content.substring(0, 200) + '...',
      };
    }
  } catch {
    // 에러 무시
  }

  return {
    title: '게시글 보기',
    description: '게시글을 확인해보세요.',
  };
} 