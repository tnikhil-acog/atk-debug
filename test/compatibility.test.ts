import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import debug from '../src/index.ts';

describe('core debug compatibility', () => {
  test('default export is callable and returns debugger', () => {
    const logger = debug('compat:callable');
    assert.equal(typeof logger, 'function');
    assert.equal(logger.namespace, 'compat:callable');
  });

  test('static enable/disable/enabled passthrough works', () => {
    debug.setDevOnly(false);
    debug.disable();
    debug.enable('compat:static');

    assert.equal(debug.enabled('compat:static'), true);

    const disabled = debug.disable();
    assert.equal(typeof disabled, 'string');
    assert.equal(debug.enabled('compat:static'), false);

    debug.setDevOnly(true);
  });

  test('devOnly is configurable', () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    debug.enable('compat:prod');
    assert.equal(debug.enabled('compat:prod'), false);

    debug.setDevOnly(false);
    debug.enable('compat:prod');
    assert.equal(debug.enabled('compat:prod'), true);

    debug.setDevOnly(true);
    debug.disable();

    process.env.NODE_ENV = previousNodeEnv;
  });

  test('extend preserves logger output override inheritance', () => {
    const lines: string[] = [];

    debug.setDevOnly(false);
    debug.enable('compat:extend*');

    const base = debug('compat:extend');
    base.log = (...args: unknown[]) => {
      lines.push(args.map((arg) => String(arg)).join(' '));
    };

    const child = base.extend('child');
    child('extended log %d', 1);

    assert.equal(lines.length > 0, true);
    assert.equal(lines.some((line) => line.includes('compat:extend:child')), true);
    assert.equal(lines.some((line) => line.includes('extended log %d')), true);
    assert.equal(lines.some((line) => line.includes(' 1 ')), true);

    debug.disable();
    debug.setDevOnly(true);
  });
});
