'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
}

export function MobileMenu({ navItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu state
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu function
  const closeMenu = () => setIsOpen(false);

  // Effect to prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden"> {/* Only show on mobile */}
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="text-2xl"
      >
        ☰
      </button>

      {/* Mobile Menu Panel (conditionally rendered) */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-card p-6 flex flex-col",
            "transition-transform duration-300 ease-in-out",
            // Add animation classes if desired (e.g., translate-x-full -> translate-x-0)
          )}
        >
          {/* Close Button */}
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="self-end text-2xl mb-8"
          >
            ✕
          </button>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="list-none flex flex-col items-center gap-6">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-foreground text-2xl font-medium hover:text-primary transition-colors"
                    onClick={closeMenu} // Close menu on link click
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get Started Button */}
          <button
            className={cn(
              "bg-primary text-primary-foreground px-5 py-2.5 rounded-sm font-semibold text-lg w-full mt-8",
              "hover:bg-primary/90",
              "transition-colors"
            )}
            onClick={closeMenu} // Also close menu when clicking this button if needed
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
} 