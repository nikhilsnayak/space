import { createContext, use } from 'react';

import { Note } from '../../schema';

export const StickyNotesBoardContext = createContext<{
  ref: React.RefObject<HTMLDivElement | null>;
  editable: boolean;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
} | null>(null);

export function useStickyNotesBoard() {
  const board = use(StickyNotesBoardContext);
  if (!board) {
    throw new Error('Board not found');
  }
  return board;
}
