import { test, expect, describe } from 'bun:test';
import debug from '../src/index.ts';
import { createDebug } from '../src/debugWithMeta.ts';

describe('Stack Trace Logic', () => {
	test('should identify caller in V8 environment', () => {
		const trace = createDebug('test:v8');
		trace.enabled = true;
		trace.useColors = false;
		debug.setClickable(false);
		let lastArgs: any[] = [];
		trace.log = (...args) => { lastArgs = args; };

		// This call is at line 15
		trace('hello');

		expect(lastArgs[1]).toBe('stack-trace.test.ts');
		expect(lastArgs[2]).toBe(15);
	});

	test('should fallback gracefully in non-V8 environment', () => {
		const originalCapture = Error.captureStackTrace;
		// @ts-ignore
		delete Error.captureStackTrace;

		try {
			const trace = createDebug('test:non-v8');
			trace.enabled = true;
			trace.useColors = false;
			debug.setClickable(false);
			let lastArgs: any[] = [];
			trace.log = (...args) => { lastArgs = args; };

			// This call is at line 35
			trace('hello');

			expect(lastArgs[1]).toBe('stack-trace.test.ts');
			expect(lastArgs[2]).toBe(35);
		} finally {
			Error.captureStackTrace = originalCapture;
		}
	});

	test('should handle nested calls correctly', () => {
		const trace = createDebug('test:nested');
		trace.enabled = true;
		trace.useColors = false;
		debug.setClickable(false);
		let lastArgs: any[] = [];
		trace.log = (...args) => { lastArgs = args; };

		function wrapper() {
			// This call is at line 54
			trace('nested');
		}

		wrapper();

		expect(lastArgs[1]).toBe('stack-trace.test.ts');
		expect(lastArgs[2]).toBe(54);
	});
});
