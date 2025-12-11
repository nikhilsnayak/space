'use client';

import { useParams } from '@tanstack/react-router';
import { CalendarIcon } from 'lucide-react';

import { TODAY } from '~/lib/constants';
import { LinkButton } from '~/components/ui/link-button';

export function StickyNotesBoardsList({ boards }: { boards: Array<string> }) {
  const { date } = useParams({ from: '/(app)/sticky-notes/$date' });

  return (
    <ul className='space-y-4 p-4'>
      {(boards[0] === TODAY ? boards : [TODAY, ...boards]).map((board) => (
        <li key={board}>
          <LinkButton
            to='/sticky-notes/$date'
            params={{ date: board }}
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
