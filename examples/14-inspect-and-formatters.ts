import debug from '../src/index.ts';

debug.setDevOnly(false);
debug.enable('workflow:inspect:*');

debug.formatters.h = (value: unknown) => Buffer.from(String(value)).toString('hex');
debug.inspectOpts = {
  ...(debug.inspectOpts ?? {}),
  depth: 1,
  colors: false,
};

const inspectLog = debug('workflow:inspect:demo');
inspectLog('custom formatter %h', 'hello');
inspectLog('object preview %O', { deep: { nested: { value: 1 } }, arr: [1, 2, 3] });

console.log('select_color_type', typeof debug.selectColor('workflow:inspect:demo'));
console.log('humanized_1500', debug.humanize(1500));

debug.disable();
debug.setDevOnly(true);
