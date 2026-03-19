"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { 
    Sheet,
    SheetContent,
    SheetHeader,
    SheetDescription,
    SheetTitle,
    SheetTrigger } from "./ui/sheet";
import { NodeType } from "@/generated/prisma";
import { Separator } from "./ui/separator";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

type NodeTypeGroup = {
    value: string;
    label: string;
    description: string;
    nodes: NodeTypeOption[];
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description: "Runs the flow when you click the trigger button. Good for getting started quickly.",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a Google Form is submitted.",
    icon: "/logos/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Runs the flow when a Stripe event is captured.",
    icon: "/logos/stripe.svg",
  },
  {
    type: NodeType.WEBHOOK_TRIGGER,
    label: "Webhook Trigger",
    description: "Runs the flow when a webhook is received.",
    icon: "/logos/webhook.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an HTTP request to any API endpoint. Great for integrating with third-party services.",
    icon: GlobeIcon,
  },
    {
        type: NodeType.IF,
        label: "If Logic",
        description: "Route workflow execution using true and false condition branches.",
        icon: "/logos/if.svg",
    },
];

const executionNodeGroups: NodeTypeGroup[] = [
    {
        value: "ai-nodes",
        label: "AI Nodes",
        description: "Generate text and responses with the available AI providers.",
        nodes: [
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Uses Google's Gemini API to generate text.",
    icon: "/logos/gemini.svg",
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Uses OpenAI's API to generate text.",
    icon: "/logos/openai.svg",
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Uses Anthropic's API to generate text.",
    icon: "/logos/anthropic.svg",
  },
        ],
    },
    {
        value: "messaging-nodes",
        label: "Messaging Nodes",
        description: "Send messages to chat platforms and messaging services.",
        nodes: [
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send a message to a Discord.",
    icon: "/logos/discord.svg",
  },
  {
    type: NodeType.WHATSAPP,
    label: "Whatsapp",
    description: "Send a message to a Whatsapp.",
    icon: "/logos/whatsapp.svg",
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Send a message to a Slack.",
    icon: "/logos/slack.svg",
  },
  {
    type: NodeType.TELEGRAM,
    label: "Telegram",
    description: "Send a message to a Telegram.",
    icon: "/logos/telegram.svg",
  },
    ],
  },
];

function NodeOptionRow({
    nodeType,
    onSelect,
    nested = false,
}: {
    nodeType: NodeTypeOption;
    onSelect: (selection: NodeTypeOption) => void;
    nested?: boolean;
}) {
    const Icon = nodeType.icon;

    return (
        <button
            type="button"
            className={[
                "w-full cursor-pointer rounded-none border-l-2 border-transparent px-4 py-5 text-left transition-colors hover:border-l-primary hover:bg-muted/40",
                nested ? "pl-6" : "",
            ].join(" ")}
            onClick={() => onSelect(nodeType)}
        >
            <div className="flex w-full items-center gap-6 overflow-hidden">
                {typeof Icon === "string" ? (
                    <img
                        src={Icon}
                        alt={nodeType.label}
                        className="size-5 rounded-sm object-contain"
                    />
                ) : (
                    <Icon className="size-5" />
                )}
                <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{nodeType.label}</span>
                    <span className="text-xs text-muted-foreground">
                        {nodeType.description}
                    </span>
                </div>
            </div>
        </button>
    );
}

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({ open, onOpenChange, children }: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        // Check if trying to add a manual trigger when one already exists
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER,
            );

            if (hasManualTrigger) {
                toast.error("Only one manual trigger is allowed per workflow");
                return;
            }

        }
        setNodes((nodes)=>{
            const hasInitialNode = nodes.some(node => node.type === NodeType.INITIAL);

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const flowPosition = screenToFlowPosition({ 
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200,
            });

            const newNode = {
                id: createId(),
                data:{},
                position: flowPosition,
                type: selection.type,
            };

            if(hasInitialNode){
                return [newNode];
            }
            
            return [...nodes, newNode];
        });

        onOpenChange(false);
    }, [
        getNodes,
        setNodes,
        screenToFlowPosition,
        onOpenChange,
    ]);


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>

            <SheetContent
                side="right"
                className="w-full sm:max-w-md overflow-y-auto"
            >
                <SheetHeader>
                <SheetTitle>
                    What triggers this workflow?
                </SheetTitle>

                <SheetDescription>
                    A trigger is a step that starts your workflow.
                </SheetDescription>
                </SheetHeader>
                <div >
                    {triggerNodes.map((nodeType) => (
                        <NodeOptionRow
                            key={nodeType.type}
                            nodeType={nodeType}
                            onSelect={handleNodeSelect}
                        />
                    ))}
                </div>
                <Separator/>
                <div>
                    {executionNodes.map((nodeType) => (
                        <NodeOptionRow
                            key={nodeType.type}
                            nodeType={nodeType}
                            onSelect={handleNodeSelect}
                        />
                    ))}
                    <Accordion type="multiple" className="w-full">
                        {executionNodeGroups.map((group) => (
                            <AccordionItem
                                key={group.value}
                                value={group.value}
                                className="border-b-0"
                            >
                                <AccordionTrigger className="border-l-2 border-transparent px-4 py-5 hover:border-l-primary hover:bg-muted/40 hover:no-underline">
                                    <div className="flex flex-col items-start text-left">
                                        <span className="text-sm font-medium">
                                            {group.label}
                                        </span>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            {group.description}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0">
                                    <div className="ml-6 border-l border-border/60">
                                        {group.nodes.map((nodeType) => (
                                            <NodeOptionRow
                                                key={nodeType.type}
                                                nodeType={nodeType}
                                                onSelect={handleNodeSelect}
                                                nested
                                            />
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </SheetContent>
        </Sheet>

    );
}