import { db, schema } from "~~/server/database";
import argon2 from "argon2";

export default defineEventHandler(async (event) => {
  try {
    const body: any = readBody(event);
    if (!(body && body.email && body.password)) {
      return {
        success: false,
        msg: "Awww shap, you don't have enough aura to use this api 🫥",
      };
    }
    const getUserAccount = await db.query.accounts.findFirst({
      with: {
        email: body.email,
      },
    });

    if (getUserAccount === undefined) {
      return {
        success: false,
        msg: "這個帳號不存在 :(",
      };
    }

    if (!(await argon2.verify(getUserAccount.password, body.password))) {
      return {
        success: false,
        msg: "密碼錯誤",
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
