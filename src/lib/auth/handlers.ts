import { redirect } from '@tanstack/react-router';
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server';

import {
  createSessionToken,
  exchangeGithubCodeForToken,
  getGithubUser,
  isAdmin,
} from './utils';

export function handleLogin({ request }: { request: Request }) {
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/callback/github`;

  const state = crypto.randomUUID();
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');

  githubAuthUrl.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID!);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('state', state);
  githubAuthUrl.searchParams.set('scope', 'read:user user:email');

  setCookie('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
  });

  return redirect({ href: githubAuthUrl.toString() });
}

export async function handleGithubCallback({ request }: { request: Request }) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  function redirectToLogin(error: string) {
    deleteCookie('oauth_state');
    return redirect({ to: '/login', search: { error } });
  }

  if (error) {
    return redirectToLogin(error);
  }

  if (!code || !state) {
    return redirectToLogin('missing_parameters');
  }

  const storedState = getCookie('oauth_state');
  if (!storedState || storedState !== state) {
    return redirectToLogin('invalid_state');
  }

  const redirectUri = `${origin}/api/auth/callback/github`;

  const tokenData = await exchangeGithubCodeForToken(code, redirectUri);
  const userData = await getGithubUser(tokenData.access_token);

  if (!isAdmin(userData.email)) {
    return redirectToLogin('not_authorized');
  }

  const sessionToken = await createSessionToken({ email: userData.email });
  deleteCookie('oauth_state');
  setCookie('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return redirect({ to: '/' });
}
