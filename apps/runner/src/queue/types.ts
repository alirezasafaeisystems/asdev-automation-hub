export type QueueJob = {
  id: string;
  runId: string;
  stepId: string;
  payload: Record<string, unknown>;
  availableAt: Date;
  attempts: number;
  maxAttempts: number;
};

export interface QueuePort {
  enqueue(job: QueueJob): Promise<void>;
  claimNext(now?: Date): Promise<QueueJob | null>;
  ack(jobId: string): Promise<void>;
  fail(jobId: string, nextAvailableAt: Date): Promise<void>;
}
