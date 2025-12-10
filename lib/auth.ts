import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify, SignJWT } from 'jose';

if (
  !process.env.AUTH_SECRET ||
  !process.env.GITHUB_CLIENT_ID ||
  !process.env.GITHUB_CLIENT_SECRET ||
  !process.env.ADMIN_EMAIL
) {
  throw new Error(
    'AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and ADMIN_EMAIL must be set'
  );
}

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const AUTH_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export function getGithubAuthUrl(redirectUri: string) {
  const state = crypto.randomUUID();
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', GITHUB_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'read:user user:email');
  return url;
}

export async function exchangeGithubCodeForToken(
  code: string,
  redirectUri: string
) {
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

export async function getGithubUser(accessToken: string) {
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
  return email === process.env.ADMIN_EMAIL;
}

export async function createSessionToken(payload: { email: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(AUTH_SECRET);

  return token;
}

async function verifySessionToken(token: string): Promise<{
  email: string;
} | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET);
    return payload as {
      email: string;
    };
  } catch {
    return null;
  }
}

export async function ensureSession() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) {
    redirect('/login');
  }

  const session = await verifySessionToken(sessionToken);
  if (!session) {
    redirect('/login');
  }

  return session;
}
