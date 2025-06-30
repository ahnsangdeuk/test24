/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages 배포를 위한 조건부 설정
  ...(process.env.GITHUB_ACTIONS === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    // GitHub Pages에서 사용할 기본 경로 설정
    basePath: '/test24',
    assetPrefix: '/test24/',
  }),
  // 개발 환경 및 일반 배포를 위한 설정
  images: {
    unoptimized: process.env.GITHUB_ACTIONS === 'true', // GitHub Actions에서만 true
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig; 