import { type NextRequest, NextResponse } from "next/server";
import { sendWorkflowExecution } from "@/inngest/utils";

type GmailPubSubPayload = {
  emailAddress?: string;
  historyId?: string;
  [key: string]: unknown;
};

type GmailPubSubRequest = {
  message?: {
    data?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const workflowId = url.searchParams.get("workflowId");

  if (!workflowId) {
    return NextResponse.json(
      { success: false, error: "Missing required query parameter: workflowId" },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json()) as GmailPubSubRequest;
    const encodedMessage = body.message?.data;

    if (!encodedMessage) {
      return NextResponse.json(
        { success: false, error: "Missing Pub/Sub message data" },
        { status: 400 },
      );
    }

    const decodedData = JSON.parse(
      Buffer.from(encodedMessage, "base64").toString(),
    ) as GmailPubSubPayload;

    void sendWorkflowExecution({
      workflowId,
      initialData: {
        gmail: {
          emailAddress: decodedData.emailAddress ?? "",
          historyId: decodedData.historyId ?? "",
          raw: decodedData,
        },
      },
    }).catch((error: unknown) => {
      console.error("Failed to queue Gmail workflow execution:", error);
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Gmail webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Gmail Pub/Sub message" },
      { status: 500 },
    );
  }
}
