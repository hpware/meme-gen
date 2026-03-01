import { db, schema } from "~~/server/database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, "auth_session");

  if (!sessionId) {
    return;
  }

  try {
    const session = await db.query.sessions.findFirst({
      where: eq(schema.sessions.uuid, sessionId),
    });

    // Check if session exists and is not expired
    if (session && new Date(session.expires_at) > new Date()) {
       const user = await db.query.accounts.findFirst({
         where: eq(schema.accounts.uuid, session.to_user),
       });
       
       if (user) {
         event.context.user = {
            uuid: user.uuid,
            email: user.email,
         };
       }
    }
  } catch (error) {
    // Invalid session ID or DB error
    console.error("Auth middleware error:", error);
  }
});
