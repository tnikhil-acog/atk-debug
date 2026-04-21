import atkDebug from '../src/index.ts';

const indexerLog = atkDebug('workflow:jobs:indexer');
const validatorLog = atkDebug('workflow:jobs:validator');

const redirectedLines: string[] = [];

const redirectWriter = (...args: unknown[]): void => {
  const line = args.map((arg) => String(arg)).join(' ');
  redirectedLines.push(line);
  console.log('[REDIRECTED]', line);
};

indexerLog.log = redirectWriter;
validatorLog.log = redirectWriter;

function runWorkflow(task: string): void {
  indexerLog('Workflow start task=%s', task);
  validatorLog('Workflow validation status=%s task=%s', 'ok', task);
  indexerLog('Workflow complete task=%s', task);
}

runWorkflow('indexing');
runWorkflow('cleanup');

console.log('Redirected line count:', redirectedLines.length);
