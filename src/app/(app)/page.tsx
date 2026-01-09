import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileTextIcon, StickyNoteIcon } from 'lucide-react';

import { getSession } from '~/lib/auth';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <section className='mx-auto flex max-w-(--breakpoint-xl) items-center gap-4 p-8'>
      <Link
        href='/sticky-notes'
        className='bg-card text-card-foreground grid aspect-square w-40 place-items-center border p-4 shadow-sm'
      >
        <StickyNoteIcon />
        <h2>Sticky Notes</h2>
      </Link>
      <Link
        href='/docs'
        className='bg-card text-card-foreground grid aspect-square w-40 place-items-center border p-4 shadow-sm'
      >
        <FileTextIcon />
        <h2>Docs</h2>
      </Link>
    </section>
  );
}
