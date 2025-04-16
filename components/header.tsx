import Link from 'next/link';
import { cn } from '@/lib/utils'; // Assuming utils.ts is in lib directory
import { MobileMenu } from './mobile-menu'; // Import the MobileMenu component

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '#', label: 'Home' },
  { href: '#features', label: 'Features' }, // Updated href for potential scrolling
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="bg-card shadow sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-primary text-2xl font-bold">
        BrandName
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex">
        <ul className="flex list-none gap-6">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="text-foreground font-medium hover:text-primary transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Action Button & Mobile Menu Trigger */}
      <div className="flex items-center gap-4">
        <button
          className={cn(
            "hidden sm:block", // Hide on very small screens, show on sm and up
            "bg-primary text-primary-foreground px-5 py-2.5 rounded-sm font-semibold",
            "hover:bg-primary/90",
            "transition-colors"
          )}
        >
          Get Started
        </button>
        {/* Render the MobileMenu component */}
        <MobileMenu navItems={navItems} />
      </div>
    </header>
  );
} 