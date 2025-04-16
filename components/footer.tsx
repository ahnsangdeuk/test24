import Link from 'next/link';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerData: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { href: '#', label: 'About Us' },
      { href: '#', label: 'Careers' },
      { href: '#', label: 'Press' },
      { href: '#', label: 'Blog' },
    ],
  },
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#pricing', label: 'Pricing' },
      { href: '#', label: 'Integrations' },
      { href: '#', label: 'FAQ' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#', label: 'Documentation' },
      { href: '#', label: 'Guides' },
      { href: '#', label: 'API Reference' },
      { href: '#', label: 'Community' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '#', label: 'Privacy Policy' },
      { href: '#', label: 'Terms of Service' },
      { href: '#', label: 'Cookie Policy' },
      { href: '#', label: 'GDPR' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-card rounded-t-lg px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerData.map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-semibold mb-6">{column.title}</h3>
              <ul className="list-none space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 pt-6 border-t border-border text-muted">
          <p>© {new Date().getFullYear()} BrandName. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 