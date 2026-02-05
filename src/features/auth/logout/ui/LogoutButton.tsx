'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/shared/ui/button';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

interface LogoutButtonProps {
  variant?: 'dropdown' | 'button';
}

export function LogoutButton({ variant = 'dropdown' }: LogoutButtonProps) {
  const handleSignOut = () => signOut({ callbackUrl: '/login' });

  if (variant === 'button') {
    return (
      <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
        Sign Out
      </Button>
    );
  }

  return <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>;
}
