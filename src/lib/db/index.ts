import { drizzle } from 'drizzle-orm/bun-sql';

import { relations } from './relations';
import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  relations,
  casing: 'snake_case',
  logger: process.env.NODE_ENV !== 'production',
});
