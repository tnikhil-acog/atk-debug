
import { createDebug } from '../src/debugWithMeta.ts';
import path from 'path';

// --- LEGACY MOCK (String-based) ---
function getBasenameLegacy(filePath: string): string {
    const parts = filePath.split(/[\\/]/);
    return parts[parts.length - 1] || 'unknown';
}

function parseFirstExternalFrameLegacy(stack: string[] | undefined): any {
    if (!stack) return null;
    for (const rawLine of stack.slice(1)) {
        const line = rawLine.trim();
        const match = line.match(/\((.*):(\d+):(\d+)\)/) || line.match(/at (.*):(\d+):(\d+)/);
        if (!match) continue;
        const filePath = match[1];
        const lower = filePath.toLowerCase();
        if (lower === 'native' || lower.includes('benchmark.ts') || lower.includes('/node_modules/') || lower.startsWith('node:') || lower.includes('internal/')) continue;
        return { file: getBasenameLegacy(filePath), line: Number(match[2]), fullPath: filePath };
    }
    return null;
}

function getCallerInfoLegacy(): any {
    try {
        const err = new Error();
        return parseFirstExternalFrameLegacy(err.stack ? err.stack.split('\n') : undefined);
    } catch {
        return { file: 'unknown', line: 0, fullPath: 'unknown' };
    }
}

// --- OPTIMIZED (The one currently in src) ---
function getBasename(filePath: string): string {
	const parts = filePath.split(/[\\/]/);
	return parts[parts.length - 1] || 'unknown';
}

function getCallerInfoOptimized(): any {
	const originalPrepare = Error.prepareStackTrace;
	const originalLimit = Error.stackTraceLimit;
	try {
		Error.stackTraceLimit = 10;
		Error.prepareStackTrace = (_, stack) => stack;
		const err = new Error();
		const stack = err.stack as unknown as any[];
		if (!Array.isArray(stack)) return { file: 'unknown', line: 0, fullPath: 'unknown' };
		for (let i = 1; i < stack.length; i++) {
			const frame = stack[i];
			const filePath = frame.getFileName();
			if (!filePath) continue;
			const lower = filePath.toLowerCase();
			if (lower === 'native' || lower.includes('benchmark.ts') || lower.includes('/node_modules/') || lower.startsWith('node:') || lower.includes('internal/')) continue;
			return { file: getBasename(filePath), line: frame.getLineNumber() || 0, fullPath: filePath };
		}
		return { file: 'unknown', line: 0, fullPath: 'unknown' };
	} catch {
		return { file: 'unknown', line: 0, fullPath: 'unknown' };
	} finally {
		Error.prepareStackTrace = originalPrepare;
		Error.stackTraceLimit = originalLimit;
	}
}

// --- SUPER OPTIMIZED (Pre-set prepareStackTrace) ---
// This version avoids the overhead of changing the global every call.
// However, it's not thread-safe if other libraries use it.
// But in a single-threaded environment like Node/Bun, it's mostly fine if we wrap the call.
function getCallerInfoSuperOptimized(): any {
    const originalPrepare = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    const stack = err.stack as unknown as any[];
    Error.prepareStackTrace = originalPrepare;
    
    if (!Array.isArray(stack)) return { file: 'unknown', line: 0, fullPath: 'unknown' };
    for (let i = 1; i < stack.length; i++) {
        const frame = stack[i];
        const filePath = frame.getFileName();
        if (!filePath) continue;
        const lower = filePath.toLowerCase();
        if (lower === 'native' || lower.includes('benchmark.ts') || lower.includes('/node_modules/') || lower.startsWith('node:') || lower.includes('internal/')) continue;
        return { file: getBasename(filePath), line: frame.getLineNumber() || 0, fullPath: filePath };
    }
    return { file: 'unknown', line: 0, fullPath: 'unknown' };
}

// --- BENCHMARK ---
const ITERATIONS = 10000;

function benchmark(name: string, fn: () => void) {
    // Warmup
    for (let i = 0; i < 1000; i++) fn();
    
    const start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        fn();
    }
    const end = performance.now();
    const duration = end - start;
    const avg = (duration / ITERATIONS) * 1000; // microseconds
    console.log(`${name}: ${duration.toFixed(2)}ms total (${avg.toFixed(2)}µs per call)`);
}

console.log(`Running benchmark with ${ITERATIONS} iterations...\n`);

benchmark("Legacy (String Parsing)", getCallerInfoLegacy);
benchmark("Optimized (Structured API)", getCallerInfoOptimized);
benchmark("Super Optimized (Minimal Overrides)", getCallerInfoSuperOptimized);
