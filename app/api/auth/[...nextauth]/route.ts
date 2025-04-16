import NextAuth from "next-auth"
import { authConfig } from "@/auth.config" // Auth.js 설정 파일 (곧 생성 예정)

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST } 