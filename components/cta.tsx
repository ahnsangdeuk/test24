import { cn } from '@/lib/utils';
import { AnimateOnScroll } from './animate-on-scroll';

export function CTA() {
  return (
    <AnimateOnScroll className="w-full">
      <section id="contact" className="bg-primary text-primary-foreground mt-16 rounded-lg p-12 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto opacity-90">
          Join thousands of businesses already using our platform to enhance their
          productivity and drive growth.
        </p>
        <button
          className={cn(
            "bg-card text-primary px-6 py-3 rounded-sm font-semibold text-lg",
            "hover:bg-card/90 hover:scale-105",
            "transition-all duration-300 ease-in-out"
          )}
        >
          Sign Up Now
        </button>
      </section>
    </AnimateOnScroll>
  );
} 