import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export default function StickyNotesPage() {
  const today = format(new Date(), 'yyyy-MM-dd');

  redirect(`/sticky-notes/${today}`);
}
