import { ViewTransition } from 'react';
import Link from 'next/link';
import { StickyNoteIcon } from 'lucide-react';

import { ensureSession } from '~/lib/auth';

export default async function Home() {
  await ensureSession();
  return (
    <section className='mx-auto max-w-(--breakpoint-xl) p-8'>
      <Link
        href='/sticky-notes'
        className='bg-card text-card-foreground grid aspect-square w-40 place-items-center border p-4 shadow-sm'
      >
        <StickyNoteIcon />
        <ViewTransition name='sticky-notes'>
          <h2>Sticky Notes</h2>
        </ViewTransition>
      </Link>
    </section>
  );
}
