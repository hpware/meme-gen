import {
  integer,
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const accounts = pgTable("account", {
  uuid: uuid().defaultRandom().primaryKey(),
  email: text().notNull(),
  password: text().notNull(), // argon2 + sha512 string.
  email_verified: boolean().notNull().default(false),
  banned: boolean().notNull().default(false),
  admin_perms: boolean().notNull().default(false), // off at all times
});

export const sessions = pgTable("sessions", {
  uuid: uuid().defaultRandom().primaryKey(),
  to_user: uuid()
    .notNull()
    .references(() => accounts.uuid),
  expires_at: timestamp()
    .default(sql`NOW() + INTERVAL '1 day'`)
    .notNull(),
});

export const memes = pgTable("memes", {
  uuid: uuid().defaultRandom().primaryKey(),
  memeImage: text().notNull().unique(),
  aiGeneratedDescription: text().notNull().default("Unknown"),
  uploaded_by: uuid()
    .notNull()
    .references(() => accounts.uuid),
  uploaded_at: timestamp().defaultNow(),
});
