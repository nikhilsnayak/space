import { format, isToday } from 'date-fns';
import { HomeIcon } from 'lucide-react';

import { LinkButton } from '~/components/ui/link-button';
import { StickyNotesBoard } from '~/features/sticky-notes/components/sticky-notes-board';
import { findStickyNotesBoardForDate } from '~/features/sticky-notes/queries';

export default async function StickyNotesBoardPage({
  params,
}: PageProps<'/sticky-notes/[date]'>) {
  const { date } = await params;
  const notes = await findStickyNotesBoardForDate(date);

  return (
    <div className='grid h-full grid-rows-[auto_1fr]'>
      <header className='flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
        <h2 className='text-2xl font-medium'>
          {isToday(date)
            ? `Today - ${format(date, 'dd MMM')}`
            : format(date, 'EEEE - dd MMM yyyy')}
        </h2>
        <LinkButton href='/' size='icon-sm' variant='outline'>
          <HomeIcon />
        </LinkButton>
      </header>
      <StickyNotesBoard key={date} date={date} notes={notes} />
    </div>
  );
}
