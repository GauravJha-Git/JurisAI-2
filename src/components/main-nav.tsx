'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { Button } from './ui/button';
import { BrainCircuit, Gavel, Library } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Chat Assistant', icon: BrainCircuit },
    { href: '/law-explorer', label: 'Law Explorer', icon: Library },
    { href: '/case-finder', label: 'Case Finder', icon: Gavel },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              asChild
              variant={pathname === href ? 'secondary' : 'ghost'}
              className={cn(pathname === href && 'text-primary font-semibold')}
            >
              <Link href={href}>
                <Icon className="mr-2 h-4 w-4" /> {label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
