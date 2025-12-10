import { redirect } from 'next/navigation';
import { format } from 'date-fns';

import { ensureSession } from '~/lib/auth';

export default async function StickyNotesPage() {
  await ensureSession();
  const today = format(new Date(), 'yyyy-MM-dd');

  redirect(`/sticky-notes/${today}`);
}
