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
    <section className='grid h-full w-full place-items-center'>
      <div className='space-y-4 text-center'>
        {errorMessage && <p className='text-destructive'>{errorMessage}</p>}
        <Button
          nativeButton={false}
          render={<a href='/api/auth/login'>Login</a>}
        />
      </div>
    </section>
  );
}
