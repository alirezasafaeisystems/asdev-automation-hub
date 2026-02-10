import { QueueJob, QueuePort } from './types.js';

export class InMemoryQueue implements QueuePort {
  private readonly jobs = new Map<string, QueueJob>();

  async enqueue(job: QueueJob): Promise<void> {
    this.jobs.set(job.id, { ...job });
  }

  async claimNext(now = new Date()): Promise<QueueJob | null> {
    const candidates = Array.from(this.jobs.values())
      .filter((job) => job.availableAt <= now)
      .sort((a, b) => a.availableAt.getTime() - b.availableAt.getTime());

    return candidates[0] ?? null;
  }

  async ack(jobId: string): Promise<void> {
    this.jobs.delete(jobId);
  }

  async fail(jobId: string, nextAvailableAt: Date): Promise<void> {
    const current = this.jobs.get(jobId);
    if (!current) return;
    this.jobs.set(jobId, {
      ...current,
      attempts: current.attempts + 1,
      availableAt: nextAvailableAt,
    });
  }
}
