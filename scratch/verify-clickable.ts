
import debug from '../src/index.ts';

debug.enable('test');

console.log('--- DEFAULT (NON-CLICKABLE) ---');
const log1 = debug('test');
log1('This should be normal [index.ts:line]');

console.log('\n--- CLICKABLE ENABLED ---');
debug.setClickable(true);
const log2 = debug('test');
log2('This should be clickable in supported terminals!');
console.log('(In VS Code, cmd+click the metadata above)');

console.log('\n--- CLICKABLE DISABLED AGAIN ---');
debug.setClickable(false);
log2('This should be back to normal');
