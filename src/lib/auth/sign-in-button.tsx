'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2Icon } from 'lucide-react';

import { Button } from '~/components/ui/button';

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      size='lg'
      className='w-full border-white/20 bg-white/5 tracking-wider uppercase hover:bg-white/10'
      variant='outline'
      nativeButton={false}
      disabled={isLoading}
      onClick={() => setIsLoading(true)}
      render={
        <a
          href='/api/auth/login'
          className='flex items-center justify-center gap-3'
        >
          {isLoading ? (
            <Loader2Icon className='size-4 animate-spin' />
          ) : (
            <>
              <Image src='/github.svg' alt='GitHub' width={20} height={20} />
              Sign in with GitHub
            </>
          )}
        </a>
      }
    />
  );
}
