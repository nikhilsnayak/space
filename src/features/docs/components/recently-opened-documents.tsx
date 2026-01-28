import { ViewTransition } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import { getRecentlyUpdatedDocuments } from '../queries';

export function RecentlyUpdatedDocumentsSkeleton() {
  return (
    <ul className='flex flex-wrap gap-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i}>
          <div className='bg-card/80 relative flex aspect-3/4 w-40 animate-pulse flex-col justify-between overflow-hidden border border-white/10 p-4 backdrop-blur-sm'>
            <div className='absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-white/20' />
            <div className='absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-white/20' />
            <div className='absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-white/20' />
            <div className='absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-white/20' />

            <div className='space-y-2'>
              <div className='h-4 w-28 bg-white/10' />
              <div className='h-3 w-20 bg-white/10' />
            </div>
            <div className='space-y-2'>
              <div className='h-3 w-24 bg-white/10' />
              <div className='h-2 w-16 bg-white/10' />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export async function RecentlyUpdatedDocuments() {
  const recentlyUpdatedDocumentsResult = await getRecentlyUpdatedDocuments();

  if (recentlyUpdatedDocumentsResult.status === 'error') {
    return (
      <div className='flex items-center gap-2'>
        <div className='size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' />
        <span className='text-xs tracking-wider text-red-500 uppercase'>
          Failed to load documents
        </span>
      </div>
    );
  }

  const recentlyUpdatedDocuments = recentlyUpdatedDocumentsResult.value;

  if (recentlyUpdatedDocuments.length === 0) {
    return (
      <div className='flex items-center gap-2'>
        <div className='bg-muted-foreground/40 size-2 rounded-full' />
        <span className='text-muted-foreground text-xs tracking-wider uppercase'>
          No documents found
        </span>
      </div>
    );
  }

  return (
    <ul className='flex flex-wrap gap-4'>
      {recentlyUpdatedDocuments.map((document, index) => (
        <li key={document.id}>
          <Link
            href={`/docs/${document.id}`}
            aria-label={`Open document: ${document.name || 'Untitled Doc'}`}
            className='group bg-card/80 hover:bg-card/90 focus-visible:ring-ring relative flex aspect-3/4 w-40 flex-col justify-between overflow-hidden border border-white/10 p-4 backdrop-blur-sm transition-all duration-200 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          >
            <div className='absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-white/20' />
            <div className='absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-white/20' />
            <div className='absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-white/20' />
            <div className='absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-white/20' />

            <div className='space-y-1'>
              <ViewTransition name={`doc-name-${document.id}`}>
                <span className='block overflow-hidden text-sm font-medium text-ellipsis'>
                  {document.name || 'Untitled Doc'}
                </span>
              </ViewTransition>
            </div>

            <div className='space-y-1'>
              <span className='text-muted-foreground block text-[10px]'>
                {`Updated ${formatDistanceToNow(document.updatedAt)} ago`}
              </span>
              <span className='text-muted-foreground block font-mono text-[9px] tracking-wider uppercase'>
                DOC-{String(index + 1).padStart(3, '0')}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
