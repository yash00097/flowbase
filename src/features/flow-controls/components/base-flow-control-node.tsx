"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseFlowControlNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseFlowControlNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    status = "initial",
    onSettings,
    onDoubleClick,
  }: BaseFlowControlNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
      setEdges((edges) =>
        edges.filter((edge) => edge.source !== id && edge.target !== id),
      );
    };

    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode onDoubleClick={onDoubleClick} status={status}>
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={name} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}

              {/* Single input — left centre (identical to BaseExecutionNode) */}
              <BaseHandle id="target-1" type="target" position={Position.Left} />

              {/*
               * True output — upper-right, green dot.
               * style.top overrides ReactFlow's default centre so the two
               * handles sit at 30% / 70% of the node height.
               */}
              <BaseHandle
                id="source-true"
                type="source"
                position={Position.Right}
                style={{ top: "30%" }}
                className="border-emerald-500! bg-emerald-100!"
              />

              {/* False output — lower-right, red dot */}
              <BaseHandle
                id="source-false"
                type="source"
                position={Position.Right}
                style={{ top: "70%" }}
                className="border-red-400! bg-red-100!"
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);

BaseFlowControlNode.displayName = "BaseFlowControlNode";