import { ViewTransition } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import { getRecentlyUpdatedDocuments } from '../queries';

export function RecentlyUpdatedDocumentsSkeleton() {
  return (
    <ul className='flex flex-wrap gap-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i}>
          <div className='bg-card border-muted flex aspect-3/4 w-40 animate-pulse flex-col justify-between border p-4 shadow-sm'>
            <div className='space-y-2'>
              <div className='bg-muted h-4 w-28' />
              <div className='bg-muted h-3 w-20' />
            </div>
            <div className='bg-muted h-3 w-24' />
          </div>
        </li>
      ))}
    </ul>
  );
}

export async function RecentlyUpdatedDocuments() {

 
   const recentlyUpdatedDocuments = await getRecentlyUpdatedDocuments();


  if (recentlyUpdatedDocuments.length === 0) {
    return <p className='text-muted-foreground text-sm'>No documents found.</p>;
  }

  return (
    <ul className='flex flex-wrap gap-4'>
      {recentlyUpdatedDocuments.map((document) => (
        <li key={document.id}>
          <Link
            href={`/docs/${document.id}`}
            aria-label={`Open document: ${document.name || 'Untitled Doc'}`}
            className='bg-card text-card-foreground group hover:border-ring focus-visible:ring-ring relative flex aspect-3/4 w-40 flex-col justify-between border p-4 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          >
            <ViewTransition name={`doc-name-${document.id}`}>
              <span className='block overflow-hidden text-sm font-medium text-ellipsis'>
                {document.name || 'Untitled Doc'}
              </span>
            </ViewTransition>
            <span className='text-muted-foreground text-xs'>
              {`Last updated ${formatDistanceToNow(document.updatedAt)} ago`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
