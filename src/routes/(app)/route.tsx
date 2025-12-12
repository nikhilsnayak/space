import { createFileRoute, Outlet } from '@tanstack/react-router';

import { authMiddleware } from '~/lib/auth';

export const Route = createFileRoute('/(app)')({
  server: {
    middleware: [authMiddleware],
  },
  component: Outlet,
});
