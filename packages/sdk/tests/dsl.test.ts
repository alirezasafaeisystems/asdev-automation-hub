import { describe, expect, it } from 'vitest';
import { interpolateObject, parseWorkflowDsl } from '../src/index.js';

describe('dsl parser', () => {
  it('parses valid workflow', () => {
    const parsed = parseWorkflowDsl({
      name: 'Order flow',
      trigger: { type: 'core.form.submit', config: { formId: 'f1' } },
      steps: [{ id: 's1', connector: 'core.case', operation: 'create', input: {} }],
    });

    expect(parsed.steps).toHaveLength(1);
  });

  it('resolves interpolation tokens', () => {
    const output = interpolateObject(
      {
        text: '{{trigger.phone}} -> {{s1.id}} -> {{env.RUNTIME}}',
      },
      {
        trigger: { phone: '+989121234567' },
        steps: { s1: { output: { id: 'case_1' } } },
        env: { RUNTIME: 'test' },
      },
    );

    expect(output.text).toBe('+989121234567 -> case_1 -> test');
  });
});
