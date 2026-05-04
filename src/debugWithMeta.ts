import debug from 'debug';
import path from 'path';

/**
 * Enhanced type for the core 'debug' package to include properties 
 * that exist at runtime but are missing from @types/debug.
 */
interface ExtendedDebug extends debug.Debug {
	colors: (string | number)[];
	useColors: () => boolean;
	init: (debug: CoreDebugger) => void;
	save: (namespaces: string) => void;
	load: () => string | undefined;
}

const coreDebug = debug as unknown as ExtendedDebug;

type CoreDebugFactory = typeof debug;
type CoreDebugger = ReturnType<CoreDebugFactory> & { useColors: boolean };

type RuntimeConfig = {
	devOnly: boolean;
	callerMetaEnabled: boolean;
	clickable: boolean;
};

const runtimeConfig: RuntimeConfig = {
	devOnly: true,
	callerMetaEnabled: true,
	clickable: true,
};

function isRuntimeEnabled(): boolean {
	if (!runtimeConfig.devOnly) return true;
	// Handle non-Node environments safely
	const env = typeof process !== 'undefined' ? process.env : {};
	return env?.NODE_ENV !== 'production';
}

type CallerInfo = {
	file: string;
	line: number;
	fullPath: string;
};

/**
 * A debugger function enhanced with metadata and parity helpers.
 */
export type DebugWithMeta = ((...args: unknown[]) => void) & {
	namespace: string;
	enabled: boolean;
	useColors: boolean;
	color: string | number;
	diff: number;
	log: (...args: unknown[]) => void;
	destroy?: () => boolean;
	extend: (subNamespace: string, delimiter?: string) => DebugWithMeta;
};

/**
 * Static helper surface delegated from the underlying core `debug` module.
 */
export type DebugTools = {
	enable: (namespaces: string) => void;
	disable: () => string;
	enabled: (name: string) => boolean;
	coerce: (value: unknown) => unknown;
	formatArgs: (this: CoreDebugger, args: unknown[]) => void;
	selectColor: (namespace: string) => string | number;
	formatters: Record<string, (value: unknown) => string>;
	names: string[];
	skips: string[];
	inspectOpts: Record<string, unknown> | undefined;
	humanize: (value: number | string) => string;
	setDevOnly: (devOnly: boolean) => void;
	getDevOnly: () => boolean;
	setCallerMetaEnabled: (enabled: boolean) => void;
	getCallerMetaEnabled: () => boolean;
	setClickable: (enabled: boolean) => void;
	getClickable: () => boolean;
	log: (...args: unknown[]) => void;
	// Missing core debug exports
	colors: (string | number)[];
	useColors: () => boolean;
	init: (debug: CoreDebugger) => void;
	save: (namespaces: string) => void;
	load: () => string | undefined;
};

export const debugTools: DebugTools = {
	enable: (namespaces: string) => {
		if (!isRuntimeEnabled()) {
			coreDebug.disable();
			return;
		}
		coreDebug.enable(namespaces);
	},
	disable: () => coreDebug.disable(),
	enabled: (name: string) => (isRuntimeEnabled() ? coreDebug.enabled(name) : false),
	coerce: (value: unknown) => coreDebug.coerce(value),
	formatArgs: function formatArgs(this: CoreDebugger, args: unknown[]): void {
		return coreDebug.formatArgs.call(this, args);
	},
	selectColor: (namespace: string) => coreDebug.selectColor(namespace),
	formatters: coreDebug.formatters as Record<string, (value: unknown) => string>,
	get names() {
		return coreDebug.names;
	},
	set names(next: string[]) {
		coreDebug.names = next;
	},
	get skips() {
		return coreDebug.skips;
	},
	set skips(next: string[]) {
		coreDebug.skips = next;
	},
	get inspectOpts() {
		return (coreDebug.inspectOpts ?? undefined) as Record<string, unknown> | undefined;
	},
	set inspectOpts(next: Record<string, unknown> | undefined) {
		coreDebug.inspectOpts = next as never;
	},
	humanize: (value: number | string) => coreDebug.humanize(value as never),
	setDevOnly: (devOnly: boolean) => {
		runtimeConfig.devOnly = devOnly;
		if (!isRuntimeEnabled()) {
			coreDebug.disable();
		}
	},
	getDevOnly: () => runtimeConfig.devOnly,
	setCallerMetaEnabled: (enabled: boolean) => {
		runtimeConfig.callerMetaEnabled = enabled;
	},
	getCallerMetaEnabled: () => runtimeConfig.callerMetaEnabled,
	setClickable: (enabled: boolean) => {
		runtimeConfig.clickable = enabled;
	},
	getClickable: () => runtimeConfig.clickable,
	get log() {
		return coreDebug.log as (...args: unknown[]) => void;
	},
	set log(writer: (...args: unknown[]) => void) {
		coreDebug.log = writer as (...args: unknown[]) => void;
	},
	// Implement/delegate missing core methods
	get colors() {
		return coreDebug.colors;
	},
	set colors(next: (string | number)[]) {
		coreDebug.colors = next;
	},
	useColors: () => coreDebug.useColors(),
	init: (dbg: CoreDebugger) => coreDebug.init(dbg),
	save: (namespaces: string) => coreDebug.save(namespaces),
	load: () => coreDebug.load(),
};

/**
 * Browser-safe path.basename fallback
 */
function getBasename(filePath: string): string {
	if (path && typeof path.basename === 'function') {
		try {
			return path.basename(filePath);
		} catch {
			// ignore and fallback
		}
	}
	const parts = filePath.split(/[\\/]/);
	return parts[parts.length - 1] || 'unknown';
}

/**
 * Guarded Structured Stack Trace API.
 * We override this once at the module level to avoid the overhead of re-assigning it 
 * on every log call. The flag ensures we only return structured data for our own calls.
 */
let isInternalCapturing = false;
const originalPrepare = Error.prepareStackTrace;

// Only perform the override if we are in a V8-like environment that supports it
if (typeof Error.captureStackTrace === 'function') {
	Error.prepareStackTrace = (err, stack) => {
		if (isInternalCapturing) return stack;
		if (typeof originalPrepare === 'function') return originalPrepare(err, stack);
		// Default behavior: return the stringified stack
		return String(err.stack || '');
	};
}

function parseFirstExternalFrame(stack: string[] | undefined): CallerInfo | null {
	if (!stack) return null;

	for (const rawLine of stack.slice(1)) {
		const line = rawLine.trim();
		// Handle both "at ... (file:line:col)" and "at file:line:col"
		const match = line.match(/\((.*):(\d+):(\d+)\)/) || line.match(/at (.*):(\d+):(\d+)/);
		if (!match) continue;

		const filePath = match[1];
		const lower = filePath.toLowerCase();

		// Skip wrapper/internal runtime frames
		if (lower === 'native') continue;
		if (lower.includes('debugwithmeta.ts')) continue;
		if (lower.includes('/node_modules/')) continue;
		if (lower.startsWith('node:')) continue;
		if (lower.includes('internal/')) continue;

		return {
			file: getBasename(filePath),
			line: Number(match[2]),
			fullPath: filePath,
		};
	}

	return null;
}

function getCallerInfo(): CallerInfo {
	// Fallback for non-V8 environments (Firefox, Safari, etc.)
	if (typeof Error.captureStackTrace !== 'function') {
		try {
			const err = new Error();
			const stack = err.stack ? err.stack.split('\n') : undefined;
			return parseFirstExternalFrame(stack) ?? { file: 'unknown', line: 0, fullPath: 'unknown' };
		} catch {
			return { file: 'unknown', line: 0, fullPath: 'unknown' };
		}
	}

	const originalLimit = Error.stackTraceLimit;

	try {
		isInternalCapturing = true;
		// Limit stack depth to reduce walking overhead
		Error.stackTraceLimit = 10;

		const target = { stack: [] };
		Error.captureStackTrace(target, getCallerInfo);
		const stack = target.stack as unknown as any[];

		isInternalCapturing = false;

		if (!Array.isArray(stack)) {
			return { file: 'unknown', line: 0, fullPath: 'unknown' };
		}

		for (let i = 0; i < stack.length; i++) {
			const frame = stack[i];
			const filePath = typeof frame.getFileName === 'function' ? frame.getFileName() : null;
			if (!filePath) continue;

			const lower = filePath.toLowerCase();

			// Skip wrapper/internal runtime frames
			if (lower === 'native') continue;
			if (lower.includes('debugwithmeta.ts')) continue;
			if (lower.includes('/node_modules/')) continue;
			if (lower.startsWith('node:')) continue;
			if (lower.includes('internal/')) continue;

			return {
				file: getBasename(filePath),
				line: typeof frame.getLineNumber === 'function' ? frame.getLineNumber() : 0,
				fullPath: filePath,
			};
		}

		return { file: 'unknown', line: 0, fullPath: 'unknown' };
	} catch {
		isInternalCapturing = false;
		return { file: 'unknown', line: 0, fullPath: 'unknown' };
	} finally {
		Error.stackTraceLimit = originalLimit;
	}
}

function wrapCoreDebugger(core: CoreDebugger, declarationCaller: CallerInfo): DebugWithMeta {
	const wrap = ((...args: unknown[]) => {
		if (!isRuntimeEnabled()) return;
		if (!core.enabled) return;

		let file = '';
		let line = 0;
		let fullPath = '';

		if (runtimeConfig.callerMetaEnabled) {
			const callsite = getCallerInfo();
			const resolvedCaller = callsite.file === 'unknown' ? declarationCaller : callsite;
			file = resolvedCaller.file;
			line = resolvedCaller.line;
			fullPath = resolvedCaller.fullPath;
		}

		// Correctly handle multiple arguments and format strings
		if (typeof args[0] === 'string') {
			const [format, ...rest] = args as [string, ...unknown[]];
			if (runtimeConfig.callerMetaEnabled) {
				if (runtimeConfig.clickable && fullPath !== 'unknown') {
					// Reverting to the safer #L fragment which ensures the file at least opens
					const url = encodeURI(`file://${fullPath}`) + `#L${line}`;
					const meta = `\x1b]8;;${url}\x1b\\` + `[${file}:${line}]` + `\x1b]8;;\x1b\\`;
					core(`${meta} ${format}`, ...rest);
				} else {
					core(`[%s:%d] ${format}`, file, line, ...rest);
				}
			} else {
				core(format, ...rest);
			}
		} else if (args.length === 0) {
			if (runtimeConfig.callerMetaEnabled) {
				if (runtimeConfig.clickable && fullPath !== 'unknown') {
					const url = encodeURI(`file://${fullPath}`) + `#L${line}`;
					const meta = `\x1b]8;;${url}\x1b\\` + `[${file}:${line}]` + `\x1b]8;;\x1b\\`;
					core(`${meta}`);
				} else {
					core('[%s:%d]', file, line);
				}
			} else {
				core('');
			}
		} else {
			// If no format string, prefix with metadata and then pass all args
			// Standard debug will treat the first arg as a value (will unshift %O)
			if (runtimeConfig.callerMetaEnabled) {
				if (runtimeConfig.clickable && fullPath !== 'unknown') {
					const url = encodeURI(`file://${fullPath}`) + `#L${line}`;
					const meta = `\x1b]8;;${url}\x1b\\` + `[${file}:${line}]` + `\x1b]8;;\x1b\\`;
					core(`${meta} %O`, ...args);
				} else {
					core('[%s:%d] %O', file, line, ...args);
				}
			} else {
				core('%O', ...args);
			}
		}
	}) as DebugWithMeta;

	Object.defineProperty(wrap, 'namespace', {
		get: () => core.namespace,
	});
	Object.defineProperty(wrap, 'enabled', {
		get: () => (isRuntimeEnabled() ? core.enabled : false),
		set: (value: boolean) => {
			core.enabled = isRuntimeEnabled() ? value : false;
		},
	});
	Object.defineProperty(wrap, 'useColors', {
		get: () => core.useColors,
		set: (value: boolean) => {
			core.useColors = value;
		},
	});
	Object.defineProperty(wrap, 'color', {
		get: () => core.color,
	});
	Object.defineProperty(wrap, 'diff', {
		get: () => core.diff,
	});
	Object.defineProperty(wrap, 'log', {
		get: () => core.log as (...args: unknown[]) => void,
		set: (writer: (...args: unknown[]) => void) => {
			core.log = writer as (...args: unknown[]) => void;
		},
	});

	wrap.destroy = () => (core.destroy ? core.destroy() : false);
	wrap.extend = (subNamespace: string, delimiter?: string) => {
		const child = core.extend(subNamespace, delimiter) as CoreDebugger;
		return wrapCoreDebugger(child, declarationCaller);
	};

	return wrap;
}

/**
 * Creates a wrapped debugger for a namespace.
 *
 * The wrapper preserves core `debug` behavior while optionally prefixing output
 * with caller metadata in the form `[file:line]`.
 */
export function createDebug(namespace: string): DebugWithMeta {
	const core = coreDebug(namespace) as CoreDebugger;
	const declarationCaller = getCallerInfo();
	return wrapCoreDebugger(core, declarationCaller);
}
