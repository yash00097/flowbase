import prisma from '@/lib/db';
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({
  testAI:premiumProcedure.mutation(async()=>{
    await inngest.send({
      name: "execute/ai",
    })
    return { success: true , message: "Workflow queued!"};
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async()=> {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "yashwanth.v23@iiits.in",
      },
    })
    return { success: true , message: "Workflow queued!"};
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;