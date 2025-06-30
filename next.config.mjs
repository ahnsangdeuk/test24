/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages 배포를 위한 설정
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // GitHub Pages에서는 이미지 최적화가 지원되지 않음
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // GitHub Pages에서 사용할 기본 경로 설정 (리포지토리 이름이 test24인 경우)
  basePath: process.env.NODE_ENV === 'production' ? '/test24' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/test24/' : '',
};

export default nextConfig; 