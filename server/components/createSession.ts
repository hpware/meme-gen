import { db, schema } from "~~/server/database";

const createSession = async (userId: string) => {
  try {
    if (!userId) {
      return {
        success: false,
        msg: "no user id",
      };
    }
    const createNewSession = await db
      .insert(schema.sessions)
      .values({
        to_user: userId,
      })
      .returning({ sessionId: schema.sessions.uuid });
  } catch (e: any) {
    return {
      success: false,
      msg: e.msg,
    };
  }
};

export default createSession;
