'use client';

import { ViewTransition } from 'react';
import { useParams } from 'next/navigation';
import { format, isToday, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { SidebarTrigger } from '~/components/ui/sidebar';
import { BackButton } from '~/components/back-button';
import { HomeButton } from '~/components/home-button';
import blackBoardImage from '~/features/sticky-notes/assets/black-board.jpg';

export default function StickyNotesBoardLayout({
  children,
}: LayoutProps<'/sticky-notes/[date]'>) {
  const { date } = useParams<{ date: string }>();
  const parsedDate = parseISO(date);
  const isTodayDate = isToday(parsedDate);

  return (
    <div className='grid h-full grid-rows-[auto_1fr]'>
      <header className='bg-sidebar border-b border-white/10 backdrop-blur-sm'>
        <div className='flex w-full items-center justify-between p-4'>
          <div className='flex items-center gap-2'>
            <BackButton className='border-white/10 hover:border-white/20 hover:bg-white/5' />
            <HomeButton className='border-white/10 hover:border-white/20 hover:bg-white/5' />
            <SidebarTrigger className='border-white/10 hover:border-white/20 hover:bg-white/5' />
          </div>

          <ViewTransition>
            <div className='flex flex-col items-center'>
              <div className='flex items-center gap-2'>
                <CalendarIcon className='text-muted-foreground size-4' />
                <h2 className='text-sm font-bold tracking-[0.15em] uppercase'>
                  {isTodayDate ? 'Today' : format(parsedDate, 'EEEE')}
                </h2>
              </div>
              <span className='text-muted-foreground font-mono text-xs'>
                {format(parsedDate, 'dd MMM yyyy')}
              </span>
            </div>
          </ViewTransition>
        </div>
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
