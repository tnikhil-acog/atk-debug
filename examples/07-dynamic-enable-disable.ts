import debug from '../src/index.ts';

const api = debug('workflow:runtime:api');
const db = debug('workflow:runtime:db');
const toggle = debug('workflow:runtime:toggle');

api('This will not show before enable');

debug.enable('workflow:runtime:api,workflow:runtime:toggle');
toggle('Enabled only api + toggle namespaces');
api('API traces enabled');
db('DB traces still disabled');

debug.enable('workflow:runtime:*');
toggle('Enabled all runtime namespaces');
api('API traces still enabled');
db('DB traces now enabled too');

for (let i = 1; i <= 3; i += 1) {
  api('Processing request cycle=%d', i);
}

debug.disable();
api('This should not appear after disable');
