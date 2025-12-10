'use client';

import { useSearchParams } from 'next/navigation';

import { Button } from '~/components/ui/button';

export default function LoginPage() {
  const searchParams = useSearchParams();

  const error = searchParams.get('error');

  let errorMessage = '';
  if (error === 'not_authorized') {
    errorMessage = 'You are not authorized to access this application.';
  } else if (!!error) {
    errorMessage = `An error occurred: ${error}. Please try again.`;
  }

  return (
    <section className='grid h-full w-full place-items-center'>
      <div className='space-y-4 text-center'>
        {errorMessage && <p className='text-destructive'>{errorMessage}</p>}
        <Button
          onClick={async () => {
            const response = await fetch('/api/auth/sign-in', {
              method: 'POST',
            });
            const data = (await response.json()) as { redirectUrl: string };
            window.location.href = data.redirectUrl;
          }}
        >
          Login
        </Button>
      </div>
    </section>
  );
}
