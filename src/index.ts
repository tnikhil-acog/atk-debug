import { createDebug, debugTools } from './debugWithMeta.js';

type AtkDebug = ((namespace: string) => ReturnType<typeof createDebug>) & {
	enable: (namespaces: string) => void;
	disable: () => string;
	enabled: (namespace: string) => boolean;
	coerce: (value: unknown) => unknown;
	formatArgs: (this: ReturnType<typeof createDebug>, args: unknown[]) => void;
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
	log: (...args: unknown[]) => void;
	// Core parity
	colors: (string | number)[];
	useColors: () => boolean;
	init: (debug: any) => void;
	save: (namespaces: string) => void;
	load: () => string | undefined;
	debug: AtkDebug;
	default: AtkDebug;
};

const atkDebug = ((namespace: string) => createDebug(namespace)) as AtkDebug;

Object.defineProperty(atkDebug, 'enable', {
	value: debugTools.enable,
});
Object.defineProperty(atkDebug, 'disable', {
	value: debugTools.disable,
});
Object.defineProperty(atkDebug, 'enabled', {
	value: debugTools.enabled,
});
Object.defineProperty(atkDebug, 'coerce', {
	value: debugTools.coerce,
});
Object.defineProperty(atkDebug, 'formatArgs', {
	value: debugTools.formatArgs,
});
Object.defineProperty(atkDebug, 'selectColor', {
	value: debugTools.selectColor,
});
Object.defineProperty(atkDebug, 'formatters', {
	get: () => debugTools.formatters,
});
Object.defineProperty(atkDebug, 'names', {
	get: () => debugTools.names,
	set: (next: string[]) => {
		debugTools.names = next;
	},
});
Object.defineProperty(atkDebug, 'skips', {
	get: () => debugTools.skips,
	set: (next: string[]) => {
		debugTools.skips = next;
	},
});
Object.defineProperty(atkDebug, 'inspectOpts', {
	get: () => debugTools.inspectOpts,
	set: (next: Record<string, unknown> | undefined) => {
		debugTools.inspectOpts = next;
	},
});
Object.defineProperty(atkDebug, 'humanize', {
	value: debugTools.humanize,
});
Object.defineProperty(atkDebug, 'setDevOnly', {
	value: debugTools.setDevOnly,
});
Object.defineProperty(atkDebug, 'getDevOnly', {
	value: debugTools.getDevOnly,
});
Object.defineProperty(atkDebug, 'setCallerMetaEnabled', {
	value: debugTools.setCallerMetaEnabled,
});
Object.defineProperty(atkDebug, 'getCallerMetaEnabled', {
	value: debugTools.getCallerMetaEnabled,
});
Object.defineProperty(atkDebug, 'log', {
	get: () => debugTools.log,
	set: (writer: (...args: unknown[]) => void) => {
		debugTools.log = writer;
	},
});
Object.defineProperty(atkDebug, 'colors', {
	get: () => debugTools.colors,
	set: (next: (string | number)[]) => {
		debugTools.colors = next;
	},
});
Object.defineProperty(atkDebug, 'useColors', {
	value: debugTools.useColors,
});
Object.defineProperty(atkDebug, 'init', {
	value: debugTools.init,
});
Object.defineProperty(atkDebug, 'save', {
	value: debugTools.save,
});
Object.defineProperty(atkDebug, 'load', {
	value: debugTools.load,
});
Object.defineProperty(atkDebug, 'debug', {
	value: atkDebug,
});
Object.defineProperty(atkDebug, 'default', {
	value: atkDebug,
});

export default atkDebug;
