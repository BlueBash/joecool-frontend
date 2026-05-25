# Joe Cool — Frontend

Web application for **Joe Cool** inventory and business operations: stock, addresses, orders, transactions, operators, timekeeping, reports, and platform settings. It talks to the Joe Cool platform API (JSON over HTTP) and is built as a single-page app with React and Vite.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, TypeScript |
| Build / dev server | [Vite](https://vite.dev/) 7 |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based routes under `src/routes/`) |
| Server state | [TanStack Query](https://tanstack.com/query) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| HTTP | Axios (`src/api/_client/`) |
| Styling | Tailwind CSS 4, [Radix UI](https://www.radix-ui.com/) primitives, shadcn-style components in `src/components/ui/` |
| Client state | Zustand (auth and UI preferences in `src/store/`) |

**Node:** `>= 20.19.0` (see `package.json` `engines`).

## Prerequisites

- **Node.js** 20.19 or newer
- **npm** (repo includes `package-lock.json`; use `npm ci` for a clean install)
- **Backend API** running locally (this app expects the platform API on port **3000** by default; see [Backend](#backend-api))

## Quick start

```bash
# Clone and enter the repo
cd joe_cool_fe

# Install dependencies
npm ci

# Configure API (see Environment variables)
cp .env.example .env.local   # then edit values

# Start dev server (default http://localhost:5173)
npm run dev
```

Open the URL Vite prints in the terminal. Sign in with credentials from your backend environment. Unauthenticated users are redirected to `/login`.

## Environment variables

Vite only exposes variables prefixed with `VITE_`. Create **`.env.local`** in the project root (ignored via `*.local` in `.gitignore`).

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_ROOT` | Yes* | Full origin for API requests, no trailing slash. Example: `http://localhost:3000` or `http://localhost:5173` when using the dev proxy (see below). |
| `VITE_API_PROTOCOL` | Alt* | With `VITE_API_DOMAIN`, builds API host as `{protocol}{subdomain}.{domain}` where `subdomain` is the first label of `window.location.hostname` (multi-tenant deployments). |
| `VITE_API_DOMAIN` | Alt* | e.g. `example.com` — used with `VITE_API_PROTOCOL` instead of `VITE_API_ROOT`. |
\* Set **`VITE_API_ROOT`**, **or** both **`VITE_API_PROTOCOL`** and **`VITE_API_DOMAIN`**. If neither is valid, the app throws at startup (`src/app/env.ts`).

All authenticated API calls use:

```text
{apiRoot}/api/v1/platform/...
```

Example `.env.local` for local development (backend on port 3000):

```env
VITE_API_ROOT=http://localhost:3000
```

### Dev server proxy

`vite.config.ts` proxies `/api` to `http://localhost:3000`. If you point `VITE_API_ROOT` at the Vite origin (e.g. `http://localhost:5173`), browser requests go through Vite and are forwarded to the backend, which can avoid CORS issues during development.

## Backend API

This repository is **frontend only**. Platform endpoints are consumed under `/api/v1/platform`. A sibling Rails backend often lives in `joecool_backend` in the same monorepo folder; start that service on port **3000** (or update `VITE_API_ROOT` and the Vite proxy `target` to match your setup).

The HTTP client (`src/api/_client/http.ts`):

- Sends `Authorization` from stored access token after login
- On **401**, clears auth and redirects to `/login`
- Surfaces API error messages via toast notifications

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Build with Vite `development` mode |
| `npm run preview` | Serve production build locally |
| `npm run lint` | ESLint across the project |
| `npm run format` | Prettier write |

## Application areas

Main routes (see `src/lib/config/paths.ts` for the full list):

| Path | Feature |
|------|---------|
| `/dashboard` | Home dashboard (default redirect from `/`) |
| `/stocks`, `/stock/:id` | Stock list and edit |
| `/addresses`, `/address/:id` | Addresses / customers |
| `/orders`, `/order/:id` | Orders |
| `/operators`, `/operator/:id` | Operators |
| `/transactions`, `/transactions/:id` | Transactions; invoice/payment flows |
| `/reports` | Reports |
| `/timekeeping` | Time keeping |
| `/settings/...` | Platform catalogs and configuration |
| `/login`, `/forgot-password`, `/reset-password` | Auth (no app shell) |

Auth guard logic lives in `src/routes/__root.tsx`: protected routes require a session in the Zustand auth store.

## Project structure

```text
joe_cool_fe/
├── index.html              # App shell, theme bootstrap
├── vite.config.ts          # Aliases, Tailwind, API proxy
├── src/
│   ├── main.tsx            # React entry
│   ├── app/                # Router, providers, env
│   ├── routes/             # TanStack route modules
│   ├── routeTree.gen.ts    # Generated route tree (update when adding routes)
│   ├── features/           # Page-level UI by domain (stock, orders, settings, …)
│   ├── components/         # Shared UI and form fields
│   ├── api/                # API modules and HTTP client
│   ├── hooks/              # Shared React hooks
│   ├── lib/                # Config, form helpers, reference data utilities
│   └── store/              # Zustand stores (auth, UI)
```

**Path alias:** `@/` → `src/` (TypeScript and Vite).

## Working on the codebase

### Adding or changing routes

1. Add or edit a route file under `src/routes/` (pattern: `createFileRoute` / route exports).
2. Regenerate or update `src/routeTree.gen.ts` so imports match your routes (file header documents this; the tree is checked in and listed in `.prettierignore`).
3. Add path constants in `src/lib/config/paths.ts` when you need typed navigation helpers.

### API layer

- Shared client: `src/api/_client/` (HTTP, errors, query client, auth storage).
- Domain modules: `src/api/<resource>/` (e.g. `stocks`, `auth`, `settings`).
- Re-exports: `src/api/index.ts`.

New endpoints should follow existing resource helpers in `_client` rather than calling Axios directly from features.

### UI components

Shared primitives live in `src/components/ui/`. Project uses the shadcn **new-york** style (`components.json`). Prefer existing form components under `src/components/form/` for consistent labels and validation.

### Quality checks

```bash
npm run lint
npm run format
```

Strict TypeScript is enabled in `tsconfig.json`.

## Production build

```bash
npm run build
```

Output is in `dist/`. Serve with any static host; configure `VITE_API_ROOT` (or protocol/domain pair) for the target API environment at **build time**.

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Blank app / startup error about API config | `.env.local` has `VITE_API_ROOT` or protocol + domain |
| Network errors / CORS in dev | Use `VITE_API_ROOT=http://localhost:5173` and ensure backend is on port 3000 for the proxy, or fix CORS on the API |
| 401 loop on login | Backend token format and login response; token is stored and sent as `Authorization` header |
| Route not found after adding files | `routeTree.gen.ts` out of sync with `src/routes/` |

## License

Private application — see repository owners for usage and distribution terms.
