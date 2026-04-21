import debug from '../src/index.ts';

debug.setDevOnly(false);
debug.enable('workflow:static:*,-workflow:static:skip');

const keep = debug('workflow:static:keep');
const skip = debug('workflow:static:skip');

keep('this should be visible');
skip('this should be hidden');

const previous = debug.disable();
console.log('disable_return', previous);

debug.enable(previous);
console.log('enabled_keep', debug.enabled('workflow:static:keep'));
console.log('enabled_skip', debug.enabled('workflow:static:skip'));

debug.disable();
debug.setDevOnly(true);
