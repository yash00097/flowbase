-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('idle', 'listening', 'active');

-- CreateTable
CREATE TABLE "WebhookConfig" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'POST',
    "authType" TEXT NOT NULL DEFAULT 'none',
    "authConfig" JSONB,
    "responseMode" TEXT NOT NULL DEFAULT 'immediately',
    "responseCode" INTEGER NOT NULL DEFAULT 200,
    "responseBody" TEXT,
    "allowedOrigins" TEXT NOT NULL DEFAULT '*',
    "status" "WebhookStatus" NOT NULL DEFAULT 'idle',
    "lastPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebhookConfig_nodeId_key" ON "WebhookConfig"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookConfig_webhookId_key" ON "WebhookConfig"("webhookId");

-- AddForeignKey
ALTER TABLE "WebhookConfig" ADD CONSTRAINT "WebhookConfig_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
