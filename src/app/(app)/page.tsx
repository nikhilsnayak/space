import { ViewTransition } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileTextIcon, StickyNoteIcon } from 'lucide-react';

import { getSession } from '~/lib/auth';
import { ClockWidget } from '~/features/dashboard/components/clock-widget';
import { WeatherWidget } from '~/features/dashboard/components/weather-widget';
import { WorkModeToggle } from '~/features/dashboard/components/work-mode-toggle';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <section className='mx-auto min-h-dvh max-w-(--breakpoint-xl) p-8'>
      <header className='mb-8 text-center'>
        <ViewTransition>
          <h1 className='text-3xl font-bold'>Space</h1>
        </ViewTransition>
      </header>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]'>
        <div className='space-y-6'>
          <ClockWidget />
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <WorkModeToggle />
            <WeatherWidget />
          </div>
        </div>
        <div className='space-y-6'>
          <div className='sticky top-8 space-y-6'>
            <Link
              href='/sticky-notes'
              className='bg-card text-card-foreground group hover:border-ring focus-visible:ring-ring relative flex flex-col items-center justify-center gap-4 border p-8 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            >
              <div className='text-muted-foreground group-hover:text-foreground transition-colors duration-150'>
                <StickyNoteIcon className='size-16' />
              </div>
              <ViewTransition name='sticky-notes'>
                <h2 className='text-xl font-semibold'>Sticky Notes</h2>
              </ViewTransition>
            </Link>
            <Link
              href='/docs'
              className='bg-card text-card-foreground group hover:border-ring focus-visible:ring-ring relative flex flex-col items-center justify-center gap-4 border p-8 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            >
              <div className='text-muted-foreground group-hover:text-foreground transition-colors duration-150'>
                <FileTextIcon className='size-16' />
              </div>
              <ViewTransition name='docs'>
                <h2 className='text-xl font-semibold'>Docs</h2>
              </ViewTransition>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
