import atkDebug from '../src/index.ts';

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

const bootstrapLog = atkDebug('workflow:bootstrap:init');
const healthLog = atkDebug('workflow:bootstrap:health');

function bootServer(config: BootConfig): ServerState {
  bootstrapLog('Boot requested with config: %O', config);

  const checks = ['env', 'ports', 'cache'];
  for (const check of checks) {
    healthLog('Running preflight check: %s', check);
  }

  const serverState: ServerState = {
    startedAt: new Date().toISOString(),
    host: config.host,
    port: config.port,
    env: config.env,
    ok: true,
  };

  bootstrapLog('Server started: %O', serverState);
  healthLog('Health checks passed for %s:%d', serverState.host, serverState.port);
  return serverState;
}

const result = bootServer({ host: 'localhost', port: 3000, env: 'dev' });
bootstrapLog('Final state snapshot: %O', result);
