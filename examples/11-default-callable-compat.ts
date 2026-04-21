import atkDebug from '../src/index.ts';

atkDebug.setDevOnly(false);
atkDebug.enable('workflow:compat:*');

const auth = atkDebug('workflow:compat:auth');
const login = auth.extend('login');

auth('base namespace ready');
login('login attempt %d', 1);

console.log('compat_enabled', atkDebug.enabled('workflow:compat:auth'));

atkDebug.disable();
atkDebug.setDevOnly(true);
