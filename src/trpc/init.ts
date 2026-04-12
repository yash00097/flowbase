import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import prisma from '@/lib/db';
import { FREE_TIER_LIMITS } from '@/config/constants';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(
  async({ ctx, next }) => {
    const session = await auth.api.getSession({
      headers : await headers(),
    });
    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource.',
      });
    }

  return next({ ctx: {...ctx, auth: session} });
})
export const premiumProcedure = protectedProcedure.use(
  async({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    if(
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ){
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You must have an active subscription to access this resource.',
      });
    }

    return next({ ctx:{...ctx, customer} });
  }
);

// Helper to check if user has an active Polar subscription
async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const customer = await polarClient.customers.getStateExternal({
      externalId: userId,
    });
    return !!(customer.activeSubscriptions && customer.activeSubscriptions.length > 0);
  } catch {
    return false;
  }
}

// Procedure for workflow creation — free users limited to 3 workflows
export const workflowCreateProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const isPro = await hasActiveSubscription(ctx.auth.user.id);

    if (!isPro) {
      const workflowCount = await prisma.workflow.count({
        where: { userId: ctx.auth.user.id },
      });

      if (workflowCount >= FREE_TIER_LIMITS.workflows) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `Can't create more than ${FREE_TIER_LIMITS.workflows} workflows on the free plan. Please upgrade to Pro for unlimited workflows.`,
        });
      }
    }

    return next({ ctx });
  }
);

// Procedure for workflow execution — free users limited by monthly usage meter.
// Uses a dedicated ExecutionUsage counter (not a count of Execution rows) so the
// limit cannot be bypassed by deleting workflows (which cascade-deletes executions).
export const executeWorkflowProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const isPro = await hasActiveSubscription(ctx.auth.user.id);

    if (!isPro) {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // Atomic increment-then-check. Upsert guarantees one row per (userId, yearMonth);
      // `increment` is a DB-level atomic op, so concurrent dispatches cannot both pass
      // the limit by racing on a read-then-write.
      const usage = await prisma.executionUsage.upsert({
        where: { userId_yearMonth: { userId: ctx.auth.user.id, yearMonth } },
        create: { userId: ctx.auth.user.id, yearMonth, count: 1 },
        update: { count: { increment: 1 } },
      });

      if (usage.count > FREE_TIER_LIMITS.executionsPerMonth) {
        const resetDate = startOfNextMonth.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `Monthly execution limit reached (${FREE_TIER_LIMITS.executionsPerMonth}/${FREE_TIER_LIMITS.executionsPerMonth}). Resets on ${resetDate}. Please upgrade to Pro for unlimited executions.`,
        });
      }
    }

    return next({ ctx });
  }
);