import { integer, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const memes = pgTable("memes", {
  uuid: uuid().defaultRandom().primaryKey(),
  memeImage: text().notNull(),
  aiGeneratedDescription: text().notNull().default("Unknown description"),
  uploaded_by: text().notNull(),
  uploaded_at: timestamp().defaultNow(),
});
