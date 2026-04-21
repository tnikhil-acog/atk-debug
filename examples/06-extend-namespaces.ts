import atkDebug from '../src/index.ts';

const base = atkDebug('workflow:auth');
const login = base.extend('login');
const refresh = base.extend('refresh');
const audit = base.extend('audit');

function loginFlow(username: string): string {
  login('Login flow started for username=%s', username);
  const token = `${username}-token-${Date.now()}`;
  login('Token issued (preview): %s***', token.slice(0, 6));
  audit('Issued token for user=%s tokenLength=%d', username, token.length);
  return token;
}

function refreshFlow(token: string): string {
  refresh('Refresh requested for token prefix=%s', token.slice(0, 6));
  const newToken = `${token}-r1`;
  refresh('Refresh complete, new token prefix=%s', newToken.slice(0, 6));
  audit('Refresh completed oldLength=%d newLength=%d', token.length, newToken.length);
  return newToken;
}

const token = loginFlow('nikhil');
const newToken = refreshFlow(token);
base('Auth flow completed tokenSizes old=%d new=%d', token.length, newToken.length);
