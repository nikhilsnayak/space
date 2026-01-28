import { redirect } from 'next/navigation';
import { connection } from 'next/server';

import { TODAY } from '~/lib/constants';

export default async function StickyNotesIndexPage() {
  await connection();

  redirect(`/sticky-notes/${TODAY}`);
}
