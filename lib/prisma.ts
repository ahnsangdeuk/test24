import { PrismaClient } from '../lib/generated/prisma';

// PrismaClient는 전역 객체로 만들어서 재사용
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

// 개발 환경에서만 전역 객체에 할당
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma; 