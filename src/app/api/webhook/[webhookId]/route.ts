import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendWorkflowExecution } from '@/inngest/utils';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const { webhookId: webhookToken } = await params;
  
  if (!webhookToken) {
    return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
  }

  // 1. Resolve config by webhookId token first, then fallback to nodeId token.
  let config = await prisma.webhookConfig.findUnique({
    where: { webhookId: webhookToken },
    include: { node: true },
  });

  if (!config) {
    const node = await prisma.node.findUnique({
      where: { id: webhookToken },
    });

    if (node) {
      config = await prisma.webhookConfig.upsert({
        where: { nodeId: node.id },
        update: {},
        create: { nodeId: node.id },
        include: { node: true },
      });
    }
  }

  if (!config) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
  }

  // 2. Validate request (Method)
  if (config.method !== 'ANY' && request.method !== config.method) {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  // Parse payload
  let payload: any = {};
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      if (request.headers.get('content-type')?.includes('application/json')) {
        payload = await request.json();
      } else {
        payload = await request.text();
      }
    } catch (e) {
      payload = null;
    }
  }

  // 3. Validate Authentication
  if (config.authType === 'header' && config.authConfig) {
    const authConfig = config.authConfig as any;
    const headerValue = request.headers.get(authConfig.headerName || '');
    if (headerValue !== authConfig.headerValue) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (config.authType === 'basic' && config.authConfig) {
    const authConfig = config.authConfig as any;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const [user, pass] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    if (user !== authConfig.username || pass !== authConfig.password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (config.authType === 'signature' && config.authConfig) {
    const authConfig = config.authConfig as any;
    const signature = request.headers.get(authConfig.headerName || 'x-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Compute HMAC
    const hmac = crypto.createHmac('sha256', authConfig.secret || '');
    const bodyText = typeof payload === 'string' ? payload : JSON.stringify(payload);
    hmac.update(bodyText);
    const expectedSignature = hmac.digest('hex'); // Assuming hex, could be base64 based on config
    
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // 4. If node is in listening mode, save the payload
  if (config.status === 'listening') {
    await prisma.webhookConfig.update({
      where: { id: config.id },
      data: {
        status: 'idle',
        lastPayload: payload || {},
      },
    });
    
    // Standard response for test events
    return NextResponse.json({ message: 'Test event received successfully' }, { status: 200 });
  }

  // 5. Otherwise, trigger workflow via Inngest
  await sendWorkflowExecution({
    workflowId: config.node.workflowId,
    initialData: {
      webhook: {
        payload,
      },
    },
  });

  // 6. Return response
  let responseBody = config.responseBody;
  let responseData;
  try {
    responseData = responseBody ? JSON.parse(responseBody) : { success: true };
  } catch(e) {
    responseData = responseBody || { success: true };
  }

  return NextResponse.json(responseData, { status: config.responseCode });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
