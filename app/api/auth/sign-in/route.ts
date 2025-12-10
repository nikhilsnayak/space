import { NextRequest, NextResponse } from 'next/server';

import { getGithubAuthUrl } from '~/lib/auth';

export async function POST(request: NextRequest) {
  const redirectUri = `${request.nextUrl.origin}/api/auth/callback/github`;

  const githubAuthUrl = getGithubAuthUrl(redirectUri);
  const state = githubAuthUrl.searchParams.get('state')!;

  const response = NextResponse.json({ redirectUrl: githubAuthUrl.toString() });
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
  });

  return response;
}
