import debug from '../src/index.ts';

const indexerTrace = debug('workflow:jobs:indexer');
const validatorTrace = debug('workflow:jobs:validator');

const redirectedLines: string[] = [];

const redirectWriter = (...args: unknown[]): void => {
  const line = args.map((arg) => String(arg)).join(' ');
  redirectedLines.push(line);
  console.log('[REDIRECTED]', line);
};

indexerTrace.log = redirectWriter;
validatorTrace.log = redirectWriter;

function runWorkflow(task: string): void {
  indexerTrace('Workflow start task=%s', task);
  validatorTrace('Workflow validation status=%s task=%s', 'ok', task);
  indexerTrace('Workflow complete task=%s', task);
}

runWorkflow('indexing');
runWorkflow('cleanup');

console.log('Redirected line count:', redirectedLines.length);
