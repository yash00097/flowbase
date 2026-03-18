"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyIcon, Loader2, PlayIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
}

export const WebhookTriggerDialog = ({ open, onOpenChange, nodeId }: Props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const {
        data: config,
        isLoading,
        error: configError,
    } = useQuery({
        ...trpc.webhooks.getWebhookConfig.queryOptions({ nodeId }),
        enabled: open,
    });

    const updateConfig = useMutation(trpc.webhooks.updateWebhookConfig.mutationOptions({
        onSuccess: () => {
            toast.success("Webhook configuration saved!");
            queryClient.invalidateQueries(trpc.webhooks.getWebhookConfig.queryOptions({ nodeId }));
        },
        onError: (error) => {
            if (error.message.includes("Node not found")) {
                toast.error("Save the workflow first, then configure this webhook.");
                return;
            }
            toast.error("Failed to save webhook configuration");
        },
    }));

    const listenEvent = useMutation(trpc.webhooks.listenForTestEvent.mutationOptions({
        onSuccess: () => {
            toast.success("Listening for test event...");
            queryClient.invalidateQueries(trpc.webhooks.getWebhookConfig.queryOptions({ nodeId }));
        },
        onError: (error) => {
            if (error.message.includes("Node not found")) {
                toast.error("Save the workflow first to enable webhook testing.");
                return;
            }
            toast.error("Failed to start test listener");
        },
    }));

    const { data: testPayload } = useQuery({
        ...trpc.webhooks.pollTestEvent.queryOptions({ nodeId }),
        enabled: open && Boolean(config?.webhookId),
        refetchInterval: config && config.status === 'listening' ? 2000 : false,
    });

    // Form state
    const [method, setMethod] = useState("POST");
    const [authType, setAuthType] = useState("none");
    const [authConfig, setAuthConfig] = useState<any>({});
    const [responseCode, setResponseCode] = useState(200);
    const [responseBody, setResponseBody] = useState('{"success": true}');

    useEffect(() => {
        if (config) {
            setMethod(config.method);
            setAuthType(config.authType);
            setAuthConfig(config.authConfig || {});
            setResponseCode(config.responseCode);
            setResponseBody(config.responseBody || '{"success": true}');
        }
    }, [config]);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookToken = config?.webhookId ?? nodeId;
    const webhookUrl = `${baseUrl}/api/webhook/${webhookToken}`;
    const canUseWebhookUrl = Boolean(webhookToken);
    const hasPersistedWebhookConfig = Boolean(config?.webhookId);
    const saveFirstMessage = configError?.message.includes("Node not found")
        ? "URL is ready. Save the workflow to activate webhook configuration and testing."
        : "Webhook URL will appear after configuration is ready.";

    const copyToClipboard = async () => {
        if (!canUseWebhookUrl) {
            toast.error("Webhook URL is not ready yet. Save the workflow first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");
        } catch {
            toast.error("Failed to copy URL");
        }
    };

    const handleSave = () => {
        updateConfig.mutate({
            nodeId,
            data: {
                method,
                authType,
                authConfig,
                responseCode,
                responseBody
            }
        });
    };

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Webhook Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Configure how this trigger handles incoming HTTP requests.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : (
                <div className="space-y-6 py-4">
                    {/* URL */}
                    <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input
                                value={webhookUrl}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={copyToClipboard}
                                disabled={!canUseWebhookUrl}
                                title={canUseWebhookUrl ? "Copy webhook URL" : "Save workflow first"}
                            >
                                <CopyIcon className="size-4"/>
                            </Button>
                        </div>
                        {!hasPersistedWebhookConfig && (
                            <p className="text-xs text-muted-foreground">{saveFirstMessage}</p>
                        )}
                    </div>

                    {/* Method & Auth */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>HTTP Method</Label>
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ANY">ANY</SelectItem>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Authentication</Label>
                            <Select value={authType} onValueChange={setAuthType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="header">Custom Header</SelectItem>
                                    <SelectItem value="basic">Basic Auth</SelectItem>
                                    <SelectItem value="signature">HMAC Signature</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Auth Config */}
                    {authType === 'header' && (
                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                            <div className="space-y-2">
                                <Label>Header Name</Label>
                                <Input 
                                    value={authConfig.headerName || ''} 
                                    onChange={e => setAuthConfig({...authConfig, headerName: e.target.value})} 
                                    placeholder="x-api-key"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Expected Value</Label>
                                <Input 
                                    type="password"
                                    value={authConfig.headerValue || ''} 
                                    onChange={e => setAuthConfig({...authConfig, headerValue: e.target.value})} 
                                    placeholder="..."
                                />
                            </div>
                        </div>
                    )}

                    {authType === 'basic' && (
                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                            <div className="space-y-2">
                                <Label>Username</Label>
                                <Input 
                                    value={authConfig.username || ''} 
                                    onChange={e => setAuthConfig({...authConfig, username: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input 
                                    type="password"
                                    value={authConfig.password || ''} 
                                    onChange={e => setAuthConfig({...authConfig, password: e.target.value})} 
                                />
                            </div>
                        </div>
                    )}

                    {authType === 'signature' && (
                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                            <div className="space-y-2">
                                <Label>Header Name</Label>
                                <Input 
                                    value={authConfig.headerName || ''} 
                                    onChange={e => setAuthConfig({...authConfig, headerName: e.target.value})} 
                                    placeholder="x-signature"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>HMAC Secret</Label>
                                <Input 
                                    type="password"
                                    value={authConfig.secret || ''} 
                                    onChange={e => setAuthConfig({...authConfig, secret: e.target.value})} 
                                    placeholder="..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Response settings */}
                    <div className="space-y-4">
                        <Label>Response Configuration</Label>
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Status Code</Label>
                                <Input 
                                    type="number" 
                                    value={responseCode} 
                                    onChange={e => setResponseCode(parseInt(e.target.value))} 
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Response Body (JSON)</Label>
                                <Input 
                                    value={responseBody} 
                                    onChange={e => setResponseBody(e.target.value)} 
                                    className="font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Test Event */}
                    <div className="rounded-lg border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">Test Webhook</h4>
                                <p className="text-sm text-muted-foreground">Catch an incoming request to test your setup.</p>
                            </div>
                            <Button 
                                variant={config?.status === 'listening' ? 'secondary' : 'default'}
                                onClick={() => listenEvent.mutate({ nodeId })}
                                disabled={!hasPersistedWebhookConfig || listenEvent.isPending || config?.status === 'listening'}
                            >
                                {config?.status === 'listening' ? (
                                    <><Loader2 className="mr-2 size-4 animate-spin" /> Listening...</>
                                ) : (
                                    <><PlayIcon className="mr-2 size-4" /> Listen for Test Event</>
                                )}
                            </Button>
                        </div>
                        
                        {(config?.lastPayload || testPayload) && config?.status !== 'listening' && (
                            <div className="mt-2 max-h-75 overflow-auto rounded bg-black p-4">
                                <pre className="text-xs text-green-400">
                                    {JSON.stringify(config?.lastPayload || testPayload, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={!hasPersistedWebhookConfig || updateConfig.isPending}>
                            {updateConfig.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <SaveIcon className="mr-2 size-4" />}
                            Save Configuration
                        </Button>
                    </div>
                </div>
                )}
            </DialogContent>
        </Dialog>
    );
}