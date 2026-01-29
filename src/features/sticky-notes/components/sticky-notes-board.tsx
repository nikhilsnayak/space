'use client';

import { startTransition, useActionState, useOptimistic } from 'react';

import { toast } from '~/components/ui/toast';

import { upsertStickyNotesForDate } from '../mutations';
import type { Note } from '../schema';
import { getRandomNoteColor, getRandomNoteRotate } from '../utils';
import { StickyNotesBoardContext } from './context/sticky-notes-board-context';
import { StickyNotesBoardCanvas } from './sticky-notes-board-canvas';
import { StickyNotesList } from './sticky-notes-list';

interface StickyNotesBoardProps {
  date: string;
  notes: Note[];
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

  const board = {
    notes: optimisticNotes,
    addNote,
    updateNote,
    deleteNote,
  };

  return (
    <StickyNotesBoardContext value={board}>
      {/* Mobile: List view */}
      <StickyNotesList />
      {/* Desktop: Canvas board */}
      <StickyNotesBoardCanvas />
    </StickyNotesBoardContext>
  );
}
