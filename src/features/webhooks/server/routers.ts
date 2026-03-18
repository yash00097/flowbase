import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export const webhooksRouter = createTRPCRouter({
  getWebhookConfig: protectedProcedure
    .input(z.object({ nodeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const node = await prisma.node.findFirst({
        where: { id: input.nodeId, workflow: { userId: ctx.auth.user.id } },
      });
      if (!node) throw new Error('Node not found');

      let config = await prisma.webhookConfig.findUnique({
        where: { nodeId: input.nodeId },
      });

      if (!config) {
        config = await prisma.webhookConfig.create({
          data: { nodeId: input.nodeId },
        });
      }

      return config;
    }),

  updateWebhookConfig: protectedProcedure
    .input(z.object({
      nodeId: z.string(),
      data: z.any(), // Since there are many fields like method, authType etc.
    }))
    .mutation(async ({ ctx, input }) => {
      const node = await prisma.node.findFirst({
        where: { id: input.nodeId, workflow: { userId: ctx.auth.user.id } },
      });
      if (!node) throw new Error('Node not found');

      return prisma.webhookConfig.update({
        where: { nodeId: input.nodeId },
        data: input.data,
      });
    }),

  listenForTestEvent: protectedProcedure
    .input(z.object({ nodeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const node = await prisma.node.findFirst({
        where: { id: input.nodeId, workflow: { userId: ctx.auth.user.id } },
      });
      if (!node) throw new Error('Node not found');

      return prisma.webhookConfig.update({
        where: { nodeId: input.nodeId },
        data: { status: 'listening' },
      });
    }),

  pollTestEvent: protectedProcedure
    .input(z.object({ nodeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const node = await prisma.node.findFirst({
        where: { id: input.nodeId, workflow: { userId: ctx.auth.user.id } },
      });
      if (!node) throw new Error('Node not found');

      const config = await prisma.webhookConfig.findUnique({
        where: { nodeId: input.nodeId },
      });

      if (!config) return null;

      if (config.status === 'idle' && config.lastPayload) {
        return config.lastPayload;
      }

      return null;
    }),
});
