import atkDebug from '../src/index.ts';

atkDebug.setDevOnly(false);
atkDebug.enable('workflow:static:*,-workflow:static:skip');

const keep = atkDebug('workflow:static:keep');
const skip = atkDebug('workflow:static:skip');

keep('this should be visible');
skip('this should be hidden');

const previous = atkDebug.disable();
console.log('disable_return', previous);

atkDebug.enable(previous);
console.log('enabled_keep', atkDebug.enabled('workflow:static:keep'));
console.log('enabled_skip', atkDebug.enabled('workflow:static:skip'));

atkDebug.disable();
atkDebug.setDevOnly(true);
