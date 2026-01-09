import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { AUTH_SECRET } from './constants';

export async function getSession(): Promise<{ email: string } | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
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
