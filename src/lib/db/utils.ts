import { Param, sql } from 'drizzle-orm';

export function asJsonb<T>(data: T) {
  // https://github.com/drizzle-team/drizzle-orm/issues/724#issuecomment-2679491232
  return sql`${new Param(data)}::jsonb`;
}
