import { Header } from '@/components/header';
import { Hero } from '@/components/hero'; // Import the Hero component
import { Features } from '@/components/features'; // Import the Features component
import { CTA } from '@/components/cta'; // Import the CTA component
import { Footer } from '@/components/footer'; // Import the Footer component
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커뮤니티 플랫폼',
  description: '블로그와 게시판이 있는 현대적인 커뮤니티 플랫폼입니다. 다양한 주제로 소통하고 정보를 공유해보세요.',
};

export default function HomePage() {
  return (
    <>
      <Header />
      {/* Wrap main content in a container for max-width */}
      <div className="max-w-[1200px] mx-auto px-5"> {/* Equivalent to .container class */}
        <main className="flex min-h-screen flex-col items-center py-8 md:py-12"> {/* Removed p-24, added some vertical padding */}
          <Hero /> {/* Render the Hero component */}
          <Features /> {/* Render the Features component */}
          <CTA /> {/* Render the CTA component */}
          {/* Placeholder for the rest of the page content */}
          {/* Features section will go here */}
          {/* CTA section will go here */}
        </main>
      </div>
      <Footer /> {/* Render the Footer component */}
    </>
  );
} 