import type { NextAuthConfig } from 'next-auth';
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // Add other providers here if needed
  ],
  // secret: process.env.AUTH_SECRET, // Auth.js v5 often infers this, but good to have explicitly if needed
  // pages: { // Optional: Customize pages
  //   signIn: '/login',
  //   // error: '/auth/error', // Optional error page
  // },
  // callbacks: { // Optional: Customize session/token data
  //   async session({ session, token, user }) {
  //     // Add custom properties to the session
  //     return session
  //   }
  // }
} satisfies NextAuthConfig; 