// 정적 빌드를 위한 mock 데이터
export interface StaticPost {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StaticBoard {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface StaticBoardPost {
  id: string;
  title: string;
  content: string;
  author: string;
  boardSlug: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// 정적 빌드 환경 확인
export const isStaticBuild = process.env.GITHUB_ACTIONS === 'true';

// Mock 데이터
export const mockPosts: StaticPost[] = [
  {
    id: "1",
    title: "정적 빌드 환영 글",
    content: "이것은 GitHub Pages 정적 빌드를 위한 샘플 블로그 글입니다. 실제 데이터베이스 연결 없이 표시됩니다.",
    category: "공지",
    tags: ["환영", "정적빌드", "GitHub Pages"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    title: "Next.js 정적 내보내기",
    content: "Next.js의 정적 내보내기 기능을 사용하여 GitHub Pages에 배포하는 방법을 알아봅시다.",
    category: "기술",
    tags: ["Next.js", "정적빌드", "배포"],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z"
  }
];

export const mockBoards: StaticBoard[] = [
  {
    id: "1",
    name: "공지사항",
    slug: "notice",
    description: "중요한 공지사항을 확인하세요"
  },
  {
    id: "2", 
    name: "자유게시판",
    slug: "free",
    description: "자유롭게 이야기를 나누는 공간입니다"
  },
  {
    id: "3",
    name: "질문게시판", 
    slug: "qna",
    description: "궁금한 것들을 질문하고 답변받는 공간입니다"
  },
  {
    id: "4",
    name: "개발토론",
    slug: "dev",
    description: "개발 관련 정보를 공유하고 토론하는 공간입니다"
  }
];

export const mockBoardPosts: StaticBoardPost[] = [
  {
    id: "board-1",
    title: "공지사항 샘플 글",
    content: "이것은 정적 빌드를 위한 공지사항 샘플입니다.",
    author: "관리자",
    boardSlug: "notice",
    views: 100,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "board-2",
    title: "자유게시판 샘플 글",
    content: "자유게시판의 샘플 글입니다. GitHub Pages에서 정적으로 표시됩니다.",
    author: "사용자1",
    boardSlug: "free",
    views: 50,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z"
  }
];

// 정적 데이터 가져오기 함수들
export function getStaticPosts(): StaticPost[] {
  return mockPosts;
}

export function getStaticPostById(id: string): StaticPost | null {
  return mockPosts.find(post => post.id === id) || null;
}

export function getStaticBoards(): StaticBoard[] {
  return mockBoards;
}

export function getStaticBoardBySlug(slug: string): StaticBoard | null {
  return mockBoards.find(board => board.slug === slug) || null;
}

export function getStaticBoardPosts(boardSlug?: string): StaticBoardPost[] {
  if (boardSlug) {
    return mockBoardPosts.filter(post => post.boardSlug === boardSlug);
  }
  return mockBoardPosts;
}

export function getStaticBoardPostById(id: string): StaticBoardPost | null {
  return mockBoardPosts.find(post => post.id === id) || null;
} 