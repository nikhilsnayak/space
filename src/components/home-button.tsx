'use client';

import Link from 'next/link';
import { HomeIcon } from 'lucide-react';

import { Button } from './ui/button';

export function HomeButton({
  size = 'icon-sm',
  variant = 'outline',
  'aria-label': ariaLabel = 'Home',
  ...props
}: Omit<
  React.ComponentProps<typeof Button>,
  'nativeButton' | 'render' | 'children'
>) {
  return (
    <Button
      {...props}
      nativeButton={false}
      render={<Link href='/' />}
      size={size}
      variant={variant}
      aria-label={ariaLabel}
    >
      <HomeIcon />
    </Button>
  );
}
