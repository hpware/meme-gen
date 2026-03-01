import { initTRPC, TRPCError } from '@trpc/server';
import type { H3Event } from 'h3';

export const createTRPCContext = async (event: H3Event) => {
  return { 
    user: event.context.user,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});
