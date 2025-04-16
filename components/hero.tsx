import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AnimateOnScroll } from './animate-on-scroll';

export function Hero() {
  return (
    <AnimateOnScroll className="w-full">
      <section className="bg-card rounded-lg mt-8 p-12 flex flex-col md:flex-row items-center justify-between">
        {/* Content */}
        <div className="flex-1 md:pr-12 mb-8 md:mb-0">
          <h1 className="text-heading text-4xl md:text-5xl font-bold leading-tight mb-4">
            Modern solutions for your business
          </h1>
          <p className="text-muted text-lg mb-8">
            Transform your workflow with our innovative platform designed to boost
            productivity and drive results.
          </p>
          <button
            className={cn(
              "bg-primary text-primary-foreground px-5 py-2.5 rounded-sm font-semibold",
              "hover:bg-primary/90", // Adjusted hover from tailwind config
              "transition-colors"
            )}
          >
            Learn More
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 text-center">
          {/* Updated image source using Picsum Photos */}
          <Image
            src="https://picsum.photos/seed/heroimage/500/400" // Updated source
            alt="Hero Image"
            width={500} // Provide width
            height={400} // Provide height
            className="max-w-full h-auto inline-block rounded-md" // Added rounded-md
            priority // Load image priority as it's above the fold
          />
        </div>
      </section>
    </AnimateOnScroll>
  );
} 