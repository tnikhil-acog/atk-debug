import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { describe, test } from 'node:test';
import path from 'node:path';

type SnippetCase = {
  name: string;
  file: string;
  env?: Record<string, string>;
  mustInclude: string[];
};

const cwd = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function runSnippet(file: string, env: Record<string, string> = {}): {
  exitCode: number;
  output: string;
} {
  const proc = spawnSync('bun', [`examples/${file}`], {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf-8',
  });

  const output = `${proc.stdout ?? ''}${proc.stderr ?? ''}`;

  return {
    exitCode: proc.status ?? 1,
    output,
  };
}

const cases: SnippetCase[] = [
  {
    name: '01 basic usage',
    file: '01-basic-usage.ts',
    env: { DEBUG: 'workflow:bootstrap:*' },
    mustInclude: ['workflow:bootstrap:init', 'Final state snapshot'],
  },
  {
    name: '02 namespaces',
    file: '02-namespaces.ts',
    env: { DEBUG: 'workflow:http:*,workflow:data:*' },
    mustInclude: ['workflow:http:request', 'workflow:data:user-repo'],
  },
  {
    name: '03 structured logging',
    file: '03-structured-logging.ts',
    env: { DEBUG: 'workflow:user-ingest:*' },
    mustInclude: ['workflow:user-ingest:payload', 'Structured user object ready'],
  },
  {
    name: '04 measuring time',
    file: '04-measuring-time.ts',
    env: { DEBUG: 'workflow:perf:*' },
    mustInclude: ['workflow:perf:step', 'All steps complete'],
  },
  {
    name: '05 conditional debug',
    file: '05-conditional-debug.ts',
    env: { DEBUG: 'workflow:compute:*' },
    mustInclude: ['workflow:compute:trace', 'Final outcome'],
  },
  {
    name: '06 extend namespaces',
    file: '06-extend-namespaces.ts',
    env: { DEBUG: 'workflow:auth*' },
    mustInclude: ['workflow:auth:login', 'workflow:auth:audit'],
  },
  {
    name: '07 dynamic enable disable',
    file: '07-dynamic-enable-disable.ts',
    mustInclude: ['Enabled all runtime namespaces', 'DB logs now enabled too'],
  },
  {
    name: '08 redirect output',
    file: '08-redirect-output.ts',
    env: { DEBUG: 'workflow:jobs:*' },
    mustInclude: ['[REDIRECTED]', 'Redirected line count: 6'],
  },
  {
    name: '09 custom formatter',
    file: '09-custom-formatter.ts',
    env: { DEBUG: 'workflow:events:*' },
    mustInclude: ['Hex message:', 'Compact JSON:'],
  },
  {
    name: '10 wrapper usage',
    file: '10-using-wrapper.ts',
    env: { DEBUG: 'workflow:user:create*' },
    mustInclude: ['workflow:user:create:service', 'User created successfully'],
  },
  {
    name: '11 default callable compat',
    file: '11-default-callable-compat.ts',
    mustInclude: ['workflow:compat:auth', 'compat_enabled true'],
  },
  {
    name: '12 static controls',
    file: '12-static-controls.ts',
    mustInclude: ['workflow:static:keep', 'enabled_keep true', 'enabled_skip false'],
  },
  {
    name: '13 global log override',
    file: '13-global-log-override.ts',
    mustInclude: ['[GLOBAL_STREAM]', 'captured_count 2'],
  },
  {
    name: '14 inspect and formatters',
    file: '14-inspect-and-formatters.ts',
    mustInclude: ['custom formatter 68656c6c6f', 'humanized_1500 2s'],
  },
  {
    name: '15 dev only toggle',
    file: '15-dev-only-toggle.ts',
    mustInclude: ['enabled_with_devonly false', 'enabled_with_override true', 'visible_with_override'],
  },
];

describe('debug snippet integration', () => {
  for (const c of cases) {
    test(c.name, () => {
      const { exitCode, output } = runSnippet(c.file, c.env);

      assert.equal(exitCode, 0);
      for (const expected of c.mustInclude) {
        assert.ok(output.includes(expected), `Expected output to include: ${expected}`);
      }
    });
  }
});
