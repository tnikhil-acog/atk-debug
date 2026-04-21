import { test, expect, describe } from 'bun:test';
import atkDebug from '../src/index.ts';

describe('API Parity with core debug', () => {
	test('should have all expected core properties', () => {
		expect(atkDebug.enable).toBeDefined();
		expect(atkDebug.disable).toBeDefined();
		expect(atkDebug.enabled).toBeDefined();
		expect(atkDebug.coerce).toBeDefined();
		expect(atkDebug.formatArgs).toBeDefined();
		expect(atkDebug.selectColor).toBeDefined();
		expect(atkDebug.formatters).toBeDefined();
		expect(atkDebug.names).toBeDefined();
		expect(atkDebug.skips).toBeDefined();
		expect(atkDebug.inspectOpts).toBeDefined();
		expect(atkDebug.humanize).toBeDefined();
		expect(atkDebug.log).toBeDefined();
		
		// New parity exports
		expect(atkDebug.colors).toBeDefined();
		expect(atkDebug.useColors).toBeDefined();
		expect(atkDebug.init).toBeDefined();
		expect(atkDebug.save).toBeDefined();
		expect(atkDebug.load).toBeDefined();
		
		// New meta controls
		expect(atkDebug.setCallerMetaEnabled).toBeDefined();
		expect(atkDebug.getCallerMetaEnabled).toBeDefined();
	});

	test('should have circular aliases for parity', () => {
		expect(atkDebug.debug).toBe(atkDebug);
		expect(atkDebug.default).toBe(atkDebug);
	});
});

describe('Multiple Argument Handling', () => {
	test('should handle multiple arguments without format string', () => {
		const log = atkDebug('test:args');
		log.enabled = true;
		log.useColors = false; // Disable colors for predictable output
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
		const log = atkDebug('test:format');
		log.enabled = true;
		log.useColors = false;
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
		const log = atkDebug('test:toggle');
		log.enabled = true;
		log.useColors = false;
		let lastArgs: any[] = [];
		log.log = (...args) => { lastArgs = args; };

		atkDebug.setCallerMetaEnabled(false);
		log('no metadata');
		// Should NOT contain the [file:line] meta, but standard debug namespace prefix remains
		expect(lastArgs[0]).not.toContain('[%s:%d]');
		expect(lastArgs[0]).toContain('no metadata');

		atkDebug.setCallerMetaEnabled(true);
		log('with metadata');
		expect(lastArgs[0]).toContain('[%s:%d] with metadata');
	});
});
