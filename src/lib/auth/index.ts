import { getCookie } from '@tanstack/react-start/server';
import { jwtVerify } from 'jose';

export async function getSession(): Promise<{ email: string } | null> {
  try {
    const sessionToken = getCookie('session');
    if (!sessionToken) {
      return null;
    }

    const { payload } = await jwtVerify(
      sessionToken,
      new TextEncoder().encode(process.env.AUTH_SECRET)
    );
    return payload as {
      email: string;
    };
  } catch {
    return null;
  }
}
