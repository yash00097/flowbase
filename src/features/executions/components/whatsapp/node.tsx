"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { WhatsappDialog, WhatsappFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchWhatsappRealtimeToken } from "./actions";
import { WHATSAPP_CHANNEL_NAME } from "@/inngest/channels/whatsapp";

type WhatsappNodeData = {
    variableName?: string;
    phoneNumberId?: string;
    accessToken?: string;
    recipientPhone?: string;
    content?: string;
};

type WhatsappNodeType = Node<WhatsappNodeData>;

export const WhatsappNode = memo((props: NodeProps<WhatsappNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: WHATSAPP_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchWhatsappRealtimeToken,
  });
  const handleOpenSettings = () => {
    setDialogOpen(true);
  }

  const handleSubmit = (values: WhatsappFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }

        return node;
      })
    );
  }

  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  
  return (
    <>
        <WhatsappDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            id = {props.id}
            icon="/logos/whatsapp.svg"
            name="Whatsapp"
            status={NodeStatus}
            description={description}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
    </>
  );
});

WhatsappNode.displayName = "WhatsappNode";
