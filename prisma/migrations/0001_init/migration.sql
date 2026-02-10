-- Initial Phase 0 schema migration for asdev_lap
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'OPERATOR', 'VIEWER');
CREATE TYPE "CaseType" AS ENUM ('ORDER', 'BOOKING', 'B2B_INVOICE');
CREATE TYPE "RunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "StepStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Workspace" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Membership" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  UNIQUE ("userId", "workspaceId")
);

CREATE TABLE "Workflow" (
  "id" TEXT PRIMARY KEY,
  "workspaceId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "WorkflowVersion" (
  "id" TEXT PRIMARY KEY,
  "workflowId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "dslJson" JSONB NOT NULL,
  "publishedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("workflowId", "version")
);

CREATE TABLE "Run" (
  "id" TEXT PRIMARY KEY,
  "workspaceId" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "workflowVersionId" TEXT NOT NULL,
  "status" "RunStatus" NOT NULL DEFAULT 'PENDING',
  "triggerPayload" JSONB,
  "startedAt" TIMESTAMPTZ,
  "finishedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "StepRun" (
  "id" TEXT PRIMARY KEY,
  "runId" TEXT NOT NULL,
  "stepId" TEXT NOT NULL,
  "status" "StepStatus" NOT NULL DEFAULT 'PENDING',
  "attempt" INTEGER NOT NULL DEFAULT 1,
  "inputJson" JSONB,
  "outputJson" JSONB,
  "errorMessage" TEXT,
  "startedAt" TIMESTAMPTZ,
  "finishedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "workspaceId" TEXT NOT NULL,
  "actorUserId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "payload" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Connection" (
  "id" TEXT PRIMARY KEY,
  "workspaceId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "encryptedSecret" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Case" (
  "id" TEXT PRIMARY KEY,
  "workspaceId" TEXT NOT NULL,
  "type" "CaseType" NOT NULL,
  "title" TEXT NOT NULL,
  "payload" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "PaymentIntent" (
  "id" TEXT PRIMARY KEY,
  "caseId" TEXT NOT NULL,
  "amount" NUMERIC(18,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'IRR',
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "PaymentAttempt" (
  "id" TEXT PRIMARY KEY,
  "paymentIntentId" TEXT NOT NULL,
  "providerRef" TEXT,
  "status" TEXT NOT NULL,
  "errorCode" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Message" (
  "id" TEXT PRIMARY KEY,
  "workspaceId" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "StepRun_runId_stepId_idx" ON "StepRun"("runId", "stepId");
