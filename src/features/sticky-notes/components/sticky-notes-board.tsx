'use client';

import { startTransition, useActionState, useOptimistic, useRef } from 'react';
import { AnimatePresence } from 'motion/react';

import { TODAY } from '~/lib/constants';
import { cn } from '~/lib/utils';
import { toast } from '~/components/ui/toast';

import { upsertStickyNotesForDate } from '../mutations';
import type { Note } from '../schema';
import { getRandomNoteColor, getRandomNoteRotate } from '../utils';
import { StickyNotesBoardContext } from './context/sticky-notes-board-context';
import { StickyNote } from './sticky-note';

interface StickyNotesBoardProps {
  date: string;
  notes: Array<Note>;
}

export function StickyNotesBoard({
  date,
  notes: initialNotes,
}: StickyNotesBoardProps) {
  const [notes, upsertStickyNotesForDateAction] = useActionState(
    async (prev: Array<Note>, notes: Array<Note>) => {
      const result = await upsertStickyNotesForDate({ date, notes });
      if (result.status === 'error') {
        toast.add({
          title: 'Error',
          description: 'Failed to save notes',
        });
        return prev;
      }
      return result.value;
    },
    initialNotes
  );
  const [optimisticNotes, setOptimisticNotes] = useOptimistic(notes);
  const boardRef = useRef<HTMLDivElement>(null);

  const performUpsert = (updatedNotes: Array<Note>) => {
    startTransition(() => {
      setOptimisticNotes(updatedNotes);
      upsertStickyNotesForDateAction(updatedNotes);
    });
  };

  const addNote = (pos: { x: number; y: number }) => {
    const color = getRandomNoteColor();
    const rotate = getRandomNoteRotate();
    const id = crypto.randomUUID();

    const newNote: Note = {
      id,
      pos,
      color,
      rotate,
      text: '',
    };

    performUpsert([...optimisticNotes, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = optimisticNotes.map((note) =>
      note.id === id ? { ...note, ...updates } : note
    );

    performUpsert(updatedNotes);
  };

  const deleteNote = (id: string) => {
    performUpsert(optimisticNotes.filter((note) => note.id !== id));
  };

  const editable = date === TODAY;

  const board = {
    ref: boardRef,
    editable,
    updateNote,
    deleteNote,
  };

  return (
    <div
      ref={boardRef}
      className={cn(
        'relative isolate h-full w-full overflow-hidden',
        !editable && 'pointer-events-none'
      )}
      onClick={(e) => {
        if (!e.altKey) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addNote({ x, y });
      }}
    >
      <StickyNotesBoardContext value={board}>
        <AnimatePresence>
          {optimisticNotes.map((note) => (
            <StickyNote key={note.id} note={note} />
          ))}
        </AnimatePresence>
      </StickyNotesBoardContext>
    </div>
  );
}
