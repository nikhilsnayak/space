import { Suspense, ViewTransition } from 'react';
import { StickyNoteIcon } from 'lucide-react';

import { StickyNotesBoardsList } from '~/features/sticky-notes/components/sticky-notes-boards-list';
import { getStickyNotesBoards } from '~/features/sticky-notes/queries';

export default function StickyNotesLayout({
  children,
}: LayoutProps<'/sticky-notes'>) {
  return (
    <section className='grid h-dvh grid-cols-[260px_1fr]'>
      <aside className='bg-card/50 h-full overflow-hidden border-r border-white/10'>
        <div className='border-b border-white/10 p-5'>
          <ViewTransition name='sticky-notes'>
            <div className='flex items-center justify-center gap-2'>
              <StickyNoteIcon
                className='text-foreground size-5'
                strokeWidth={1.5}
              />
              <h1 className='text-lg font-bold tracking-[0.15em] uppercase'>
                Sticky Notes
              </h1>
            </div>
          </ViewTransition>
        </div>

        <div className='p-4'>
          <h2 className='text-muted-foreground mb-3 text-[10px] font-semibold tracking-[0.15em] uppercase'>
            Boards
          </h2>
          <Suspense fallback={<BoardsListSkeleton />}>
            <ViewTransition>
              <BoardsList />
            </ViewTransition>
          </Suspense>
        </div>
      </aside>
      {children}
    </section>
  );
}

function BoardsListSkeleton() {
  return (
    <ul className='space-y-2'>
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i}>
          <div className='h-9 w-full animate-pulse border border-white/10 bg-white/5' />
        </li>
      ))}
    </ul>
  );
}

async function BoardsList() {
  const boardsResult = await getStickyNotesBoards();

  if (boardsResult.status === 'error') {
    return (
      <div className='flex items-center gap-2'>
        <div className='size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' />
        <span className='text-xs tracking-wider text-red-500 uppercase'>
          Failed to load
        </span>
      </div>
    );
  }

  const boards = boardsResult.value;

  return <StickyNotesBoardsList boards={boards} />;
}
