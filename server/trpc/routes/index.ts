import { baseProcedure, createTRPCRouter } from "~/../server/trpc/init";
import { z } from "zod";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  getNewImages: baseProcedure
    .query(() => {
      return {
        image: "https://copyparty.yhw.tw/pb_web/catpizzaitalian.png",
        ai_text_explain: "This is a cat holding a pizza"
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
