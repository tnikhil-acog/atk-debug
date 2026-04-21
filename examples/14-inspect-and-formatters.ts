import atkDebug from '../src/index.ts';

atkDebug.setDevOnly(false);
atkDebug.enable('workflow:inspect:*');

atkDebug.formatters.h = (value: unknown) => Buffer.from(String(value)).toString('hex');
atkDebug.inspectOpts = {
  ...(atkDebug.inspectOpts ?? {}),
  depth: 1,
  colors: false,
};

const inspectLog = atkDebug('workflow:inspect:demo');
inspectLog('custom formatter %h', 'hello');
inspectLog('object preview %O', { deep: { nested: { value: 1 } }, arr: [1, 2, 3] });

console.log('select_color_type', typeof atkDebug.selectColor('workflow:inspect:demo'));
console.log('humanized_1500', atkDebug.humanize(1500));

atkDebug.disable();
atkDebug.setDevOnly(true);
