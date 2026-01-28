'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

import { Button } from './ui/button';

export function BackButton({
  size = 'icon-sm',
  variant = 'outline',
  'aria-label': ariaLabel = 'Go back',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'onClick' | 'children'>) {
  const router = useRouter();

  return (
    <Button
      {...props}
      onClick={router.back}
      size={size}
      variant={variant}
      aria-label={ariaLabel}
    >
      <ArrowLeftIcon />
    </Button>
  );
}
