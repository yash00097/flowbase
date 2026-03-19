"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseFlowControlNode } from "../base-flow-control-node";
import { IfDialog, IfFormValues } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchIfRealtimeToken } from "./actions";
import { IF_CHANNEL_NAME } from "@/inngest/channels/if";

type IfNodeData = {
    condition?: string;
};

type IfNodeType = Node<IfNodeData>;

export const IfNode = memo((props: NodeProps<IfNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: IF_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchIfRealtimeToken,
  });

  const handleOpenSettings = () => {
    setDialogOpen(true);
  }

  const handleSubmit = (values: IfFormValues) => {
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
  const description = nodeData?.condition
    ? `Condition: ${nodeData.condition.slice(0, 40)}${nodeData.condition.length > 40 ? "..." : ""}`
    : "Not configured";
  
  return (
    <>
        <IfDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseFlowControlNode
            {...props}
            id={props.id}
            icon="/logos/if.svg"
            name="If Logic"
            status={NodeStatus}
            description={description}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
    </>
  );
});

IfNode.displayName = "IfNode";
