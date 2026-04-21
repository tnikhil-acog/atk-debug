import debug from '../src/index.ts';

type CreatedUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

const log = debug('workflow:user:create');
const validationLog = log.extend('validation');
const serviceLog = log.extend('service');

function createUser(name: string, email: string): CreatedUser {
  validationLog('Validating incoming user payload for email=%s', email);
  serviceLog('createUser start name=%s email=%s', name, email);

  const user: CreatedUser = {
    id: Math.floor(Math.random() * 10000),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  serviceLog('createUser done user=%O', user);
  return user;
}

const user = createUser('Nikhil', 'nikhil@example.com');
log('User created successfully id=%d', user.id);
