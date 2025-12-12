import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server';
import { jwtVerify, SignJWT } from 'jose';

const AUTH_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

async function exchangeGithubCodeForToken(code: string, redirectUri: string) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      code,
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();
  return data as {
    access_token: string;
    scope: string;
    token_type: string;
  };
}

async function getGithubUser(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data as {
    email: string;
  };
}

export function isAdmin(email: string) {
  return email === ADMIN_EMAIL;
}

async function createSessionToken(payload: { email: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(AUTH_SECRET);

  return token;
}

export async function getSession(): Promise<{ email: string } | null> {
  try {
    const sessionToken = getCookie('session');
    if (!sessionToken) {
      return null;
    }

    const { payload } = await jwtVerify(sessionToken, AUTH_SECRET);
    return payload as {
      email: string;
    };
  } catch {
    return null;
  }
}

export function handleLogin({ request }: { request: Request }) {
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/callback/github`;

  const state = crypto.randomUUID();
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');

  githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
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

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw redirect({ to: '/login' });
  }
  return next();
});

export const loginMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession();
  if (session) {
    throw redirect({ to: '/' });
  }
  return next();
});
