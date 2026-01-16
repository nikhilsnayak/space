import { Suspense, ViewTransition } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FileTextIcon, HomeIcon, PlusIcon } from 'lucide-react';

import { LinkButton } from '~/components/ui/link-button';
import { getRecentlyUpdatedDocuments } from '~/features/docs/queries';

export default function DocsIndexPage() {
  return (
    <section>
      <header className='sticky top-0 flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
        <h1 className='flex items-center gap-2 text-2xl'>
          <FileTextIcon />
          <ViewTransition name='docs'>
            <span>Docs</span>
          </ViewTransition>
        </h1>
        <LinkButton href='/' size='icon-sm' variant='outline'>
          <HomeIcon />
        </LinkButton>
      </header>
      <div className='bg-accent text-accent-foreground'>
        <div className='mx-auto max-w-(--breakpoint-lg) space-y-3 py-6'>
          <h2>Start a new document</h2>
          <div>
            <Link href={`/docs/${crypto.randomUUID()}`} className='space-y-2'>
              <div className='bg-primary text-primary-foreground grid aspect-3/4 w-40 place-items-center'>
                <PlusIcon className='size-20' />
              </div>
              <p>Blank document</p>
            </Link>
          </div>
        </div>
      </div>
      <div className='mx-auto max-w-(--breakpoint-lg) space-y-3 py-6'>
        <h2>Recently opened</h2>
        <Suspense>
          <ViewTransition>
            <RecentlyOpenedDocuments />
          </ViewTransition>
        </Suspense>
      </div>
    </section>
  );
}

async function RecentlyOpenedDocuments() {
  const recentlyOpenedDocuments = await getRecentlyUpdatedDocuments();

  if (recentlyOpenedDocuments.length === 0) {
    return <p>No documents found.</p>;
  }

  return (
    <ul className='flex flex-wrap gap-4'>
      {recentlyOpenedDocuments.map((document) => (
        <li key={document.id} className='aspect-3/4 w-40 border p-4'>
          <Link
            href={`/docs/${document.id}`}
            className='flex size-full flex-col justify-between'
          >
            <span className='block overflow-hidden text-sm font-medium text-ellipsis'>
              {document.name || 'Untitled Doc'}
            </span>
            <span className='text-muted-foreground text-xs'>
              {`Last updated ${formatDistanceToNow(document.updatedAt)} ago`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
