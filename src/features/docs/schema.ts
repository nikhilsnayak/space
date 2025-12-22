import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const Document = pgTable('documents', {
  id: text().primaryKey(),
  name: text(),
  // eslint-disable-next-line
  content: jsonb().$type<any>(),
  createdAt: timestamp({ mode: 'string', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: 'string', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
});
