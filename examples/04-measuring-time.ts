import debug from '../src/index.ts';

const stepTrace = debug('workflow:perf:step');
const summaryTrace = debug('workflow:perf:summary');

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runStep(step: string, ms: number): Promise<number> {
  const start = Date.now();
  stepTrace('Step %s started', step);
  await wait(ms);
  const duration = Date.now() - start;
  stepTrace('Step %s finished in %dms', step, duration);
  return duration;
}

async function main(): Promise<void> {
  summaryTrace('Performance test started');
  const durations: number[] = [];
  durations.push(await runStep('fetch-config', 80));
  durations.push(await runStep('warm-cache', 120));
  durations.push(await runStep('connect-db', 60));

  const total = durations.reduce((sum, n) => sum + n, 0);
  summaryTrace('All steps complete. durations=%O total=%dms', durations, total);
}

main().catch((err: unknown) => {
  summaryTrace('Unexpected failure: %O', err);
  process.exitCode = 1;
});
