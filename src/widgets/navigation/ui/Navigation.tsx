'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { LogoutButton } from '@/features/auth/logout';
import { cn } from '@/shared/lib/utils';

export function Navigation() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/tasks', label: 'Tasks' },
    { href: '/faq', label: 'FAQ' },
    { href: '/terms', label: 'Terms' },
  ];

  return (
    <nav className="border-b bg-background relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl">
            Task Manager
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {session.user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <Cross1Icon className="size-6" />
            ) : (
              <HamburgerMenuIcon className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b py-4 space-y-2 px-4 z-50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <div className="px-3 py-2 space-y-2">
                <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                <LogoutButton variant="button" />
              </div>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
