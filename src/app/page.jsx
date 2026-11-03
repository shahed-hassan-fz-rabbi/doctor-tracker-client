import { redirect } from 'next/navigation';

export default function Home() {
  // The SPA entry point always moves to the dashboard;
  // AuthGuard bounces unauthenticated visitors to /login.
  redirect('/dashboard');
}
