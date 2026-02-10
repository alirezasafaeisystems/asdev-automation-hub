import { AuditLogRecord, ConnectionRecord, RunRecord, WorkflowRecord } from '../types.js';

export class InMemoryStore {
  workflows = new Map<string, WorkflowRecord>();
  runs = new Map<string, RunRecord>();
  connections = new Map<string, ConnectionRecord>();
  audits: AuditLogRecord[] = [];
}
