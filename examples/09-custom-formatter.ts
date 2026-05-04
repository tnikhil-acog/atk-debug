import debug from '../src/index.ts';

debug.formatters.h = (v: unknown) => Buffer.from(String(v)).toString('hex');
debug.formatters.j = (v: unknown) => JSON.stringify(v);

const encodeTrace = debug('workflow:events:encode');
const publishTrace = debug('workflow:events:publish');

const payload = {
  id: 'evt-22',
  tags: ['checkout', 'retry'],
  ok: true,
};

encodeTrace('Hex message: %h', 'hello-debug');
encodeTrace('Compact JSON: %j', payload);
publishTrace('Publishing event id=%s ok=%s', payload.id, payload.ok);
