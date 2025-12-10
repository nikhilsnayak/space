import { format, isToday } from 'date-fns';
import { HomeIcon } from 'lucide-react';

import { ensureSession } from '~/lib/auth';
import { LinkButton } from '~/components/ui/link-button';
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
    <div className='grid h-full grid-rows-[auto_1fr]'>
      <div className='flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
        <h2 className='text-2xl font-medium'>
          {isToday(date)
            ? `Today - ${format(date, 'dd MMM')}`
            : format(date, 'EEEE - dd MMM yyyy')}
        </h2>
        <LinkButton href='/' size='icon-lg' variant='outline'>
          <HomeIcon />
        </LinkButton>
      </div>
      <StickyNotesBoard date={date} notes={notes} />
    </div>
  );
}
