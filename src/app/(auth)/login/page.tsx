import { ViewTransition } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { getSession } from '~/lib/auth';
import { Button } from '~/components/ui/button';

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const session = await getSession();

  if (session) {
    redirect('/');
  }

  const { error } = await searchParams;
  let errorMessage = '';
  if (error === 'not_authorized') {
    errorMessage = 'You are not authorized to access this application.';
  } else if (error) {
    errorMessage = `An error occurred: ${error}. Please try again.`;
  }

  return (
    <section className='mx-auto grid min-h-dvh w-full max-w-md place-items-center p-8'>
      <div className='bg-card text-card-foreground w-full space-y-8 border p-8 shadow-sm'>
        <div className='space-y-4 text-center'>
          <ViewTransition>
            <h1 className='text-3xl font-bold'>Space</h1>
          </ViewTransition>
        </div>

        {errorMessage && (
          <div className='border-destructive/50 bg-destructive/10 text-destructive rounded-none border p-3 text-sm'>
            {errorMessage}
          </div>
        )}

        <Button
          size='lg'
          className='w-full'
          nativeButton={false}
          render={
            <a
              href='/api/auth/login'
              className='flex items-center justify-center gap-2'
            >
              <Image src='/github.svg' alt='GitHub' width={20} height={20} />
              Login with GitHub
            </a>
          }
        />
      </div>
    </section>
  );
}
