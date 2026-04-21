import atkDebug from '../src/index.ts';

type ComputationResult = {
  limit: number;
  score: number;
};

const gateLog = atkDebug('workflow:compute:gate');
const traceLog = atkDebug('workflow:compute:trace');

function heavyComputation(limit: number): ComputationResult {
  let score = 0;
  for (let i = 1; i <= limit; i += 1) {
    score += i * (i % 7);
  }
  return { limit, score };
}

function compute(limit: number): ComputationResult {
  if (traceLog.enabled) {
    gateLog('Debug enabled; running expensive trace for limit=%d', limit);
    const result = heavyComputation(limit);
    traceLog('Computation details: %O', result);
    return result;
  }

  gateLog('Trace disabled; running normal computation for limit=%d', limit);
  return heavyComputation(limit);
}

const outcome = compute(10000);
gateLog('Final outcome: %O', outcome);
