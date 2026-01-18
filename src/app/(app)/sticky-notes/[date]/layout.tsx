'use client';

import { ViewTransition } from 'react';
import { useParams } from 'next/navigation';
import { format, isToday } from 'date-fns';

import { BackButton } from '~/components/ui/back-button';
import { HomeButton } from '~/components/ui/home-button';
import blackBoardImage from '~/features/sticky-notes/assets/black-board.jpg';

export default function StickyNotesBoardLayout({
  children,
}: LayoutProps<'/sticky-notes/[date]'>) {
  const { date } = useParams<{ date: string }>();

  return (
    <div className='grid h-full grid-rows-[auto_1fr]'>
      <header className='bg-background/50 flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
        <div className='flex items-center gap-4'>
          <BackButton />
          <ViewTransition>
            <h2 className='text-2xl font-medium'>
              {isToday(date)
                ? `Today - ${format(date, 'dd MMM')}`
                : format(date, 'EEEE - dd MMM yyyy')}
            </h2>
          </ViewTransition>
        </div>
        <HomeButton />
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
