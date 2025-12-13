import { createFileRoute, Outlet } from '@tanstack/react-router';

import { authRequestMiddleware } from '~/lib/auth/middlewares';

export const Route = createFileRoute('/(app)')({
  server: {
    middleware: [authRequestMiddleware],
  },
  component: Outlet,
});
