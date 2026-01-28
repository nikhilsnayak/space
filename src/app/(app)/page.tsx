import { ViewTransition } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileTextIcon, StickyNoteIcon } from 'lucide-react';

import { getSession } from '~/lib/auth';
import { ClockWidget } from '~/features/control-center/components/clock-widget';
import { WeatherWidget } from '~/features/control-center/components/weather-widget';
import { WorkModeToggle } from '~/features/control-center/components/work-mode-toggle';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <section className='relative z-10 mx-auto min-h-dvh max-w-(--breakpoint-xl) p-8'>
      <header className='mb-8 border-b border-white/10 pb-6'>
        <div className='flex items-center justify-center gap-4'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold tracking-[0.2em] uppercase'>
              SPACE
            </h1>
            <p className='text-muted-foreground text-xs tracking-[0.3em] uppercase'>
              Control Center
            </p>
          </div>
        </div>
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
            {(
              [
                {
                  name: 'Sticky Notes',
                  icon: StickyNoteIcon,
                  href: '/sticky-notes',
                },
                {
                  name: 'Documents',
                  icon: FileTextIcon,
                  href: '/docs',
                },
              ] as const
            ).map((feature) => {
              return (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className='group bg-card/80 hover:bg-card/90 focus-visible:ring-ring relative flex flex-col items-center justify-center gap-4 overflow-hidden border border-white/10 p-8 backdrop-blur-sm transition-all duration-200 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                >
                  <div className='absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-white/20' />
                  <div className='absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-white/20' />
                  <div className='absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-white/20' />
                  <div className='absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-white/20' />

                  <div className='text-muted-foreground group-hover:text-foreground transition-colors duration-150'>
                    <feature.icon className='size-12' strokeWidth={1.5} />
                  </div>
                  <ViewTransition name={feature.href.slice(1)}>
                    <div className='text-center'>
                      <h2 className='text-sm font-semibold tracking-[0.15em] uppercase'>
                        {feature.name}
                      </h2>
                    </div>
                  </ViewTransition>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
