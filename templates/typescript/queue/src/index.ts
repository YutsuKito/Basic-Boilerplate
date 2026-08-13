export interface QueueJob<T = unknown> {
  id: string;
  name: string;
  payload: T;
}

export interface QueuePort {
  publish<T>(job: QueueJob<T>): Promise<void>;
  onJob(handler: (job: QueueJob) => Promise<void>): Promise<void>;
}
