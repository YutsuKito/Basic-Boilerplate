export interface BackgroundJob {
  id: string;
  name: string;
  payload: unknown;
}

export async function processJob(job: BackgroundJob): Promise<{ processed: string }> {
  return { processed: job.id };
}
