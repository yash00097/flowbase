import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openaiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { whatsappChannel } from "./channels/whatsapp";
import { slackChannel } from "./channels/slack";
import { telegramChannel } from "./channels/telegram";
import { webhookTriggerChannel } from "./channels/webhook-trigger";
import { ifChannel } from "./channels/if";


export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
    onFailure: async ({ event, step }) => {
      return prisma.execution.update({
        where: { inngestEventId: event.data.event.id },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack,
        },
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openaiChannel(),
      anthropicChannel(),
      discordChannel(),
      whatsappChannel(),
      slackChannel(),
      telegramChannel(),
      webhookTriggerChannel(),
      ifChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: { workflowId, inngestEventId },
      });
    });

    const { sortedNodes, connections } = await step.run(
      "prepare-workflow",
      async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: { id: workflowId },
          include: { nodes: true, connections: true },
        });
        return {
          sortedNodes: topologicalSort(workflow.nodes, workflow.connections),
          connections: workflow.connections,
        };
      },
    );

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });
      return workflow.userId;
    });

    let context = event.data.initialData || {};

    // Tracks which connection IDs have been "unlocked" by a previous executor.
    // A node only runs if at least one of its incoming edges is in this set
    // (or if it has no incoming edges at all — i.e. it is the root trigger).
    const activeEdges = new Set<string>();

    for (const node of sortedNodes) {
      const incomingEdges = connections.filter((c) => c.toNodeId === node.id);

      // Root nodes (no incoming connections) always execute.
      // Every other node needs at least one active incoming edge.
      const shouldExecute =
        incomingEdges.length === 0 ||
        incomingEdges.some((edge) => activeEdges.has(edge.id));

      if (!shouldExecute) continue;

      const executor = getExecutor(node.type as NodeType);
      const result = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      });

      context = result.context;

      // Determine which outgoing edges to activate.
      //
      // Three cases:
      //   1. activeHandle is undefined  → no branching; activate ALL outgoing
      //      edges so the workflow never silently stalls.
      //   2. activeHandle is "source-1" → standard execution node. Also match
      //      "main" because older connections were saved before explicit handle
      //      IDs existed (fromOutput defaults to "main" in the DB schema).
      //   3. activeHandle is "source-true" / "source-false" → IF node; match
      //      exactly so only the chosen branch runs.
      const { activeHandle } = result;

      const outgoingEdges = connections.filter((c) => {
        if (c.fromNodeId !== node.id) return false;

        // Case 1 — no handle specified, activate every outgoing edge.
        if (!activeHandle) return true;

        // Case 2 — treat the legacy "main" value as equivalent to "source-1".
        if (activeHandle === "source-1" && c.fromOutput === "main") return true;

        // Cases 2 & 3 — exact match on the handle that fired.
        return c.fromOutput === activeHandle;
      });

      for (const edge of outgoingEdges) {
        activeEdges.add(edge.id);
      }
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return { workflowId, result: context };
  },
);