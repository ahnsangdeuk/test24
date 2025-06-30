# Firebase 설정 가이드

## 현재 상태
Firebase Firestore 연동을 위해 환경변수 설정이 필요합니다.

## 필요한 환경변수

`.env.local` 파일에 다음 환경변수를 추가해주세요:

```
# Firebase 설정
NEXT_PUBLIC_FIREBASE_API_KEY=당신의-API-키
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=당신의-프로젝트-ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=당신의-프로젝트-ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=당신의-프로젝트-ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=678630397215
NEXT_PUBLIC_FIREBASE_APP_ID=1:678630397215:web:10df2a7b6f1b87c432cc2a

# NextAuth 설정
NEXTAUTH_SECRET=랜덤-시크릿-키
NEXTAUTH_URL=http://localhost:3000
```

## Firebase Console에서 설정 방법

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 설정 > 일반 탭에서 웹 앱 추가
4. 설정 코드에서 환경변수 값들을 복사
5. Firestore Database 활성화 (시작 모드: 테스트 모드)

## 임시 해결책

Firebase 설정이 완료될 때까지 Prisma DB로 되돌리려면:
- `lib/posts.ts` 파일의 코드를 다시 활성화
- API 라우트에서 `posts-firebase` 대신 `posts` import 사용

## 현재 오류
Firebase 환경변수가 없어서 "Invalid resource field value" 오류가 발생하고 있습니다. 