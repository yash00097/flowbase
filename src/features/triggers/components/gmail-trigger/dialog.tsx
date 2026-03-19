"use client";

import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GmailTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/gmail?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gmail Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Google Cloud Pub/Sub push
            subscription to trigger the workflow for new Gmail activity.
          </DialogDescription>
          <DialogDescription>
            ⚠️ Gmail push notifications expire every 7 days. Remember to renew the subscription before it expires to avoid missing triggers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup Instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open Google Cloud Console and select your project</li>
              <li>Enable Gmail API and Cloud Pub/Sub API</li>
              <li>Create a Pub/Sub topic and a push subscription</li>
              <li>Set the push endpoint to the webhook URL above</li>
              <li>Grant Gmail publish access to your Pub/Sub topic</li>
              <li>
                Call Gmail <code>users.watch</code> with the topic name to start
                receiving notifications
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{gmail.emailAddress}}"}
                </code>{" "}
                - Gmail account address
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{gmail.historyId}}"}
                </code>{" "}
                - Latest Gmail history ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json gmail}}"}
                </code>{" "}
                - Full Gmail payload as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
