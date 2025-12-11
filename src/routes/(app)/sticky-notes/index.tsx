import { createFileRoute, redirect } from '@tanstack/react-router';

import { TODAY } from '~/lib/constants';

export const Route = createFileRoute('/(app)/sticky-notes/')({
  beforeLoad: () => {
    throw redirect({ to: '/sticky-notes/$date', params: { date: TODAY } });
  },
});
