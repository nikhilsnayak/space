import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';

import { getSession } from '.';

export const authRequestMiddleware = createMiddleware().server(
  async ({ next }) => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: '/login' });
    }
    return next();
  }
);

export const authServerFunctionMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw redirect({ to: '/login' });
  }
  return next();
});

export const loginMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession();
  if (session) {
    throw redirect({ to: '/' });
  }
  return next();
});
