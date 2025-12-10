import { redirect } from 'next/navigation';

import { ensureSession } from '~/lib/auth';
import { TODAY } from '~/lib/constants';

export default async function StickyNotesPage() {
  await ensureSession();

  redirect(`/sticky-notes/${TODAY}`);
}
