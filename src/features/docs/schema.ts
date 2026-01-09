import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { SerializedEditorState } from 'lexical';

export const Document = pgTable('documents', {
  id: text().primaryKey(),
  name: text(),
  content: jsonb().$type<SerializedEditorState>(),
  createdAt: timestamp({ mode: 'string', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: 'string', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
});
