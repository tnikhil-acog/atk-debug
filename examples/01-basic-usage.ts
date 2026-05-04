import debug from '../src/index.ts';

type BootConfig = {
  host: string;
  port: number;
  env: 'dev' | 'staging' | 'prod';
};

type ServerState = {
  startedAt: string;
  host: string;
  port: number;
  env: BootConfig['env'];
  ok: boolean;
};

const bootstrapTrace = debug('workflow:bootstrap:init');
const healthTrace = debug('workflow:bootstrap:health');

function bootServer(config: BootConfig): ServerState {
  bootstrapTrace('Boot requested with config: %O', config);

  const checks = ['env', 'ports', 'cache'];
  for (const check of checks) {
    healthTrace('Running preflight check: %s', check);
  }

  const serverState: ServerState = {
    startedAt: new Date().toISOString(),
    host: config.host,
    port: config.port,
    env: config.env,
    ok: true,
  };

  bootstrapTrace('Server started: %O', serverState);
  healthTrace('Health checks passed for %s:%d', serverState.host, serverState.port);
  return serverState;
}

const result = bootServer({ host: 'localhost', port: 3000, env: 'dev' });
bootstrapTrace('Final state snapshot: %O', result);
