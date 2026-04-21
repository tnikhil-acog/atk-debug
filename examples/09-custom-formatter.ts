import atkDebug from '../src/index.ts';

atkDebug.formatters.h = (v: unknown) => Buffer.from(String(v)).toString('hex');
atkDebug.formatters.j = (v: unknown) => JSON.stringify(v);

const encodeLog = atkDebug('workflow:events:encode');
const publishLog = atkDebug('workflow:events:publish');

const payload = {
  id: 'evt-22',
  tags: ['checkout', 'retry'],
  ok: true,
};

encodeLog('Hex message: %h', 'hello-debug');
encodeLog('Compact JSON: %j', payload);
publishLog('Publishing event id=%s ok=%s', payload.id, payload.ok);
