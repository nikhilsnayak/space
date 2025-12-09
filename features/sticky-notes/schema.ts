import { date, jsonb, pgTable } from 'drizzle-orm/pg-core';
import z from 'zod';

import { NOTE_COLORS } from './constants';

export const NoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  pos: z.object({
    x: z.number(),
    y: z.number(),
  }),
  color: z.enum(NOTE_COLORS),
  rotate: z.number(),
});

export type Note = z.infer<typeof NoteSchema>;

export const StickyNotesBoard = pgTable('sticky_notes_boards', {
  date: date({ mode: 'string' }).primaryKey(),
  notes: jsonb().$type<Note[]>().notNull(),
});
