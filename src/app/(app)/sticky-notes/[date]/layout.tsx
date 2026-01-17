'use client';

import { ViewTransition } from 'react';
import { useParams } from 'next/navigation';
import { format, isToday } from 'date-fns';
import { HomeIcon } from 'lucide-react';

import { LinkButton } from '~/components/ui/link-button';
import blackBoardImage from '~/features/sticky-notes/assets/black-board.jpg';

export default function StickyNotesBoardLayout({
  children,
}: LayoutProps<'/sticky-notes/[date]'>) {
  const { date } = useParams<{ date: string }>();

  return (
    <div className='grid h-full grid-rows-[auto_1fr]'>
      <header className='flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
        <ViewTransition>
          <h2 className='text-2xl font-medium'>
            {isToday(date)
              ? `Today - ${format(date, 'dd MMM')}`
              : format(date, 'EEEE - dd MMM yyyy')}
          </h2>
        </ViewTransition>
        <LinkButton href='/' size='icon-sm' variant='outline'>
          <HomeIcon />
        </LinkButton>
      </header>
      <div
        className='bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${blackBoardImage.src})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
