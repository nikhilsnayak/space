import { createFileRoute } from '@tanstack/react-router';

import { handleGithubCallback } from '~/lib/auth';

export const Route = createFileRoute('/(auth)/api/auth/callback/github')({
  server: {
    handlers: {
      GET: handleGithubCallback,
    },
  },
});
