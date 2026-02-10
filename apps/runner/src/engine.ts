import { interpolateObject, parseWorkflowDsl } from '@asdev/sdk';
import { ConnectorRuntime, StepRunLog } from './types.js';

export async function executeWorkflow(input: {
  runId: string;
  trigger: Record<string, unknown>;
  dslJson: unknown;
  connectorRuntime: ConnectorRuntime;
}): Promise<{ status: 'SUCCEEDED' | 'FAILED'; logs: StepRunLog[] }> {
  const dsl = parseWorkflowDsl(input.dslJson);
  const logs: StepRunLog[] = [];
  const stepOutputs: Record<string, { output: Record<string, unknown> }> = {};

  for (const step of dsl.steps) {
    const maxAttempts = step.policy?.maxAttempts ?? 1;
    const backoffMs = step.policy?.backoffMs ?? 0;
    const timeoutMs = step.policy?.timeoutMs ?? 10_000;

    let attempt = 0;
    let completed = false;

    while (attempt < maxAttempts && !completed) {
      attempt += 1;
      try {
        const interpolatedInput = interpolateObject(step.input, {
          trigger: input.trigger,
          steps: stepOutputs,
          env: process.env,
        });

        const connectorInput = {
          connector: step.connector,
          operation: step.operation,
          input: interpolatedInput as Record<string, unknown>,
          idempotencyKey: `${input.runId}:${step.id}`,
          ...(step.connectionId ? { connectionId: step.connectionId } : {}),
        };

        const runPromise = input.connectorRuntime.runAction(connectorInput);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`Step timeout after ${timeoutMs}ms`)), timeoutMs);
        });

        const result = await Promise.race([runPromise, timeoutPromise]);
        stepOutputs[step.id] = { output: result.output };
        logs.push({ runId: input.runId, stepId: step.id, attempt, status: 'SUCCEEDED', output: result.output });
        completed = true;
      } catch (error) {
        logs.push({
          runId: input.runId,
          stepId: step.id,
          attempt,
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'unknown error',
        });

        if (attempt >= maxAttempts) {
          return { status: 'FAILED', logs };
        }

        if (backoffMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }
  }

  return { status: 'SUCCEEDED', logs };
}
