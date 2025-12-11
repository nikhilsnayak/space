import { createFileRoute } from '@tanstack/react-router';
import { format, isToday } from 'date-fns';
import { HomeIcon } from 'lucide-react';

import { LinkButton } from '~/components/ui/link-button';
import { StickyNotesBoard } from '~/features/sticky-notes/components/sticky-notes-board';
import { findStickyNotesBoardForDate } from '~/features/sticky-notes/queries';

export const Route = createFileRoute('/(app)/sticky-notes/$date')({
  loader: async ({ params }) => {
    return await findStickyNotesBoardForDate({ data: params });
  },
  component: StickyNotesDatePage,
});

function StickyNotesDatePage() {
  const notes = Route.useLoaderData();
  const { date } = Route.useParams();

  return (
    <div className='grid h-full grid-rows-[auto_1fr]'>
      <div className='flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
        <h2 className='text-2xl font-medium'>
          {isToday(date)
            ? `Today - ${format(date, 'dd MMM')}`
            : format(date, 'EEEE - dd MMM yyyy')}
        </h2>
        <LinkButton to='/' size='icon-sm' variant='outline'>
          <HomeIcon />
        </LinkButton>
      </div>
      <StickyNotesBoard key={date} date={date} notes={notes} />
    </div>
  );
}
