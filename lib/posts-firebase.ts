import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface FirestorePost {
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const POSTS_COLLECTION = 'posts';

// Firestore 데이터를 Post 인터페이스로 변환
const convertFirestorePost = (id: string, data: FirestorePost): Post => ({
  id,
  title: data.title,
  content: data.content,
  category: data.category,
  tags: data.tags || [],
  createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
  updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
});

// 모든 글 가져오기 (최신순)
export async function getAllPosts(): Promise<Post[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestorePost;
      posts.push(convertFirestorePost(doc.id, data));
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('글 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 새 글 저장
export async function savePost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const now = serverTimestamp();
    
    const docRef = await addDoc(postsRef, {
      title: postData.title,
      content: postData.content,
      category: postData.category || null,
      tags: postData.tags || [],
      createdAt: now,
      updatedAt: now,
    });

    // 방금 생성된 문서 가져오기
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('저장된 글을 찾을 수 없습니다.');
    }

    const data = docSnap.data() as FirestorePost;
    return convertFirestorePost(docRef.id, data);
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('글 저장 중 오류가 발생했습니다.');
  }
}

// 특정 글 가져오기
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data() as FirestorePost;
    return convertFirestorePost(docSnap.id, data);
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('글을 불러오는 중 오류가 발생했습니다.');
  }
}

// 글 삭제
export async function deletePost(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// 카테고리별 글 필터링
export async function getPostsByCategory(category: string): Promise<Post[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(
      postsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestorePost;
      posts.push(convertFirestorePost(doc.id, data));
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw new Error('카테고리별 글 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 글 검색 (제목과 내용에서 검색)
export async function searchPosts(searchQuery: string): Promise<Post[]> {
  try {
    // Firestore는 full-text search가 제한적이므로 클라이언트에서 필터링
    const allPosts = await getAllPosts();
    const lowercaseQuery = searchQuery.toLowerCase();
    
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error('Error searching posts:', error);
    throw new Error('글 검색 중 오류가 발생했습니다.');
  }
} 