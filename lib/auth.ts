import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Elysia } from 'elysia';
import { jwtVerify, SignJWT } from 'jose';

const AUTH_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

function getGithubAuthUrl(redirectUri: string) {
  const state = crypto.randomUUID();
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', GITHUB_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'read:user user:email');
  return url;
}

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

export const authController = new Elysia({ prefix: '/auth' })
  .get('/sign-in', (ctx) => {
    const { origin } = new URL(ctx.request.url);
    const redirectUri = `${origin}/api/auth/callback/github`;

    const githubAuthUrl = getGithubAuthUrl(redirectUri);
    const state = githubAuthUrl.searchParams.get('state')!;

    ctx.cookie['oauth_state'].set({
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
    });

    return ctx.redirect(githubAuthUrl.toString());
  })
  .get('/callback/github', async (ctx) => {
    const { code, state, error } = ctx.query;

    if (error) {
      return ctx.redirect(`/login?error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return ctx.redirect('/login?error=missing_parameters');
    }

    const storedState = ctx.cookie['oauth_state'].value;
    if (!storedState || storedState !== state) {
      return ctx.redirect('/login?error=invalid_state');
    }
    const { origin } = new URL(ctx.request.url);
    const redirectUri = `${origin}/api/auth/callback/github`;

    const tokenData = await exchangeGithubCodeForToken(code, redirectUri);
    const userData = await getGithubUser(tokenData.access_token);

    if (!isAdmin(userData.email)) {
      return ctx.redirect('/login?error=not_authorized');
    }

    const sessionToken = await createSessionToken({ email: userData.email });

    ctx.cookie['oauth_state'].remove();
    ctx.cookie['session'].set({
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return ctx.redirect('/');
  });
