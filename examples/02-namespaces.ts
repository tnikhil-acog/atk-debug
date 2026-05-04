import debug from '../src/index.ts';

type UserRecord = {
  id: number;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
};

const requestTrace = debug('workflow:http:request');
const repoTrace = debug('workflow:data:user-repo');
const responseTrace = debug('workflow:http:response');

function fakeQuery(userId: number): UserRecord {
  repoTrace('Preparing query for userId=%d', userId);
  const row: UserRecord = { id: userId, role: 'admin', active: true };
  repoTrace('Query result row: %O', row);
  return row;
}

function handleRequest(path: string, userId: number): { ok: true; user: UserRecord } {
  requestTrace('Incoming request path=%s userId=%d', path, userId);
  const user = fakeQuery(userId);
  responseTrace('Sending response for user=%O', user);
  return { ok: true, user };
}

const response = handleRequest('/users/42', 42);
responseTrace('Request completed: %O', response);
