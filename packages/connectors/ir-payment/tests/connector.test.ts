import { describe, expect, it } from 'vitest';
import { runAction } from '../src/index.js';

describe('payment connector', () => {
  it('returns invoice output', async () => {
    const result = await runAction({ idempotencyKey: 'r1:s3' }, { amount: '1000' });
    expect(result.output.payUrl).toContain('/1000');
  });
});
