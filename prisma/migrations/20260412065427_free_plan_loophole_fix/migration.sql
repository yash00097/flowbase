-- CreateTable
CREATE TABLE "ExecutionUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExecutionUsage_userId_idx" ON "ExecutionUsage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionUsage_userId_yearMonth_key" ON "ExecutionUsage"("userId", "yearMonth");

-- AddForeignKey
ALTER TABLE "ExecutionUsage" ADD CONSTRAINT "ExecutionUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
