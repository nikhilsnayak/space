'use client';

import { useParams } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';

import { TODAY } from '~/lib/constants';
import { LinkButton } from '~/components/ui/link-button';

export function StickyNotesBoardsList({ boards }: { boards: string[] }) {
  const { date } = useParams<{ date: string }>();

  return (
    <ul className='space-y-4 p-4'>
      {(boards[0] === TODAY ? boards : [TODAY, ...boards]).map((board) => (
        <li key={board}>
          <LinkButton
            href={{ pathname: `/sticky-notes/${board}` }}
            variant={date === board ? 'default' : 'secondary'}
            className='w-full'
          >
            <CalendarIcon className='size-4' />
            {board}
          </LinkButton>
        </li>
      ))}
    </ul>
  );
}
