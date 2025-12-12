import { createFileRoute, Outlet } from '@tanstack/react-router';

import { StickyNotesBoardsList } from '~/features/sticky-notes/components/sticky-notes-boards-list';
import { getStickyNotesBoards } from '~/features/sticky-notes/queries';

export const Route = createFileRoute('/(app)/sticky-notes')({
  loader: async () => {
    return await getStickyNotesBoards();
  },
  component: StickyNotesLayout,
});

function StickyNotesLayout() {
  const { boards } = Route.useLoaderData();

  return (
    <section className='grid h-full grid-cols-[240px_1fr]'>
      <aside className='h-full border-r'>
        <h1 className='border-b p-4 text-center text-2xl font-bold'>
          Sticky Notes
        </h1>
        <StickyNotesBoardsList boards={boards} />
      </aside>
      <Outlet />
    </section>
  );
}
