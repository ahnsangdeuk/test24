import prisma from './prisma';

export interface Board {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
}

export interface BoardPost {
  id: string;
  title: string;
  content: string;
  author: string;
  boardId: string;
  viewCount: number;
  isNotice: boolean;
  createdAt: string;
  updatedAt: string;
  board?: Board;
  commentCount?: number;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  postId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

// 모든 활성 게시판 가져오기
export async function getAllBoards(): Promise<Board[]> {
  try {
    const boards = await prisma.board.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    return boards.map(board => ({
      id: board.id,
      name: board.name,
      description: board.description,
      slug: board.slug,
      order: board.order,
      isActive: board.isActive,
      createdAt: board.createdAt.toISOString(),
      updatedAt: board.updatedAt.toISOString(),
      postCount: board._count.posts
    }));
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw new Error('게시판 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 슬러그로 게시판 찾기
export async function getBoardBySlug(slug: string): Promise<Board | null> {
  try {
    const board = await prisma.board.findUnique({
      where: { slug, isActive: true },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!board) return null;

    return {
      id: board.id,
      name: board.name,
      description: board.description,
      slug: board.slug,
      order: board.order,
      isActive: board.isActive,
      createdAt: board.createdAt.toISOString(),
      updatedAt: board.updatedAt.toISOString(),
      postCount: board._count.posts
    };
  } catch (error) {
    console.error('Error fetching board by slug:', error);
    throw new Error('게시판을 찾는 중 오류가 발생했습니다.');
  }
}

// 특정 게시판의 글 목록 가져오기
export async function getBoardPosts(boardId: string, page: number = 1, limit: number = 20): Promise<BoardPost[]> {
  try {
    const skip = (page - 1) * limit;
    
    const posts = await prisma.boardPost.findMany({
      where: { boardId },
      orderBy: [
        { isNotice: 'desc' }, // 공지사항이 위로
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
      include: {
        board: true,
        _count: {
          select: { comments: true }
        }
      }
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      boardId: post.boardId,
      viewCount: post.viewCount,
      isNotice: post.isNotice,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      board: {
        id: post.board.id,
        name: post.board.name,
        description: post.board.description,
        slug: post.board.slug,
        order: post.board.order,
        isActive: post.board.isActive,
        createdAt: post.board.createdAt.toISOString(),
        updatedAt: post.board.updatedAt.toISOString(),
      },
      commentCount: post._count.comments
    }));
  } catch (error) {
    console.error('Error fetching board posts:', error);
    throw new Error('게시판 글 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 게시글 작성
export async function createBoardPost(postData: {
  title: string;
  content: string;
  author: string;
  boardId: string;
  isNotice?: boolean;
}): Promise<BoardPost> {
  try {
    const post = await prisma.boardPost.create({
      data: {
        title: postData.title,
        content: postData.content,
        author: postData.author,
        boardId: postData.boardId,
        isNotice: postData.isNotice || false,
      },
      include: {
        board: true,
        _count: {
          select: { comments: true }
        }
      }
    });

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      boardId: post.boardId,
      viewCount: post.viewCount,
      isNotice: post.isNotice,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      board: {
        id: post.board.id,
        name: post.board.name,
        description: post.board.description,
        slug: post.board.slug,
        order: post.board.order,
        isActive: post.board.isActive,
        createdAt: post.board.createdAt.toISOString(),
        updatedAt: post.board.updatedAt.toISOString(),
      },
      commentCount: post._count.comments
    };
  } catch (error) {
    console.error('Error creating board post:', error);
    throw new Error('게시글 작성 중 오류가 발생했습니다.');
  }
}

// 게시글 상세 조회 (조회수 증가)
export async function getBoardPostById(id: string): Promise<BoardPost | null> {
  try {
    // 조회수 증가
    await prisma.boardPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    const post = await prisma.boardPost.findUnique({
      where: { id },
      include: {
        board: true,
        _count: {
          select: { comments: true }
        }
      }
    });

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      boardId: post.boardId,
      viewCount: post.viewCount,
      isNotice: post.isNotice,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      board: {
        id: post.board.id,
        name: post.board.name,
        description: post.board.description,
        slug: post.board.slug,
        order: post.board.order,
        isActive: post.board.isActive,
        createdAt: post.board.createdAt.toISOString(),
        updatedAt: post.board.updatedAt.toISOString(),
      },
      commentCount: post._count.comments
    };
  } catch (error) {
    console.error('Error fetching board post:', error);
    throw new Error('게시글을 불러오는 중 오류가 발생했습니다.');
  }
}

// 게시글 삭제
export async function deleteBoardPost(id: string): Promise<boolean> {
  try {
    await prisma.boardPost.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting board post:', error);
    return false;
  }
}

// 댓글 목록 가져오기
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null }, // 최상위 댓글만
      orderBy: { createdAt: 'asc' },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: comment.author,
      postId: comment.postId,
      parentId: comment.parentId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      replies: comment.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        author: reply.author,
        postId: reply.postId,
        parentId: reply.parentId,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
      }))
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('댓글을 불러오는 중 오류가 발생했습니다.');
  }
}

// 댓글 작성
export async function createComment(commentData: {
  content: string;
  author: string;
  postId: string;
  parentId?: string;
}): Promise<Comment> {
  try {
    const comment = await prisma.comment.create({
      data: {
        content: commentData.content,
        author: commentData.author,
        postId: commentData.postId,
        parentId: commentData.parentId || null,
      }
    });

    return {
      id: comment.id,
      content: comment.content,
      author: comment.author,
      postId: comment.postId,
      parentId: comment.parentId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw new Error('댓글 작성 중 오류가 발생했습니다.');
  }
}

// 댓글 삭제
export async function deleteComment(id: string): Promise<boolean> {
  try {
    await prisma.comment.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
} 