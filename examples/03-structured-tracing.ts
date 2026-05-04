import debug from '../src/index.ts';

type RawUserInput = {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  token?: string;
};

type SanitizedUser = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  safeTokenPreview: string | null;
};

const ingestTrace = debug('workflow:user-ingest:payload');
const sanitizeTrace = debug('workflow:user-ingest:sanitize');

function sanitizeUser(input: RawUserInput): SanitizedUser {
  const user = {
    id: input.id,
    name: input.name,
    email: input.email,
    roles: input.roles ?? ['viewer'],
    safeTokenPreview: input.token ? `${input.token.slice(0, 4)}***` : null,
  };

  sanitizeTrace('Sanitized user: %O', user);
  return user;
}

const raw: RawUserInput = {
  id: 1,
  name: 'Nikhil',
  email: 'nikhil@example.com',
  roles: ['editor', 'owner'],
  token: 'abc123token',
};

ingestTrace('Raw payload received: %O', { ...raw, token: '[hidden]' });
const user = sanitizeUser(raw);
sanitizeTrace('Structured user object ready: %O', user);
