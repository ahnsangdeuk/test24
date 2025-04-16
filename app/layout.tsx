import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 