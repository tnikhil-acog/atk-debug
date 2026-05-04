import debug from '../src/index.ts';

type CreatedUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

const trace = debug('workflow:user:create');
const validationTrace = trace.extend('validation');
const serviceTrace = trace.extend('service');

function createUser(name: string, email: string): CreatedUser {
  validationTrace('Validating incoming user payload for email=%s', email);
  serviceTrace('createUser start name=%s email=%s', name, email);

  const user: CreatedUser = {
    id: Math.floor(Math.random() * 10000),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  serviceTrace('createUser done user=%O', user);
  return user;
}

const user = createUser('Nikhil', 'nikhil@example.com');
trace('User created successfully id=%d', user.id);
