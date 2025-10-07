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
    //setCookie(event, "dd", "dd");
    //db.query();
    // argon2.verify();
    return {
      success: true,
      msg: "",
    };
  } catch (e: any) {
    return {
      success: false,
      msg: e.msg,
    };
  }
});
