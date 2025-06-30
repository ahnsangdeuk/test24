# Figma Design Implementation (Next.js)

This project implements a design (originally provided as an HTML template) using Next.js, TypeScript, and Tailwind CSS.

## Features Implemented (v1.1)

*   Header Component (with Mobile Menu functionality)
*   Hero Section
*   Features Section
*   Call to Action (CTA) Section
*   Footer Component
*   Scroll Animation using Intersection Observer
*   Pretendard Web Font

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Based On

*   Original HTML template structure provided.

# 커뮤니티 플랫폼

블로그와 게시판이 있는 현대적인 커뮤니티 플랫폼입니다.

## 기능

- 📝 **블로그 시스템**: 개인 글 작성 및 관리
- 📋 **게시판 시스템**: 다양한 주제의 게시판 (공지사항, 자유게시판, 질문게시판, 개발토론)
- 💬 **댓글 시스템**: 댓글 및 대댓글 지원
- 🔍 **검색 및 필터링**: 카테고리별 글 검색
- 📱 **모바일 최적화**: 완전한 반응형 디자인
- 👁️ **조회수 시스템**: 글 조회 통계

## 기술 스택

- **프레임워크**: Next.js 14.2.4 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **데이터베이스**: Prisma ORM + SQLite
- **인증**: NextAuth.js v4

## 로컬 개발 환경 설정

### 1. 저장소 클론

```bash
git clone https://github.com/ahnsangdeuk/test24.git
cd test24
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# NextAuth.js 설정
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# 데이터베이스 URL (SQLite)
DATABASE_URL="file:./dev.db"
```

### 4. 데이터베이스 설정

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev

# 시드 데이터 삽입 (선택사항)
npx prisma db seed
```

### 5. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` (또는 사용 가능한 포트)를 열어 애플리케이션을 확인하세요.

## 배포 옵션

### ⚠️ GitHub Pages 제한사항

현재 애플리케이션은 다음과 같은 이유로 GitHub Pages에 직접 배포하기 어렵습니다:

- **서버 사이드 기능**: API 라우트와 데이터베이스 연결이 필요
- **동적 데이터**: 실시간 게시글 작성 및 댓글 시스템
- **Prisma + SQLite**: 서버 환경이 필요한 데이터베이스

### 권장 배포 플랫폼

1. **Vercel** (권장)
   ```bash
   # Vercel CLI 설치
   npm i -g vercel
   
   # 배포
   vercel
   ```
   - Next.js 제작사의 플랫폼
   - 제로 설정 배포
   - 자동 도메인 제공
   - 무료 플랜 제공

2. **Netlify**
   ```bash
   # Netlify CLI 설치
   npm i -g netlify-cli
   
   # 배포
   netlify deploy --prod
   ```

3. **Railway**
   - PostgreSQL 등 실제 데이터베이스 지원
   - 환경 변수 관리
   - 자동 배포

### GitHub Pages 정적 버전 (제한적)

정적 데모 버전을 위해서는 다음이 필요합니다:

1. **mock 데이터로 변환**
2. **API 라우트 제거**
3. **정적 생성으로 전환**

```bash
# 정적 빌드 (현재는 에러 발생)
npm run build
```

## 개발 가이드

### 데이터베이스 스키마

- **Post**: 개인 블로그 글
- **Board**: 게시판 정보
- **BoardPost**: 게시판 글
- **Comment**: 댓글 (대댓글 지원)

### API 엔드포인트

- `GET /api/posts` - 블로그 글 목록
- `POST /api/posts` - 새 블로그 글 작성
- `GET /api/boards` - 게시판 목록
- `GET /api/boards/[slug]/posts` - 특정 게시판 글 목록
- `POST /api/boards/[slug]/posts` - 게시판 글 작성

### 컴포넌트 구조

```
components/
├── board-list.tsx         # 게시판 목록
├── board-post-list.tsx    # 게시판 글 목록
├── board-post-detail.tsx  # 게시판 글 상세
├── board-post-form.tsx    # 게시판 글 작성
├── posts-list.tsx         # 블로그 글 목록
├── write-form.tsx         # 블로그 글 작성
├── header.tsx             # 헤더
└── footer.tsx             # 푸터
```

## 문제 해결

### 포트 충돌

개발 서버가 다른 포트(3001, 3002 등)에서 시작되는 경우:

```bash
# 특정 포트로 시작
npm run dev -- -p 3000
```

### 데이터베이스 초기화

```bash
# 데이터베이스 재설정
npx prisma migrate reset

# 다시 시드 실행
npx prisma db seed
```

### NextAuth.js 경고

현재 개발 환경에서 다음 경고가 표시될 수 있습니다:
- `NEXTAUTH_URL` 경고
- `NO_SECRET` 경고

이는 개발 환경에서는 무시해도 됩니다.

## 라이선스

MIT License

## 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
