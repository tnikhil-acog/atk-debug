import debug from '../src/index.ts';

debug.setDevOnly(false);
debug.enable('workflow:compat:*');

const auth = debug('workflow:compat:auth');
const login = auth.extend('login');

auth('base namespace ready');
login('login attempt %d', 1);

console.log('compat_enabled', debug.enabled('workflow:compat:auth'));

debug.disable();
debug.setDevOnly(true);
