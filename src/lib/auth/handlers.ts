import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '.';
import {
  createSessionToken,
  exchangeGithubCodeForToken,
  getGithubUser,
  isAdmin,
} from './utils';

export async function handleLogin(request: NextRequest) {
  const session = await getSession();

  if (session) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/callback/github`;

  const state = crypto.randomUUID();
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');

  githubAuthUrl.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID!);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('state', state);
  githubAuthUrl.searchParams.set('scope', 'read:user user:email');

  const response = NextResponse.redirect(githubAuthUrl);
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
  });

  return response;
}

export async function handleGithubCallback(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  function redirectToLogin(error: string) {
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('error', error);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('oauth_state');
    return response;
  }

  if (error) {
    return redirectToLogin(error);
  }

  if (!code || !state) {
    return redirectToLogin('missing_parameters');
  }

  const storedState = request.cookies.get('oauth_state')?.value;
  if (!storedState || storedState !== state) {
    return redirectToLogin('invalid_state');
  }

  const redirectUri = `${origin}/api/auth/callback/github`;

  const tokenData = await exchangeGithubCodeForToken(code, redirectUri);
  const userData = await getGithubUser(tokenData.access_token);

  if (!isAdmin(userData.email)) {
    return redirectToLogin('not_authorized');
  }

  const response = NextResponse.redirect(new URL('/', origin));

  const sessionToken = await createSessionToken({ email: userData.email });
  response.cookies.delete('oauth_state');
  response.cookies.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
