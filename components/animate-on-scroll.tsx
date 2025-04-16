'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  initialClass?: string;
  animationClass?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function AnimateOnScroll({
  children,
  className,
  initialClass = 'opacity-0 translate-y-5', // Initial state: hidden and slightly down
  animationClass = 'opacity-100 translate-y-0', // Final state: visible and in place
  threshold = 0.1, // Trigger when 10% of the element is visible
  triggerOnce = true, // Only trigger the animation once
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, triggerOnce]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500 ease-out', // Basic transition
        isVisible ? animationClass : initialClass, // Apply animation based on visibility
        className // Allow passing additional classes
      )}
    >
      {children}
    </div>
  );
} 