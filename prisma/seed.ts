import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // 기본 게시판들 생성
  const boards = [
    {
      name: '공지사항',
      description: '사이트 관련 공지사항을 확인하세요',
      slug: 'notice',
      order: 1,
    },
    {
      name: '자유게시판',
      description: '자유롭게 이야기를 나누는 공간입니다',
      slug: 'free',
      order: 2,
    },
    {
      name: '질문게시판',
      description: '궁금한 것이 있으면 언제든지 질문하세요',
      slug: 'qna',
      order: 3,
    },
    {
      name: '개발토론',
      description: '개발 관련 토론과 정보 공유',
      slug: 'dev',
      order: 4,
    },
  ];

  for (const boardData of boards) {
    await prisma.board.upsert({
      where: { slug: boardData.slug },
      update: {},
      create: boardData,
    });
  }

  console.log('✅ 기본 게시판들이 생성되었습니다.');

  // 샘플 공지사항 생성
  const noticeBoard = await prisma.board.findUnique({
    where: { slug: 'notice' }
  });

  if (noticeBoard) {
    await prisma.boardPost.upsert({
      where: { id: 'welcome-notice' },
      update: {},
      create: {
        id: 'welcome-notice',
        title: '🎉 게시판 시스템이 오픈되었습니다!',
        content: `안녕하세요! 

새로운 게시판 시스템이 오픈되었습니다.

**주요 기능:**
- 📝 글 작성 및 수정
- 💬 댓글 시스템 (대댓글 지원)
- 📊 조회수 표시
- 🏷️ 카테고리별 분류
- 🔍 검색 기능

**게시판 목록:**
- 📢 공지사항: 중요한 공지사항
- 💭 자유게시판: 자유로운 소통 공간
- ❓ 질문게시판: 궁금한 점 질문
- 💻 개발토론: 개발 관련 토론

많은 참여 부탁드립니다! 😊`,
        author: '관리자',
        boardId: noticeBoard.id,
        isNotice: true,
      },
    });
  }

  console.log('✅ 샘플 공지사항이 생성되었습니다.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 