import { createFileRoute } from '@tanstack/react-router';

import { api } from '~/lib/api';

const handle = ({ request }: { request: Request }) => api.fetch(request);

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
