import { SignJWT } from 'jose';

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
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
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
  return email === process.env.ADMIN_EMAIL!;
}

export async function createSessionToken(payload: { email: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET!));

  return token;
}
