import { NextResponse } from 'next/server';

/** "/" simply points to the dashboard; unauthenticated users are then
 *  bounced to /login by AuthGuard. */
export function middleware(request) {
  return NextResponse.redirect(new URL('/dashboard', request.url));
}

export const config = {
  matcher: '/',
};
