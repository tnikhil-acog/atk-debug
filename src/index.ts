import { createDebug, debugTools } from './debugWithMeta.js';
export type { DebugTools, DebugWithMeta } from './debugWithMeta.js';

/**
 * Public callable API for atk-debug.
 *
 * Import this as the default export and call it with a namespace to create a logger.
 * Static methods mirror the core `debug` API and include runtime controls for metadata.
 */
export type AtkDebug = ((namespace: string) => ReturnType<typeof createDebug>) & {
	/**
	 * Enables one or more namespaces using debug patterns.
	 *
	 * @example
	 * debug.enable('app:*,db:*,-db:verbose');
	 */
	enable: (namespaces: string) => void;
	/**
	 * Disables all currently enabled namespaces.
	 *
	 * @returns The previously active namespace string.
	 */
	disable: () => string;
	/**
	 * Checks if a namespace is currently enabled.
	 */
	enabled: (namespace: string) => boolean;
	/**
	 * Coerces arbitrary input into a debug-printable value.
	 */
	coerce: (value: unknown) => unknown;
	/**
	 * Internal formatter bridge from core debug.
	 */
	formatArgs: (this: ReturnType<typeof createDebug>, args: unknown[]) => void;
	/**
	 * Selects the deterministic color for a namespace.
	 */
	selectColor: (namespace: string) => string | number;
	/**
	 * Global debug formatters map (e.g. `%O`, `%j`, custom keys).
	 */
	formatters: Record<string, (value: unknown) => string>;
	/**
	 * Enabled namespace regex buckets from core debug.
	 */
	names: string[];
	/**
	 * Skipped namespace regex buckets from core debug.
	 */
	skips: string[];
	/**
	 * Runtime inspect options forwarded to debug formatting.
	 */
	inspectOpts: Record<string, unknown> | undefined;
	/**
	 * Converts milliseconds to a human-readable string.
	 */
	humanize: (value: number | string) => string;
	/**
	 * When true (default), logging is disabled in production.
	 */
	setDevOnly: (devOnly: boolean) => void;
	/**
	 * Returns whether production suppression is enabled.
	 */
	getDevOnly: () => boolean;
	/**
	 * Toggles `[file:line]` caller metadata in log output.
	 */
	setCallerMetaEnabled: (enabled: boolean) => void;
	/**
	 * Returns whether caller metadata injection is active.
	 */
	getCallerMetaEnabled: () => boolean;
	/**
	 * Global output writer used by all debuggers.
	 */
	log: (...args: unknown[]) => void;
	// Core parity
	/**
	 * Color palette used by debug.
	 */
	colors: (string | number)[];
	/**
	 * Detects if color output should be used.
	 */
	useColors: () => boolean;
	/**
	 * Initializes a debugger instance with core settings.
	 */
	init: (debug: any) => void;
	/**
	 * Persists namespace selection via core debug storage.
	 */
	save: (namespaces: string) => void;
	/**
	 * Loads persisted namespaces from core debug storage.
	 */
	load: () => string | undefined;
	/**
	 * Alias for compatibility with core debug's callable export shape.
	 */
	debug: AtkDebug;
	/**
	 * Default alias for CommonJS/ESM interop compatibility.
	 */
	default: AtkDebug;
};

/**
 * Creates a namespaced debugger with optional caller metadata support.
 *
 * @param namespace Debug namespace (for example: `service:http`).
 * @returns A callable debugger function for the provided namespace.
 */
const debug = ((namespace: string) => createDebug(namespace)) as AtkDebug;

Object.defineProperty(debug, 'enable', {
	value: debugTools.enable,
});
Object.defineProperty(debug, 'disable', {
	value: debugTools.disable,
});
Object.defineProperty(debug, 'enabled', {
	value: debugTools.enabled,
});
Object.defineProperty(debug, 'coerce', {
	value: debugTools.coerce,
});
Object.defineProperty(debug, 'formatArgs', {
	value: debugTools.formatArgs,
});
Object.defineProperty(debug, 'selectColor', {
	value: debugTools.selectColor,
});
Object.defineProperty(debug, 'formatters', {
	get: () => debugTools.formatters,
});
Object.defineProperty(debug, 'names', {
	get: () => debugTools.names,
	set: (next: string[]) => {
		debugTools.names = next;
	},
});
Object.defineProperty(debug, 'skips', {
	get: () => debugTools.skips,
	set: (next: string[]) => {
		debugTools.skips = next;
	},
});
Object.defineProperty(debug, 'inspectOpts', {
	get: () => debugTools.inspectOpts,
	set: (next: Record<string, unknown> | undefined) => {
		debugTools.inspectOpts = next;
	},
});
Object.defineProperty(debug, 'humanize', {
	value: debugTools.humanize,
});
Object.defineProperty(debug, 'setDevOnly', {
	value: debugTools.setDevOnly,
});
Object.defineProperty(debug, 'getDevOnly', {
	value: debugTools.getDevOnly,
});
Object.defineProperty(debug, 'setCallerMetaEnabled', {
	value: debugTools.setCallerMetaEnabled,
});
Object.defineProperty(debug, 'getCallerMetaEnabled', {
	value: debugTools.getCallerMetaEnabled,
});
Object.defineProperty(debug, 'log', {
	get: () => debugTools.log,
	set: (writer: (...args: unknown[]) => void) => {
		debugTools.log = writer;
	},
});
Object.defineProperty(debug, 'colors', {
	get: () => debugTools.colors,
	set: (next: (string | number)[]) => {
		debugTools.colors = next;
	},
});
Object.defineProperty(debug, 'useColors', {
	value: debugTools.useColors,
});
Object.defineProperty(debug, 'init', {
	value: debugTools.init,
});
Object.defineProperty(debug, 'save', {
	value: debugTools.save,
});
Object.defineProperty(debug, 'load', {
	value: debugTools.load,
});
Object.defineProperty(debug, 'debug', {
	value: debug,
});
Object.defineProperty(debug, 'default', {
	value: debug,
});

export default debug;
