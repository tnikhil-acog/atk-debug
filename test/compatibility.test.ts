import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import atkDebug from '../src/index.ts';

describe('core debug compatibility', () => {
  test('default export is callable and returns debugger', () => {
    const logger = atkDebug('compat:callable');
    assert.equal(typeof logger, 'function');
    assert.equal(logger.namespace, 'compat:callable');
  });

  test('static enable/disable/enabled passthrough works', () => {
    atkDebug.setDevOnly(false);
    atkDebug.disable();
    atkDebug.enable('compat:static');

    assert.equal(atkDebug.enabled('compat:static'), true);

    const disabled = atkDebug.disable();
    assert.equal(typeof disabled, 'string');
    assert.equal(atkDebug.enabled('compat:static'), false);

    atkDebug.setDevOnly(true);
  });

  test('devOnly is configurable', () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    atkDebug.enable('compat:prod');
    assert.equal(atkDebug.enabled('compat:prod'), false);

    atkDebug.setDevOnly(false);
    atkDebug.enable('compat:prod');
    assert.equal(atkDebug.enabled('compat:prod'), true);

    atkDebug.setDevOnly(true);
    atkDebug.disable();

    process.env.NODE_ENV = previousNodeEnv;
  });

  test('extend preserves logger output override inheritance', () => {
    const lines: string[] = [];

    atkDebug.setDevOnly(false);
    atkDebug.enable('compat:extend*');

    const base = atkDebug('compat:extend');
    base.log = (...args: unknown[]) => {
      lines.push(args.map((arg) => String(arg)).join(' '));
    };

    const child = base.extend('child');
    child('extended log %d', 1);

    assert.equal(lines.length > 0, true);
    assert.equal(lines.some((line) => line.includes('compat:extend:child')), true);
    assert.equal(lines.some((line) => line.includes('extended log %d')), true);
    assert.equal(lines.some((line) => line.includes(' 1 ')), true);

    atkDebug.disable();
    atkDebug.setDevOnly(true);
  });
});
