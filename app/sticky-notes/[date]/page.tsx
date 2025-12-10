import { ViewTransition } from 'react';
import { format, isToday } from 'date-fns';

import { ensureSession } from '~/lib/auth';
import { StickyNotesBoard } from '~/features/sticky-notes/components/sticky-notes-board';
import { findStickyNotesBoardForDate } from '~/features/sticky-notes/queries';

export default async function StickyNotesDatePage({
  params,
}: PageProps<'/sticky-notes/[date]'>) {
  await ensureSession();
  const { date } = await params;
  const stickyNotesBoardResult = await findStickyNotesBoardForDate(date);

  if (stickyNotesBoardResult.isErr()) {
    return <div>{stickyNotesBoardResult.error.message}</div>;
  }

  const notes = stickyNotesBoardResult.value?.notes ?? [];

  return (
    <div className='grid h-full grid-rows-[auto_1fr] bg-cover bg-center bg-no-repeat'>
      <ViewTransition>
        <h2 className='border-b p-4 text-2xl font-medium backdrop-blur-sm'>
          {isToday(date)
            ? `Today - ${format(date, 'dd MMM')}`
            : format(date, 'EEEE - dd MMM yyyy')}
        </h2>
      </ViewTransition>
      <StickyNotesBoard date={date} notes={notes} />
    </div>
  );
}
