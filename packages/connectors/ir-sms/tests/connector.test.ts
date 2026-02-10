import { describe, expect, it } from 'vitest';
import { runAction } from '../src/index.js';

describe('sms connector', () => {
  it('returns message id', async () => {
    const result = await runAction({ idempotencyKey: 'r1:s2' }, { to: '09', message: 'hi' });
    expect(result.output.messageId).toContain('r1:s2');
  });
});
