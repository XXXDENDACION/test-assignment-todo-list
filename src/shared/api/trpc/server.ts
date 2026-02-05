import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';
import { authOptions } from '@/shared/api/auth/auth-options';
import { createHasuraUserClient } from '@/shared/api/hasura/client';

export async function createContext() {
  const session = await getServerSession(authOptions);

  return {
    session,
    hasura: session?.user?.id ? createHasuraUserClient(session.user.id) : null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }

  if (!ctx.hasura) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to initialize database client',
    });
  }

  return next({
    ctx: {
      session: ctx.session,
      hasura: ctx.hasura,
    },
  });
});
