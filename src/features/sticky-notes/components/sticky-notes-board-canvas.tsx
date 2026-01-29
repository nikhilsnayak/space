'use client';

import { AnimatePresence } from 'motion/react';

import { useStickyNotesBoard } from './context/sticky-notes-board-context';
import { StickyNote } from './sticky-note';

export function StickyNotesBoardCanvas() {
  const board = useStickyNotesBoard();

  return (
    <div
      className='relative isolate hidden h-full w-full overflow-hidden lg:block'
      onClick={(e) => {
        if (!e.altKey) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        board.addNote({ x, y });
      }}
    >
      <AnimatePresence>
        {board.notes.map((note) => (
          <StickyNote key={note.id} note={note} />
        ))}
      </AnimatePresence>
    </div>
  );
}
