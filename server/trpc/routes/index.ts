import { baseProcedure, createTRPCRouter } from "~/../server/trpc/init";
import { z } from "zod";
import { db, schema } from "../../database/";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "https://yhw.tw/meme-gen",
    "X-Title": "MemeGen",
  },
});

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
  getNewImages: baseProcedure.query(() => {
    return {
      image: "https://copyparty.yhw.tw/pb_web/catpizzaitalian.png",
      ai_text_explain: "This is a cat holding a pizza",
    };
  }),
  uploadImage: baseProcedure
    /**    .input(
  z.object({
    image: z.string(), // base64 encoded image or file path
    filename: z.string().optional(),
    mimeType: z.string().optional(),
  }),
) */
    .query(async (opts) => {
      //const { image, filename, mimeType } = opts.input;
      // const savedPath = await saveImage(image, filename);
      const completion = await openai.chat.completions.create({
        model: process.env.ANALYZE_AI_MODEL || "openai/gpt-4o", // default model
        messages: [
          {
            role: "system",
            content:
              "What is in this image? Make it easier to understand as humans! Like 'This image is about a cat that is pointing fingers at each others'.",
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: "https://copyparty.yhw.tw/pb_web/catpizzaitalian.png",
                },
              },
            ],
          },
        ],
      });
      const status = completion;
      return {
        success: true,
        message: "Image uploaded successfully",
        content: status,
        // imageUrl: savedPath,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
