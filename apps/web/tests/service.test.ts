import { describe, expect, it } from 'vitest';
import { ControlPlaneService } from '../src/service.js';
import { InMemoryStore } from '../src/repositories/inMemoryStore.js';
import { SecretCipher } from '../src/security/secretCipher.js';

const adminActor = { userId: 'u1', workspaceId: 'w1', role: 'ADMIN' as const };
const viewerActor = { userId: 'u2', workspaceId: 'w1', role: 'VIEWER' as const };

describe('control plane service', () => {
  it('creates workflow, publishes version, and records audit', () => {
    const service = new ControlPlaneService(new InMemoryStore(), new SecretCipher('phase0-key'));
    const workflow = service.createWorkflow(adminActor, 'Order flow');
    const updated = service.publishWorkflowVersion(adminActor, workflow.id, {
      name: 'Order flow',
      trigger: { type: 'core.form.submit', config: {} },
      steps: [{ id: 's1', connector: 'core.case', operation: 'create', input: {} }],
    });

    expect(updated.versions).toHaveLength(1);
    expect(service.listAuditLogs(adminActor).length).toBeGreaterThan(0);
  });

  it('encrypts and masks connection secrets', () => {
    const service = new ControlPlaneService(new InMemoryStore(), new SecretCipher('phase0-key'));
    service.createConnection(adminActor, {
      name: 'payment',
      provider: 'ir.payment',
      secret: 'super-secret-token',
    });
    const connections = service.listConnections(adminActor);
    expect(connections[0]?.maskedSecret).toContain('***');
  });

  it('enforces RBAC for sensitive actions', () => {
    const service = new ControlPlaneService(new InMemoryStore(), new SecretCipher('phase0-key'));
    expect(() =>
      service.createConnection(viewerActor, {
        name: 'sms',
        provider: 'ir.sms',
        secret: 'x',
      }),
    ).toThrow(/RBAC_DENIED/);
  });
});
