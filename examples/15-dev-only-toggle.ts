import debug from '../src/index.ts';

const previousEnv = process.env.NODE_ENV;

process.env.NODE_ENV = 'production';
debug.setDevOnly(true);
debug.enable('workflow:devonly:*');

const devOnlyLog = debug('workflow:devonly:demo');
devOnlyLog('hidden_in_prod');
console.log('enabled_with_devonly', debug.enabled('workflow:devonly:demo'));

debug.setDevOnly(false);
debug.enable('workflow:devonly:*');
devOnlyLog('visible_with_override');
console.log('enabled_with_override', debug.enabled('workflow:devonly:demo'));

debug.disable();
debug.setDevOnly(true);
process.env.NODE_ENV = previousEnv;
