import { parseWorkflowDsl } from '@asdev/sdk';
import { randomUUID } from 'node:crypto';
import { InMemoryStore } from './repositories/inMemoryStore.js';
import { SecretCipher } from './security/secretCipher.js';
import { ActorContext, ConnectionRecord, RunRecord, WorkflowRecord } from './types.js';

function assertRole(actor: ActorContext, allowed: ActorContext['role'][]): void {
  if (!allowed.includes(actor.role)) {
    throw new Error(`RBAC_DENIED:${actor.role}`);
  }
}

export class ControlPlaneService {
  constructor(private readonly store: InMemoryStore, private readonly cipher: SecretCipher) {}

  createWorkflow(actor: ActorContext, name: string): WorkflowRecord {
    assertRole(actor, ['OWNER', 'ADMIN', 'OPERATOR']);
    const workflow: WorkflowRecord = {
      id: randomUUID(),
      workspaceId: actor.workspaceId,
      name,
      isActive: false,
      versions: [],
    };
    this.store.workflows.set(workflow.id, workflow);
    this.audit(actor, 'workflow.create', 'Workflow', workflow.id);
    return workflow;
  }

  publishWorkflowVersion(actor: ActorContext, workflowId: string, dslJson: unknown): WorkflowRecord {
    assertRole(actor, ['OWNER', 'ADMIN', 'OPERATOR']);
    const workflow = this.mustWorkflow(workflowId, actor.workspaceId);
    parseWorkflowDsl(dslJson);
    const nextVersion = workflow.versions.length + 1;
    workflow.versions.push({ version: nextVersion, dslJson, publishedAt: new Date().toISOString() });
    workflow.isActive = true;
    this.audit(actor, 'workflow.publish', 'WorkflowVersion', `${workflow.id}@${nextVersion}`);
    return workflow;
  }

  listRuns(actor: ActorContext): RunRecord[] {
    assertRole(actor, ['OWNER', 'ADMIN', 'OPERATOR', 'VIEWER']);
    return Array.from(this.store.runs.values()).filter((run) => run.workspaceId === actor.workspaceId);
  }

  addRun(run: RunRecord): void {
    this.store.runs.set(run.id, run);
  }

  createConnection(actor: ActorContext, input: { name: string; provider: string; secret: string }): ConnectionRecord {
    assertRole(actor, ['OWNER', 'ADMIN']);
    const encryptedSecret = this.cipher.encrypt(input.secret);
    const connection: ConnectionRecord = {
      id: randomUUID(),
      workspaceId: actor.workspaceId,
      name: input.name,
      provider: input.provider,
      encryptedSecret,
    };
    this.store.connections.set(connection.id, connection);
    this.audit(actor, 'connection.create', 'Connection', connection.id);
    return connection;
  }

  listConnections(actor: ActorContext): Array<ConnectionRecord & { maskedSecret: string }> {
    assertRole(actor, ['OWNER', 'ADMIN', 'OPERATOR', 'VIEWER']);
    return Array.from(this.store.connections.values())
      .filter((conn) => conn.workspaceId === actor.workspaceId)
      .map((conn) => {
        const plain = this.cipher.decrypt(conn.encryptedSecret);
        return { ...conn, maskedSecret: SecretCipher.mask(plain) };
      });
  }

  listAuditLogs(actor: ActorContext) {
    assertRole(actor, ['OWNER', 'ADMIN']);
    return this.store.audits.filter((entry) => entry.workspaceId === actor.workspaceId);
  }

  private audit(actor: ActorContext, action: string, entityType: string, entityId: string): void {
    this.store.audits.push({
      id: randomUUID(),
      workspaceId: actor.workspaceId,
      actorUserId: actor.userId,
      action,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    });
  }

  private mustWorkflow(id: string, workspaceId: string): WorkflowRecord {
    const workflow = this.store.workflows.get(id);
    if (!workflow || workflow.workspaceId !== workspaceId) {
      throw new Error('WORKFLOW_NOT_FOUND');
    }
    return workflow;
  }
}
