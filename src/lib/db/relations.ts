import { defineRelations } from 'drizzle-orm';

import { Document } from '~/features/docs/schema';
import { StickyNotesBoard } from '~/features/sticky-notes/schema';

export const relations = defineRelations({ StickyNotesBoard, Document });
