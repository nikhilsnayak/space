import { Suspense, ViewTransition } from 'react';

import { StickyNotesBoardsList } from '~/features/sticky-notes/components/sticky-notes-boards-list';
import { getStickyNotesBoards } from '~/features/sticky-notes/queries';

export default function StickyNotesLayout({
  children,
}: LayoutProps<'/sticky-notes'>) {
  return (
    <section className='grid h-full grid-cols-[240px_1fr]'>
      <aside className='h-full border-r'>
        <ViewTransition name='sticky-notes'>
          <h1 className='border-b p-4 text-center text-2xl font-bold'>
            Sticky Notes
          </h1>
        </ViewTransition>
        <Suspense>
          <StickyNotesBoards />
        </Suspense>
      </aside>
      {children}
    </section>
  );
}

async function StickyNotesBoards() {
  const boardsResult = await getStickyNotesBoards();
  if (boardsResult.isErr()) {
    return <div>{boardsResult.error.message}</div>;
  }
  const { boards } = boardsResult.value;
  return <StickyNotesBoardsList boards={boards} />;
}
