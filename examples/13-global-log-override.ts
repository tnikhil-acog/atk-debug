import atkDebug from '../src/index.ts';

atkDebug.setDevOnly(false);
atkDebug.enable('workflow:stream:*');

const originalLog = atkDebug.log;
const captured: string[] = [];

atkDebug.log = (...args: unknown[]) => {
  const line = args.map((arg) => String(arg)).join(' ');
  captured.push(line);
  console.log('[GLOBAL_STREAM]', line);
};

const alpha = atkDebug('workflow:stream:alpha');
const beta = atkDebug('workflow:stream:beta');

alpha('alpha started');
beta('beta started');

console.log('captured_count', captured.length);

atkDebug.log = originalLog;
atkDebug.disable();
atkDebug.setDevOnly(true);
