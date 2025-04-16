'use client'; // Make this a client component to use the AnimateOnScroll wrapper

import { cn } from '@/lib/utils';
import { AnimateOnScroll } from './animate-on-scroll'; // Import the wrapper

interface FeatureItem {
  icon: string; // Emoji or SVG component
  title: string;
  description: string;
}

const featureData: FeatureItem[] = [
  {
    icon: '✨',
    title: 'Easy Integration',
    description: 'Seamlessly connect with your existing tools and workflows with minimal setup time.',
  },
  {
    icon: '🚀',
    title: 'Performance Boost',
    description: 'Experience enhanced speed and efficiency in your daily operations.',
  },
  {
    icon: '🔒',
    title: 'Secure Platform',
    description: 'Rest easy knowing your data is protected by enterprise-grade security protocols.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Make data-driven decisions with comprehensive insights and reporting tools.',
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    description: 'Foster teamwork and communication with collaborative features designed for teams.',
  },
  {
    icon: '🔄',
    title: 'Automated Workflows',
    description: 'Save time with intelligent automation of repetitive tasks and processes.',
  },
];

export function Features() {
  return (
    <section id="features" className="mt-16 py-12 w-full"> {/* Added w-full */}
      <AnimateOnScroll> {/* Animate the title */}
        <h2 className="text-4xl font-bold text-center mb-12">
          Our Features
        </h2>
      </AnimateOnScroll>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureData.map((feature, index) => (
          // Wrap each feature card with AnimateOnScroll
          <AnimateOnScroll key={feature.title} className="h-full"> 
            <div
              className={cn(
                "bg-card rounded-md p-6 shadow-md h-full", // Added h-full
                "transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
              )}
            >
              <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center mb-4">
                <span className="text-3xl text-secondary-foreground">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted text-base">{feature.description}</p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
} 