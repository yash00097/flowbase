<div align="center">

<p align="center">
  <img src="https://raw.githubusercontent.com/yash00097/flowbase/main/public/logos/logo.svg" width="60" height="60" />
  <span style="font-size: 32px; font-weight: bold; vertical-align: middle;">
    Flowbase
  </span>
</p>

**Build automations at the speed of thought.**

A modern, open-style workflow automation platform — visually compose, execute, and monitor business-critical automations across apps, APIs, and AI services from one workspace.

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![Inngest](https://img.shields.io/badge/Inngest-Job_Engine-7C3AED?style=flat-square)](https://inngest.com)
[![tRPC](https://img.shields.io/badge/tRPC-Type_Safe-398CCB?style=flat-square)](https://trpc.io)

[Live Demo](https://www.flow-base.dev) · 
[Documentation](#) ·
[Report Bug](https://github.com/yash00097/flowbase/issues) · 
[Request Feature](https://github.com/yash00097/flowbase/issues)

---

<img src="https://raw.githubusercontent.com/yash00097/flowbase/main/public/editorDemo.png" width="100%" />

</div>

---

## ✨ What is Flowbase?

Flowbase is an **n8n-inspired workflow automation platform** built for developers and technical teams. Connect apps, trigger on events, call APIs, run AI models, and send messages — all through a visual drag-and-drop editor backed by a type-safe, scalable architecture.

Whether you're routing leads, automating support, syncing data, or orchestrating multi-step AI pipelines, Flowbase lets you build it visually and run it reliably.

---

## 🚀 Features

### 🔁 Visual Workflow Builder
Drag-and-drop node-based editor powered by React Flow. Add nodes, connect them, set conditions — see your automation as a graph before it runs.

### ⚡ Real-Time Execution Feedback
Every node publishes live status updates (loading → success / error) via **Inngest Realtime** channels streamed directly into the editor UI.

### 🤖 Multi-Provider AI Nodes
Run prompts through **Gemini**, **OpenAI**, or **Anthropic** with stored credentials. Chain AI outputs into downstream nodes with Handlebars template variables.

### 🌐 HTTP Request Node
Make authenticated API calls to any endpoint. Full support for GET / POST / PUT / PATCH / DELETE with templated bodies and dynamic URLs.

### 🔔 Messaging Integrations
| Platform | Type |
|---|---|
| Slack | Webhook message |
| Discord | Webhook message |
| Telegram | Bot API |
| WhatsApp | Cloud API (Meta) |

### 🎯 Trigger Types
| Trigger | Description |
|---|---|
| Manual | Click-to-run from the editor |
| Webhook | Generic HTTP webhook with auth, custom response |
| Google Form | Google Apps Script integration |
| Stripe | Payment event routing |

### 🔀 Conditional Logic (If Node)
Branch workflows based on JavaScript expressions evaluated at runtime. Route execution down **true** or **false** paths independently.

### 🔑 Secure Credentials Manager
Store and encrypt API keys (AES via Cryptr) per credential type. Credentials are scoped per user and selected at the node level.

### 📊 Execution History
Full execution audit trail — view status, duration, output, and error stack traces for every workflow run.

### 💳 Subscription Tiers (via Polar)
Free tier with limits on workflows and monthly executions. Upgrade to Pro for unlimited access, enforced at the API layer.

---

## 🧱 Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│                    Next.js App Router                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  Dashboard   │  │    Editor    │  │  API Routes │  │
│  │  (tRPC UI)   │  │  (ReactFlow) │  │  (Webhooks) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
│         │                 │                  │         │
│  ┌──────▼─────────────────▼──────────────────▼──────┐  │
│  │                  tRPC Router Layer                │  │
│  │     workflows · executions · credentials ·       │  │
│  │              webhooks · auth                     │  │
│  └──────────────────────┬────────────────────────── ┘  │
│                         │                              │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │                   Prisma ORM                     │  │
│  │       Workflow · Node · Connection ·             │  │
│  │      Execution · Credential · WebhookConfig      │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                              │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │              Inngest Job Engine                  │  │
│  │   Topological Sort → Sequential Node Execution  │  │
│  │   Real-time Channels → UI Status Streaming      │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

### Execution Model

Workflows execute **asynchronously** via Inngest:
1. An event is emitted (`workflows/execute.workflow`)
2. Inngest picks it up and calls `executeWorkflow`
3. Nodes are topologically sorted and executed in dependency order
4. Each node publishes real-time status to the UI via channels
5. The execution record is updated with the final status and output

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login / Signup pages
│   ├── (dashboard)/
│   │   ├── (editor)/        # Workflow editor
│   │   └── (rest)/          # Workflows, Credentials, Executions
│   └── api/
│       ├── inngest/         # Inngest handler
│       ├── webhook/         # Generic webhook receiver
│       └── webhooks/        # Platform-specific webhooks (stripe, google-form)
│
├── features/
│   ├── executions/          # Execution nodes (AI, HTTP, messaging)
│   │   └── components/
│   │       ├── anthropic/
│   │       ├── gemini/
│   │       ├── openai/
│   │       ├── discord/
│   │       ├── slack/
│   │       ├── telegram/
│   │       ├── whatsapp/
│   │       └── http-request/
│   ├── triggers/            # Trigger nodes
│   │   └── components/
│   │       ├── manual-trigger/
│   │       ├── stripe-trigger/
│   │       ├── google-form-trigger/
│   │       └── webhook-trigger/
│   ├── flow-controls/       # Logic nodes (If)
│   ├── credentials/         # Credentials CRUD
│   ├── workflows/           # Workflow CRUD
│   └── editor/              # Editor UI + state
│
├── inngest/
│   ├── client.ts            # Inngest client w/ realtime middleware
│   ├── functions.ts         # executeWorkflow function
│   ├── channels/            # Per-node realtime channels
│   └── utils.ts             # topologicalSort + sendWorkflowExecution
│
└── trpc/                    # tRPC setup, routers, client/server
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict) |
| **UI** | Tailwind CSS + shadcn/ui |
| **Node Editor** | @xyflow/react (React Flow) |
| **API** | tRPC v11 + TanStack Query |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | better-auth (email + GitHub + Google) |
| **Job Engine** | Inngest (async execution + realtime) |
| **AI SDKs** | @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai |
| **Billing** | Polar (subscriptions + checkout) |
| **Encryption** | Cryptr (credential encryption at rest) |
| **Templates** | Handlebars (variable interpolation) |
| **Monitoring** | Sentry |
| **State** | Jotai (editor atom) + nuqs (URL params) |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Inngest account (or local dev server)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/flowbase.git
cd flowbase

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OAuth (optional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Encryption (required for credentials)
ENCRYPTION_KEY="your-32-char-secret-key"

# Billing
POLAR_ACCESS_TOKEN=""
POLAR_SUCCESS_URL="http://localhost:3000/workflows"

# Monitoring (optional)
SENTRY_DSN=""

# Ngrok (for local webhook testing)
NGROK_URL=""
```

### Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Development

```bash
# Start the development server
npm run dev

# In a separate terminal, start Inngest dev server
npx inngest-cli@latest dev

# For webhook testing with ngrok
npm run ngrok:dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Adding a New Node

Every node follows the same pattern. Here's the full anatomy:

### 1. Add to the NodeType enum

```sql
-- prisma/migrations/YYYYMMDD_your_node/migration.sql
ALTER TYPE "NodeType" ADD VALUE 'YOUR_NODE';
```

### 2. Create the Inngest channel

```ts
// src/inngest/channels/your-node.ts
import { channel, topic } from "@inngest/realtime";

export const yourNodeChannel = channel("your-node-execution")
  .addTopic(
    topic("status").type<{
      nodeId: string;
      status: "loading" | "success" | "error";
    }>(),
  );
```

### 3. Implement the executor

```ts
// src/features/executions/components/your-node/executor.ts
import type { NodeExecutor } from "@/features/executions/types";

type YourNodeData = { /* your config fields */ };

export const yourNodeExecutor: NodeExecutor<YourNodeData> = async ({
  data, nodeId, context, step, publish,
}) => {
  await publish(yourNodeChannel().status({ nodeId, status: "loading" }));

  const result = await step.run("your-node", async () => {
    // your logic here
    return { ...context, [data.variableName]: { /* output */ } };
  });

  await publish(yourNodeChannel().status({ nodeId, status: "success" }));
  return { context: result, activeHandle: "source-1" };
};
```

### 4. Build the React node component + dialog

Follow the pattern in `src/features/executions/components/discord/` as a reference.

### 5. Register everything

```ts
// src/config/node-components.ts
[NodeType.YOUR_NODE]: YourNode,

// src/features/executions/lib/executor-registry.ts
[NodeType.YOUR_NODE]: yourNodeExecutor,

// src/inngest/functions.ts — add to channels array
yourNodeChannel(),
```

---

## 🗺 Roadmap

- [x] Visual workflow editor (React Flow)
- [x] Manual, Webhook, Google Form, Stripe triggers
- [x] HTTP Request node
- [x] AI nodes (Gemini, OpenAI, Anthropic)
- [x] Messaging nodes (Slack, Discord, Telegram, WhatsApp)
- [x] If/Else conditional branching
- [x] Execution history + audit log
- [x] Secure credential manager
- [x] Real-time execution status
- [x] Free/Pro subscription tiers
- [ ] Loop / iteration nodes
- [ ] Schedule trigger (cron)
- [ ] Gmail / Google Calendar nodes
- [ ] Code node (custom JS execution)
- [ ] Workflow version history
- [ ] Team workspaces + collaboration
- [ ] Export / import workflows as JSON

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Follow the existing code style (TypeScript strict, no `any`)
4. Add nodes following the pattern documented above
5. Open a pull request

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ using Next.js, Inngest, and React Flow.

**[⬆ Back to top](#flowbase)**

</div>