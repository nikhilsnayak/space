import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  casing: 'snake_case',
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
