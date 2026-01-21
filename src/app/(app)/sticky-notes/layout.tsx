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
        <Suspense fallback={<BoardsListSkeleton />}>
          <ViewTransition>
            <BoardsList />
          </ViewTransition>
        </Suspense>
      </aside>
      {children}
    </section>
  );
}

function BoardsListSkeleton() {
  return (
    <ul className='space-y-4 p-4'>
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i}>
          <div className='bg-muted border-muted h-8 w-full animate-pulse border' />
        </li>
      ))}
    </ul>
  );
}

async function BoardsList() {
  const boardsResult = await getStickyNotesBoards();

  if (boardsResult.status === 'error') {
    return (
      <p className='text-muted-foreground text-sm'>Failed to load boards.</p>
    );
  }

  const boards = boardsResult.value;

  return <StickyNotesBoardsList boards={boards} />;
}
