import { ViewTransition } from 'react';
import { redirect } from 'next/navigation';

import { getSession } from '~/lib/auth';
import { SignInButton } from '~/lib/auth/sign-in-button';

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
    <section className='relative z-10 mx-auto grid min-h-dvh w-full max-w-md place-items-center p-8'>
      <div className='bg-card/80 relative w-full overflow-hidden border border-white/10 p-8 backdrop-blur-sm'>
        <div className='absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white/20' />
        <div className='absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-white/20' />
        <div className='absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white/20' />
        <div className='absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-white/20' />

        <div className='space-y-8'>
          <div className='space-y-4 text-center'>
            <div className='flex items-center justify-center gap-3'>
              <ViewTransition>
                <h1 className='text-3xl font-bold tracking-[0.2em] uppercase'>
                  SPACE
                </h1>
              </ViewTransition>
            </div>
            <p className='text-muted-foreground text-xs tracking-[0.3em] uppercase'>
              Authentication
            </p>
          </div>

          {errorMessage && (
            <div className='relative overflow-hidden border border-[#ef4444]/30 bg-[#ef4444]/10 p-3'>
              <div className='flex items-start gap-2'>
                <div className='mt-0.5 size-2 shrink-0 rounded-full bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]' />
                <span className='text-xs tracking-wider text-[#ef4444] uppercase'>
                  {errorMessage}
                </span>
              </div>
            </div>
          )}

          <SignInButton />
        </div>
      </div>
    </section>
  );
}
