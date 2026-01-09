import { redirect } from 'next/navigation';

import { TODAY } from '~/lib/constants';

export default function StickyNotesIndexPage() {
  redirect(`/sticky-notes/${TODAY}`);
}
