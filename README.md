# Doctor Tracker Client

Doctor Tracker is an admin portal for managing doctor and patient records. It pairs a responsive healthcare dashboard and record workflows with operational analytics served by the separate Doctor Tracker Express API.

## Features

- Admin login and session verification through an HttpOnly API cookie.
- Doctor and patient lists with search, filters, sorting and server pagination.
- Create, view, update and delete workflows, including doctor patient rosters.
- Dashboard and analytics charts backed by API aggregation results.
- Responsive navigation, reusable forms, tables, loading and empty states.

## Stack

Next.js App Router (JavaScript), React, Tailwind CSS, TanStack Query, React Hook Form, Zod, Recharts, Framer Motion and Lucide React.

## Local setup

1. Install Node.js 20 or newer.
2. In this repository, run `npm ci`.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to the Express API base URL (default `http://localhost:4000/api/v1`).
4. Start the backend separately, then run `npm run dev`.
5. Open `http://localhost:3000`. Create an admin using the backend's `seed:admin` script and its environment configuration.

## Environment

| Variable | Purpose | Local default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Versioned Express API base URL | `http://localhost:4000/api/v1` |

Never put credentials or private API secrets in `NEXT_PUBLIC_*`; Next.js exposes these values to the browser.

## Architecture

The browser renders the Next.js app and uses TanStack Query hooks to call `src/lib/api.js`. That shared HTTP client sends credentials with `fetch` and never stores JWTs in browser storage. The standalone Express service validates the HttpOnly cookie and reads/writes MongoDB. The Next.js app does not implement business API routes.

## Technical decisions

1. **Keep the API in a separate Express service.** This preserves independent client/server deployment and keeps authentication, validation and data rules in one REST API rather than coupling them to Next route handlers.
2. **Use TanStack Query for server state.** Query keys, mutation invalidation, loading/error states and cached results are centralized around API data. React Hook Form and Zod handle field state and client-side validation, while the API repeats validation at the trust boundary.

## Project layout

```text
src/app/          App Router pages
src/components/   Shared layout and UI components
src/features/     Doctor and patient forms and schemas
src/hooks/        Query and mutation hooks
src/lib/          API client and helpers
src/providers/    Query and toast providers
src/styles/       Global styles and design tokens
```

## Checks

- `npm test` — Vitest component, schema and utility tests.
- `npm run build` — optimized Next.js production build.

## Deployment

Deploy this repository to Vercel and set `NEXT_PUBLIC_API_URL` to the deployed Express API's `/api/v1` base URL. Configure the server's CORS allowlist for the exact frontend origin and its secure cookie settings for production. A live deployment has not been configured from this repository.

## Visual evidence

Desktop and mobile screenshots have not yet been captured. Add genuine screenshots here after running the app at both viewport sizes; no deployment URLs or screenshots are implied by this README.
