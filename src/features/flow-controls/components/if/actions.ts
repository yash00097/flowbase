"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { ifChannel } from "@/inngest/channels/if";

export type IfToken = Realtime.Token<typeof ifChannel, ["status"]>;

export async function fetchIfRealtimeToken(): Promise<IfToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: ifChannel(),
    topics: ["status"],
  });

  return token;
}