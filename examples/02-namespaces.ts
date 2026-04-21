import debug from '../src/index.ts';

type UserRecord = {
  id: number;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
};

const requestLog = debug('workflow:http:request');
const repoLog = debug('workflow:data:user-repo');
const responseLog = debug('workflow:http:response');

function fakeQuery(userId: number): UserRecord {
  repoLog('Preparing query for userId=%d', userId);
  const row: UserRecord = { id: userId, role: 'admin', active: true };
  repoLog('Query result row: %O', row);
  return row;
}

function handleRequest(path: string, userId: number): { ok: true; user: UserRecord } {
  requestLog('Incoming request path=%s userId=%d', path, userId);
  const user = fakeQuery(userId);
  responseLog('Sending response for user=%O', user);
  return { ok: true, user };
}

const response = handleRequest('/users/42', 42);
responseLog('Request completed: %O', response);
