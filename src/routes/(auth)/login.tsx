import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import { loginMiddleware } from '~/lib/auth/middlewares';
import { Button } from '~/components/ui/button';

export const Route = createFileRoute('/(auth)/login')({
  server: {
    middleware: [loginMiddleware],
  },
  validateSearch: z.object({
    error: z.string().optional(),
  }),
  component: Login,
});

function Login() {
  const { error } = Route.useSearch();

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
