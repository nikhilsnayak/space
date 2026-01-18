import { Suspense, ViewTransition } from 'react';
import Link from 'next/link';
import { FileTextIcon, PlusIcon } from 'lucide-react';

import { BackButton } from '~/components/ui/back-button';
import { HomeButton } from '~/components/ui/home-button';
import {
  RecentlyUpdatedDocuments,
  RecentlyUpdatedDocumentsSkeleton,
} from '~/features/docs/components/recently-opened-documents';

export default function DocsIndexPage() {
  return (
    <section className='min-h-dvh'>
      <header className='bg-background/50 sticky top-0 z-10 flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
        <div className='flex items-center gap-4'>
          <BackButton />
          <h1 className='flex items-center gap-2 text-2xl font-semibold'>
            <FileTextIcon />
            <ViewTransition name='docs'>
              <span>Docs</span>
            </ViewTransition>
          </h1>
        </div>
        <HomeButton />
      </header>

      <div className='mx-auto max-w-(--breakpoint-lg) space-y-8 p-6'>
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>New Document</h2>
          <Link
            href='/docs/new'
            className='bg-card text-card-foreground group hover:border-ring focus-visible:ring-ring relative flex aspect-3/4 w-40 flex-col items-center justify-center gap-4 border p-6 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          >
            <div className='text-muted-foreground group-hover:text-foreground transition-colors duration-150'>
              <PlusIcon className='size-16' />
            </div>
            <span className='text-sm font-medium'>Blank</span>
          </Link>
        </div>

        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>Recently Updated</h2>
          <ViewTransition>
            <Suspense fallback={<RecentlyUpdatedDocumentsSkeleton />}>
              <RecentlyUpdatedDocuments />
            </Suspense>
          </ViewTransition>
        </div>
      </div>
    </section>
  );
}
