import debug from '../src/index.ts';

debug.setDevOnly(false);
debug.enable('workflow:stream:*');

const originalLog = debug.log;
const captured: string[] = [];

debug.log = (...args: unknown[]) => {
  const line = args.map((arg) => String(arg)).join(' ');
  captured.push(line);
  console.log('[GLOBAL_STREAM]', line);
};

const alpha = debug('workflow:stream:alpha');
const beta = debug('workflow:stream:beta');

alpha('alpha started');
beta('beta started');

console.log('captured_count', captured.length);

debug.log = originalLog;
debug.disable();
debug.setDevOnly(true);
