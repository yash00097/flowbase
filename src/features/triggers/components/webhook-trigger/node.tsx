import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { WebhookTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";
import { WEBHOOK_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/webhook-trigger";

export const webhookTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

    const NodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: WEBHOOK_TRIGGER_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchGoogleFormTriggerRealtimeToken,
    });
  
  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <WebhookTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} nodeId={props.id}/>
      <BaseTriggerNode
        {...props}
        icon="/logos/webhook.svg"
        name="Webhook Trigger"
        description="When webhook is received"
        status={NodeStatus} 
        onSettings={handleOpenSettings} 
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
