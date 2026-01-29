'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';

import { useStickyNotesBoard } from './context/sticky-notes-board-context';
import { StickyNoteListItem } from './sticky-note-list-item';

export function StickyNotesList() {
  const board = useStickyNotesBoard();

  return (
    <div className='flex h-full flex-col lg:hidden'>
      <ul className='flex-1 space-y-3 overflow-y-auto p-4 pb-24'>
        {board.notes.map((note) => (
          <StickyNoteListItem key={note.id} note={note} />
        ))}
      </ul>
      <Button
        variant='default'
        size='icon-lg'
        aria-label='Add note'
        className='fixed right-6 bottom-6 z-10 size-14 rounded-none shadow-lg lg:right-8 lg:bottom-8'
        onClick={() => board.addNote({ x: 0, y: 0 })}
      >
        <PlusIcon className='size-6' />
      </Button>
    </div>
  );
}
