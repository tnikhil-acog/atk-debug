import { test, expect, describe } from 'bun:test';
import debug from '../src/index.ts';

describe('API Parity with core debug', () => {
	test('should have all expected core properties', () => {
		expect(debug.enable).toBeDefined();
		expect(debug.disable).toBeDefined();
		expect(debug.enabled).toBeDefined();
		expect(debug.coerce).toBeDefined();
		expect(debug.formatArgs).toBeDefined();
		expect(debug.selectColor).toBeDefined();
		expect(debug.formatters).toBeDefined();
		expect(debug.names).toBeDefined();
		expect(debug.skips).toBeDefined();
		expect(debug.inspectOpts).toBeDefined();
		expect(debug.humanize).toBeDefined();
		expect(debug.log).toBeDefined();
		
		// New parity exports
		expect(debug.colors).toBeDefined();
		expect(debug.useColors).toBeDefined();
		expect(debug.init).toBeDefined();
		expect(debug.save).toBeDefined();
		expect(debug.load).toBeDefined();
		
		// New meta controls
		expect(debug.setCallerMetaEnabled).toBeDefined();
		expect(debug.getCallerMetaEnabled).toBeDefined();
	});

	test('should have circular aliases for parity', () => {
		expect(debug.debug).toBe(debug);
		expect(debug.default).toBe(debug);
	});
});

describe('Multiple Argument Handling', () => {
	test('should handle multiple arguments without format string', () => {
		const log = debug('test:args');
		log.enabled = true;
		log.useColors = false; // Disable colors for predictable output
		debug.setClickable(false); // Ensure predictable output for tests
		let lastArgs: any[] = [];
		log.log = (...args) => { lastArgs = args; };
		
		log({ a: 1 }, { b: 2 });
		
		expect(Array.isArray(lastArgs)).toBe(true);
		expect(lastArgs.length).toBeGreaterThan(0);
		
		const firstArg = lastArgs[0];
		expect(typeof firstArg).toBe('string');
		
		// Metadata should be present
		expect(firstArg).toContain('[%s:%d]');
		
		// The first object should be formatted by debug's %O formatter
		expect(firstArg).toContain('{ a: 1 }');
		
		// The original args should still be present in the pool for util.format
		expect(lastArgs[1]).toBe('parity.test.ts');
		// lastArgs[3] is { b: 2 } — use toEqual for deep object comparison since toContain uses reference equality
		expect(lastArgs[3]).toEqual({ b: 2 });
	});

	test('should handle multiple arguments with format string', () => {
		const log = debug('test:format');
		log.enabled = true;
		log.useColors = false;
		debug.setClickable(false);
		let lastArgs: any[] = [];
		log.log = (...args) => { lastArgs = args; };
		
		log('hello %s %s', 'world', 'again');
		
		const firstArg = lastArgs[0];
		expect(firstArg).toContain('[%s:%d] hello %s %s');
		expect(lastArgs).toContain('world');
		expect(lastArgs).toContain('again');
	});
});

describe('Caller Metadata Toggle', () => {
	test('should respect caller metadata toggle', () => {
		const log = debug('test:toggle');
		log.enabled = true;
		log.useColors = false;
		debug.setClickable(false);
		let lastArgs: any[] = [];
		log.log = (...args) => { lastArgs = args; };

		debug.setCallerMetaEnabled(false);
		log('no metadata');
		// Should NOT contain the [file:line] meta, but standard debug namespace prefix remains
		expect(lastArgs[0]).not.toContain('[%s:%d]');
		expect(lastArgs[0]).toContain('no metadata');

		debug.setCallerMetaEnabled(true);
		log('with metadata');
		expect(lastArgs[0]).toContain('[%s:%d] with metadata');
	});
});
