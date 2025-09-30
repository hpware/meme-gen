import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './app/server/database/schema.ts',
  out: './migrations'
})
