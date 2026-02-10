import { z } from 'zod';

export const stepPolicySchema = z.object({
  timeoutMs: z.number().int().positive().optional(),
  maxAttempts: z.number().int().positive().optional(),
  backoffMs: z.number().int().nonnegative().optional(),
});

export const workflowStepSchema = z.object({
  id: z.string().min(1),
  connector: z.string().min(1),
  operation: z.string().min(1),
  connectionId: z.string().optional(),
  input: z.record(z.any()).default({}),
  policy: stepPolicySchema.optional(),
});

export const workflowDslSchema = z.object({
  name: z.string().min(1),
  trigger: z.object({ type: z.string().min(1), config: z.record(z.any()).default({}) }),
  steps: z.array(workflowStepSchema).min(1),
});

export type WorkflowDsl = z.infer<typeof workflowDslSchema>;
export type WorkflowStep = z.infer<typeof workflowStepSchema>;

export function parseWorkflowDsl(input: unknown): WorkflowDsl {
  return workflowDslSchema.parse(input);
}
