# Doctor Tracker — Client

This is the web dashboard for Doctor Tracker. It gives administrators one place to manage doctor and patient records, follow doctor-patient assignments, and review the practice dashboard and analytics.

The client is a Next.js app. It gets its data from the separate Express API; it does not connect to MongoDB directly.

## Screenshots

These screenshots show the interface using development data.

| Dashboard | Doctors |
|---|---|
| ![Doctor Tracker dashboard on desktop](docs/screenshots/dashboard-desktop.png) | ![Doctor list on desktop](docs/screenshots/doctors-desktop.png) |

| Patients | Analytics |
|---|---|
| ![Patient list on desktop](docs/screenshots/patients-desktop.png) | ![Analytics page](docs/screenshots/analytics-desktop.png) |

| Dashboard on mobile | Patients on mobile |
|---|---|
| ![Doctor Tracker dashboard on a mobile screen](docs/screenshots/dashboard-mobile.png) | ![Patient list on a mobile screen](docs/screenshots/patients-mobile.png) |

More views are available in [`docs/screenshots`](docs/screenshots), including the login page, doctor details, and the not-found page.

## What’s included

- Admin sign-in with an HttpOnly session cookie.
- Doctor and patient lists with search, filters, sorting, and server-side pagination.
- Create, edit, view, and delete workflows, including doctor-patient assignments.
- Dashboard metrics and analytics charts from the API.
- Responsive navigation, forms, tables, and empty and error states.

## Built with

Next.js App Router, JavaScript, React, Tailwind CSS, TanStack Query, React Hook Form, Zod, Recharts, Framer Motion, and Lucide React.

## Run locally

You’ll need Node.js 20 or newer and the Doctor Tracker API running separately.

```bash
npm ci
```

Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_API_URL` to the API base URL, including `/api/v1`. For a local API, use:

```text
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Then start the app:

```bash
npm run dev
```

Open `http://localhost:3000`. The API must allow that exact origin in `CORS_ORIGINS`. If Next.js selects another port because 3000 is busy, allow that origin too.

## Configuration

| Variable | What it’s for | Local example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | The versioned Express API base URL | `http://localhost:4000/api/v1` |

This value is visible in the browser, so keep credentials and private keys out of `NEXT_PUBLIC_*` variables.

## How sign-in works

The browser calls the Express API through `src/lib/api.js`. Requests include credentials so the browser can send the HttpOnly JWT cookie. The client does not put the token in local storage. `AuthGuard` checks `/auth/me` before showing protected pages.

## Checks

```bash
npm test
npm run build
```

## Deploy to Vercel

Import `shahed-hassan-fz-rabbi/doctor-tracker-client` and deploy the `main` branch. Use the Next.js preset and repository root (`.`); `npm ci` and `npm run build` are the install and build commands. Leave the output directory at Vercel’s Next.js default.

Set `NEXT_PUBLIC_API_URL` for Production to the Render API URL ending in `/api/v1`. The current production API base is `https://doctor-tracker-server-29dm.onrender.com/api/v1`. After Vercel gives you the frontend domain, add that exact origin to the backend’s `CORS_ORIGINS` setting. If you use Preview deployments, configure their API URL and allow only the exact preview origins. Keep both services on HTTPS so the session cookie can be sent securely.

The actual Vercel domain is managed in Vercel; don’t copy an example hostname from this README as if it were your project’s domain.
