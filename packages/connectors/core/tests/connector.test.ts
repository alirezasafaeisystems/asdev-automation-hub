import { describe, expect, it } from 'vitest';
import { runAction } from '../src/index.js';

describe('core connector', () => {
  it('returns deterministic output', async () => {
    const result = await runAction({ idempotencyKey: 'r1:s1' }, { type: 'ORDER' });
    expect(result.output.id).toContain('r1:s1');
  });
});
