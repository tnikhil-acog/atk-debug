import atkDebug from '../src/index.ts';

const api = atkDebug('workflow:runtime:api');
const db = atkDebug('workflow:runtime:db');
const toggle = atkDebug('workflow:runtime:toggle');

api('This will not show before enable');

atkDebug.enable('workflow:runtime:api,workflow:runtime:toggle');
toggle('Enabled only api + toggle namespaces');
api('API logs enabled');
db('DB logs still disabled');

atkDebug.enable('workflow:runtime:*');
toggle('Enabled all runtime namespaces');
api('API logs still enabled');
db('DB logs now enabled too');

for (let i = 1; i <= 3; i += 1) {
  api('Processing request cycle=%d', i);
}

atkDebug.disable();
api('This should not appear after disable');
