'use client';

import { useState } from 'react';
import { XIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';

import type { Note } from '../schema';
import { useStickyNotesBoard } from './context/sticky-notes-board-context';

interface StickyNoteListItemProps {
  note: Note;
}

export function StickyNoteListItem({ note }: StickyNoteListItemProps) {
  const board = useStickyNotesBoard();
  const [isEditing, setIsEditing] = useState(!note.text.trim());

  const { id, text, color } = note;

  return (
    <li
      className='grid grid-rows-[auto_1fr] border text-gray-800'
      style={{
        backgroundColor: color,
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.02) 2px,
            rgba(0,0,0,0.02) 4px
          )
        `,
      }}
    >
      <div className='flex items-center justify-end gap-1 border-b border-black/5 p-1.5'>
        <Button
          variant='destructive'
          size='icon-xs'
          aria-label='Delete note'
          className='p-0'
          onClick={() => board.deleteNote(id)}
        >
          <XIcon className='size-3' />
        </Button>
      </div>
      <div
        className='min-h-24 cursor-text p-3'
        onClick={() => setIsEditing(true)}
        role='button'
        tabIndex={0}
      >
        {isEditing ? (
          <textarea
            autoFocus
            defaultValue={text}
            placeholder='add your note here...'
            className='min-h-20 w-full resize-none border-none bg-transparent p-0 text-sm outline-none focus-visible:ring-0'
            onBlur={(e) => {
              const newText = e.target.value.trim();
              if (newText) {
                board.updateNote(id, { text: newText });
                setIsEditing(false);
              } else if (text) {
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <pre className='text-sm wrap-break-word whitespace-pre-wrap'>
            {text}
          </pre>
        )}
      </div>
    </li>
  );
}
