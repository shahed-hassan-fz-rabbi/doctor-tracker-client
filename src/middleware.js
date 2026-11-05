import { NextResponse } from 'next/server';

/** Keep the public homepage reachable; protected routes use AuthGuard. */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
