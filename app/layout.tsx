import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Figma Design Implementation",
  description: "Modern solutions for your business, implemented with Next.js",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 