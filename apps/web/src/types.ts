export type Role = 'OWNER' | 'ADMIN' | 'OPERATOR' | 'VIEWER';

export type ActorContext = {
  userId: string;
  workspaceId: string;
  role: Role;
};

export type WorkflowRecord = {
  id: string;
  workspaceId: string;
  name: string;
  isActive: boolean;
  versions: Array<{ version: number; dslJson: unknown; publishedAt: string | null }>;
};

export type RunRecord = {
  id: string;
  workspaceId: string;
  workflowId: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
};

export type ConnectionRecord = {
  id: string;
  workspaceId: string;
  name: string;
  provider: string;
  encryptedSecret: string;
};

export type AuditLogRecord = {
  id: string;
  workspaceId: string;
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};
