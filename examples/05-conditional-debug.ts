import debug from '../src/index.ts';

type ComputationResult = {
  limit: number;
  score: number;
};

const gateTrace = debug('workflow:compute:gate');
const traceTrace = debug('workflow:compute:trace');

function heavyComputation(limit: number): ComputationResult {
  let score = 0;
  for (let i = 1; i <= limit; i += 1) {
    score += i * (i % 7);
  }
  return { limit, score };
}

function compute(limit: number): ComputationResult {
  if (traceTrace.enabled) {
    gateTrace('Debug enabled; running expensive trace for limit=%d', limit);
    const result = heavyComputation(limit);
    traceTrace('Computation details: %O', result);
    return result;
  }

  gateTrace('Trace disabled; running normal computation for limit=%d', limit);
  return heavyComputation(limit);
}

const outcome = compute(10000);
gateTrace('Final outcome: %O', outcome);
