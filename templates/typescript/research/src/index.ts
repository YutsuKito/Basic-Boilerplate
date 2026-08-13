export interface Experiment {
  id: string;
  hypothesis: string;
  dataset: string;
  metrics: string[];
}

export function defineExperiment(experiment: Experiment): Experiment {
  if (experiment.metrics.length === 0) throw new Error("at least one metric is required");
  return experiment;
}
