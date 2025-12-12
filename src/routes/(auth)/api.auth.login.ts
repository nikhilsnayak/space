import { createFileRoute } from '@tanstack/react-router';

import { handleLogin, loginMiddleware } from '~/lib/auth';

export const Route = createFileRoute('/(auth)/api/auth/login')({
  server: {
    middleware: [loginMiddleware],
    handlers: {
      GET: handleLogin,
    },
  },
});
