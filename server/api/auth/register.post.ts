import { db, schema } from "~~/server/database";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  if (!body || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  // Check if user already exists
  const existingUser = await db.query.accounts.findFirst({
    where: eq(schema.accounts.email, body.email),
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "User already exists",
    });
  }

  // Hash password
  const hashedPassword = await argon2.hash(body.password);

  // Create user
  const [newUser] = await db.insert(schema.accounts).values({
    email: body.email,
    password: hashedPassword,
  }).returning();

  // Create session
  const [session] = await db.insert(schema.sessions).values({
    to_user: newUser.uuid,
  }).returning();

  // Set cookie
  setCookie(event, "auth_session", session.uuid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return {
    success: true,
    user: {
      email: newUser.email,
      uuid: newUser.uuid,
    },
  };
});
