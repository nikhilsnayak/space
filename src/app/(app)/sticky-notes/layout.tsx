import { Suspense, ViewTransition } from 'react';

import { StickyNotesBoardsList } from '~/features/sticky-notes/components/sticky-notes-boards-list';
import { getStickyNotesBoards } from '~/features/sticky-notes/queries';

export default function StickyNotesLayout({
  children,
}: LayoutProps<'/sticky-notes'>) {
  return (
    <section className='grid h-dvh grid-cols-[240px_1fr]'>
      <aside className='h-full border-r'>
        <ViewTransition name='sticky-notes'>
          <h1 className='border-b p-4 text-center text-2xl font-bold'>
            Sticky Notes
          </h1>
        </ViewTransition>
        <Suspense>
          <ViewTransition>
            <BoardsList />
          </ViewTransition>
        </Suspense>
      </aside>
      {children}
    </section>
  );
}

async function BoardsList() {
  const boards = await getStickyNotesBoards();

  return <StickyNotesBoardsList boards={boards} />;
}
