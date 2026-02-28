import { baseProcedure, protectedProcedure, createTRPCRouter } from "~/../server/trpc/init";
import { z } from "zod";
import { db, schema } from "../../database/";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

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

  getMemes: baseProcedure.query(async () => {
    const memes = await db.query.memes.findMany({
      orderBy: (memes, { desc }) => [desc(memes.uploaded_at)],
    });
    return memes;
  }),

  uploadImage: protectedProcedure
    .input(
      z.object({
        image: z.string(), // base64 encoded image
      }),
    )
    .mutation(async (opts) => {
      const { image } = opts.input;
      
      // Ensure directory exists
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate filename
      const filename = `${randomUUID()}.png`;
      const filepath = path.join(uploadDir, filename);
      const publicUrl = `/uploads/${filename}`;

      // Save file
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync(filepath, base64Data, 'base64');

      let aiDescription = "Unknown";
      try {
        const completion = await openai.chat.completions.create({
          model: process.env.ANALYZE_AI_MODEL || "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "What is in this image? Make it easier to understand as humans! Like 'This image is about a cat that is pointing fingers at each others'. Keep it short.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Describe this image."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: image, // OpenAI supports base64 URLs
                  },
                },
              ],
            },
          ],
        });
        aiDescription = completion.choices[0].message.content || "Unknown";
      } catch (e) {
        console.error("OpenAI error:", e);
      }

      // Save to DB
      await db.insert(schema.memes).values({
        memeImage: publicUrl,
        aiGeneratedDescription: aiDescription,
        uploaded_by: opts.ctx.user.uuid,
      });

      return {
        success: true,
        image: publicUrl,
        ai_text_explain: aiDescription,
      };
    }),
});

export type AppRouter = typeof appRouter;
