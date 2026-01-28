import { Suspense, ViewTransition } from 'react';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { BackButton } from '~/components/back-button';
import { HomeButton } from '~/components/home-button';
import {
  RecentlyUpdatedDocuments,
  RecentlyUpdatedDocumentsSkeleton,
} from '~/features/docs/components/recently-opened-documents';

export default function DocsIndexPage() {
  return (
    <section className='relative z-10 min-h-dvh'>
      <div className='mx-auto max-w-(--breakpoint-lg) p-6'>
        <header className='relative mb-6 border-b border-white/10 pb-6'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <BackButton className='border-white/10 hover:border-white/20 hover:bg-white/5' />
              <HomeButton className='border-white/10 hover:border-white/20 hover:bg-white/5' />
            </div>

            <div className='flex-1 text-center'>
              <ViewTransition name='docs'>
                <h1 className='text-xl font-bold tracking-[0.15em] uppercase'>
                  Documents
                </h1>
              </ViewTransition>
            </div>
          </div>
        </header>

        <div className='space-y-8'>
          <div className='space-y-4'>
            <h2 className='text-muted-foreground text-sm font-semibold tracking-[0.15em] uppercase'>
              Create New
            </h2>
            <Link
              href='/docs/new'
              className='group bg-card/80 hover:bg-card/90 focus-visible:ring-ring relative flex aspect-3/4 w-40 flex-col items-center justify-center gap-4 overflow-hidden border border-white/10 p-6 backdrop-blur-sm transition-all duration-200 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            >
              <div className='absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-white/20' />
              <div className='absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-white/20' />
              <div className='absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-white/20' />
              <div className='absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-white/20' />

              <div className='text-muted-foreground group-hover:text-foreground transition-colors duration-150'>
                <PlusIcon className='size-12' strokeWidth={1.5} />
              </div>
              <div className='text-center'>
                <span className='text-xs font-semibold tracking-[0.15em] uppercase'>
                  New Document
                </span>
                <p className='text-muted-foreground mt-1 text-[10px]'>Blank</p>
              </div>
            </Link>
          </div>

          <div className='space-y-4'>
            <h2 className='text-muted-foreground text-sm font-semibold tracking-[0.15em] uppercase'>
              Recent Documents
            </h2>
            <ViewTransition>
              <Suspense fallback={<RecentlyUpdatedDocumentsSkeleton />}>
                <RecentlyUpdatedDocuments />
              </Suspense>
            </ViewTransition>
          </div>
        </div>
      </div>
    </section>
  );
}
