import { createFileRoute } from '@tanstack/react-router';

import { handleLogin } from '~/lib/auth/handlers';
import { loginMiddleware } from '~/lib/auth/middlewares';

export const Route = createFileRoute('/(auth)/api/auth/login')({
  server: {
    middleware: [loginMiddleware],
    handlers: {
      GET: handleLogin,
    },
  },
});
