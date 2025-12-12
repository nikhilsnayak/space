import { defineRelations } from 'drizzle-orm';

import { StickyNotesBoard } from '~/features/sticky-notes/schema';

export const relations = defineRelations({ StickyNotesBoard });
