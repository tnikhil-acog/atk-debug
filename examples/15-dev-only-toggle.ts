import atkDebug from '../src/index.ts';

const previousEnv = process.env.NODE_ENV;

process.env.NODE_ENV = 'production';
atkDebug.setDevOnly(true);
atkDebug.enable('workflow:devonly:*');

const devOnlyLog = atkDebug('workflow:devonly:demo');
devOnlyLog('hidden_in_prod');
console.log('enabled_with_devonly', atkDebug.enabled('workflow:devonly:demo'));

atkDebug.setDevOnly(false);
atkDebug.enable('workflow:devonly:*');
devOnlyLog('visible_with_override');
console.log('enabled_with_override', atkDebug.enabled('workflow:devonly:demo'));

atkDebug.disable();
atkDebug.setDevOnly(true);
process.env.NODE_ENV = previousEnv;
