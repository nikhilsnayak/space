'use client';

import { HomeIcon } from 'lucide-react';

import { LinkButton } from '~/components/ui/link-button';

export default function Error() {
  return (
    <div className='flex min-h-screen items-center justify-center p-8'>
      <div className='text-center'>
        <h1 className='mb-2 text-lg font-medium'>Something went wrong</h1>
        <p className='text-muted-foreground mb-6 text-xs'>
          An unexpected error occurred
        </p>
        <LinkButton href='/' variant='default'>
          <HomeIcon className='size-4' />
          Go home
        </LinkButton>
      </div>
    </div>
  );
}
