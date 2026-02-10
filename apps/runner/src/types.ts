export type StepExecutionResult = {
  output: Record<string, unknown>;
};

export interface ConnectorRuntime {
  runAction(input: {
    connector: string;
    operation: string;
    connectionId?: string;
    input: Record<string, unknown>;
    idempotencyKey: string;
  }): Promise<StepExecutionResult>;
}

export type StepRunLog = {
  runId: string;
  stepId: string;
  attempt: number;
  status: 'SUCCEEDED' | 'FAILED';
  output?: Record<string, unknown>;
  errorMessage?: string;
};
