"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon, SearchIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
import { Input } from "./ui/input";

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
  {
    type: NodeType.GMAIL_TRIGGER,
    label: "Gmail Trigger",
    description: "Runs the flow when a Gmail email is received.",
    icon: "/logos/gmail.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an HTTP request to any API endpoint. Great for integrating with third-party services.",
    icon: GlobeIcon,
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

const flowControlNodes: NodeTypeOption[] = [
    {
        type: NodeType.IF,
        label: "If Logic",
        description: "Route workflow execution using true and false condition branches.",
        icon: "/logos/if.svg",
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
    const [search, setSearch] = useState("");
    const q = search.toLowerCase();

    const filteredTriggerNodes = useMemo(
        () => triggerNodes.filter(n =>
            n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
        ),
        [q]
    );

    const filteredFlowControlNodes = useMemo(
        () => flowControlNodes.filter(n =>
            n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
        ),
        [q]
    );

    const filteredExecutionNodes = useMemo(
        () => executionNodes.filter(n =>
            n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
        ),
        [q]
    );

    const filteredExecutionNodeGroups = useMemo(
        () => executionNodeGroups
            .map(group => ({
                ...group,
                nodes: group.nodes.filter(n =>
                    n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
                ),
            }))
            .filter(group =>
                group.nodes.length > 0 ||
                group.label.toLowerCase().includes(q) ||
                group.description.toLowerCase().includes(q)
            ),
        [q]
    );

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
        <Sheet open={open} onOpenChange={(v) => { if (!v) setSearch(""); onOpenChange(v); }}>
            <SheetTrigger asChild>{children}</SheetTrigger>

            <SheetContent
                side="right"
                className="w-full sm:max-w-md overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle>Add a node</SheetTitle>
                    <SheetDescription>
                        Select a trigger or action node to add to your workflow.
                    </SheetDescription>
                    <div className="relative mt-1">
                        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="bg-background pl-8 shadow-none border-border"
                            placeholder="Search nodes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </SheetHeader>
                {filteredTriggerNodes.length > 0 && (
                    <div>
                        {filteredTriggerNodes.map((nodeType) => (
                            <NodeOptionRow
                                key={nodeType.type}
                                nodeType={nodeType}
                                onSelect={handleNodeSelect}
                            />
                        ))}
                    </div>
                )}
                {filteredTriggerNodes.length > 0 && filteredFlowControlNodes.length > 0 && <Separator />}
                {filteredFlowControlNodes.length > 0 && (
                    <div>
                        {filteredFlowControlNodes.map((nodeType) => (
                            <NodeOptionRow
                                key={nodeType.type}
                                nodeType={nodeType}
                                onSelect={handleNodeSelect}
                            />
                        ))}
                    </div>
                )}
                {(filteredFlowControlNodes.length > 0 || filteredTriggerNodes.length > 0) &&
                    (filteredExecutionNodes.length > 0 || filteredExecutionNodeGroups.length > 0) && (
                        <Separator />
                    )}
                {(filteredExecutionNodes.length > 0 || filteredExecutionNodeGroups.length > 0) && (
                    <div>
                        {filteredExecutionNodes.map((nodeType) => (
                            <NodeOptionRow
                                key={nodeType.type}
                                nodeType={nodeType}
                                onSelect={handleNodeSelect}
                            />
                        ))}
                        <Accordion type="multiple" className="w-full">
                            {filteredExecutionNodeGroups.map((group) => (
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
                )}
                {filteredTriggerNodes.length === 0 &&
                    filteredFlowControlNodes.length === 0 &&
                    filteredExecutionNodes.length === 0 &&
                    filteredExecutionNodeGroups.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <SearchIcon className="mb-2 size-6 opacity-40" />
                            <p className="text-sm">No nodes match &quot;{search}&quot;</p>
                        </div>
                    )}
            </SheetContent>
        </Sheet>

    );
}