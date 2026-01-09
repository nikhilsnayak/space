import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FileTextIcon, HomeIcon, PlusIcon } from 'lucide-react';

import { LinkButton } from '~/components/ui/link-button';
import { getRecentlyUpdatedDocuments } from '~/features/docs/queries';

export default async function DocsIndexPage() {
  const recentlyOpenedDocuments = await getRecentlyUpdatedDocuments();

  return (
    <section>
      <header className='sticky top-0 flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
        <h1 className='flex items-center gap-2 text-2xl'>
          <FileTextIcon />
          <span>Docs</span>
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
        {recentlyOpenedDocuments.length > 0 ? (
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
        ) : (
          <p>No documents found.</p>
        )}
      </div>
    </section>
  );
}
