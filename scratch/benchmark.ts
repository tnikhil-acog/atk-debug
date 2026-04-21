import debug from '../src/index.ts';

const log = debug('benchmark');
log.enabled = true;
// Redirect log output to a no-op to measure purely the metadata overhead
log.log = () => { };

const ITERATIONS = 1000000;

function runBenchmark(withMeta: boolean) {
	debug.setCallerMetaEnabled(withMeta);

	const start = performance.now();
	for (let i = 0; i < ITERATIONS; i++) {
		log('test message %d', i);
	}
	const end = performance.now();

	return end - start;
}

console.log(`Running benchmark with ${ITERATIONS} iterations...\n`);

// Warmup
runBenchmark(true);
runBenchmark(false);

const timeWithMeta = runBenchmark(true);
const timeWithoutMeta = runBenchmark(false);

console.log(`Time WITH caller metadata:    ${timeWithMeta.toFixed(2)}ms`);
console.log(`Time WITHOUT caller metadata: ${timeWithoutMeta.toFixed(2)}ms`);
console.log(`Overhead per call:            ${((timeWithMeta - timeWithoutMeta) / ITERATIONS * 1000).toFixed(2)}μs`);
console.log(`Ratio:                        ${(timeWithMeta / timeWithoutMeta).toFixed(2)}x slower`);
