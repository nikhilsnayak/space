import { NextRequest, NextResponse } from 'next/server';

import {
  createSessionToken,
  exchangeGithubCodeForToken,
  getGithubUser,
  isAdmin,
} from '~/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/login?error=missing_parameters', request.url)
    );
  }

  const storedState = request.cookies.get('oauth_state')?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL('/login?error=invalid_state', request.url)
    );
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/callback/github`;
  const tokenData = await exchangeGithubCodeForToken(code, redirectUri);
  const userData = await getGithubUser(tokenData.access_token);

  if (!isAdmin(userData.email)) {
    return NextResponse.redirect(
      new URL('/login?error=not_authorized', request.url)
    );
  }

  const sessionToken = await createSessionToken({ email: userData.email });

  const response = NextResponse.redirect(new URL('/', request.url));

  response.cookies.delete('oauth_state');

  response.cookies.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
