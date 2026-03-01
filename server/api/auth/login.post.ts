import { db, schema } from "~~/server/database";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body || !body.email || !body.password) {
      return {
        success: false,
        msg: "Email and password are required.",
      };
    }

    const getUserAccount = await db.query.accounts.findFirst({
      where: eq(schema.accounts.email, body.email),
    });

    if (!getUserAccount || !(await argon2.verify(getUserAccount.password, body.password))) {
      return {
        success: false,
        msg: "Invalid email or password.",
      };
    }

    // Create session
    const [session] = await db.insert(schema.sessions).values({
      to_user: getUserAccount.uuid,
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
        email: getUserAccount.email,
        uuid: getUserAccount.uuid,
      },
    };
  } catch (e: any) {
    return {
      success: false,
      msg: e.msg,
    };
  }
});
