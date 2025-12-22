import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { FileTextIcon, PlusIcon } from 'lucide-react';

import { getRecentlyOpenedDocuments } from '~/features/docs/queries';

export const Route = createFileRoute('/(app)/docs/')({
  gcTime: 0,
  loader: async () => {
    return await getRecentlyOpenedDocuments();
  },
  component: DocsIndexPage,
});

function DocsIndexPage() {
  const recentlyOpenedDocuments = Route.useLoaderData();

  return (
    <section>
      <header className='p-4 sticky top-0 backdrop-blur-sm shadow-sm border-b'>
        <h1 className='flex items-center gap-2 text-2xl'>
          <FileTextIcon />
          <span>Docs</span>
        </h1>
      </header>
      <div className='bg-accent text-accent-foreground'>
        <div className='max-w-(--breakpoint-lg) py-6 mx-auto space-y-3'>
          <h2>Start a new document</h2>
          <div>
            <Link
              to='/docs/$id'
              params={{
                id: crypto.randomUUID(),
              }}
              className='space-y-2'
            >
              <div className='w-40 aspect-3/4 bg-primary text-primary-foreground grid place-items-center'>
                <PlusIcon className='size-20' />
              </div>
              <p>Blank document</p>
            </Link>
          </div>
        </div>
      </div>
      <div className='max-w-(--breakpoint-lg) py-6 mx-auto space-y-3'>
        <h2>Recently opened</h2>
        <div>
          <ul>
            {recentlyOpenedDocuments.map((document) => (
              <li key={document.id}>
                <Link
                  to='/docs/$id'
                  className='w-40 aspect-3/4 border p-4 flex flex-col justify-between'
                  params={{ id: document.id }}
                >
                  <span className='text-sm font-medium'>{document.name}</span>
                  <span className='text-xs text-muted-foreground'>
                    {`Opened ${formatDistanceToNow(new Date(document.updatedAt))} ago`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
