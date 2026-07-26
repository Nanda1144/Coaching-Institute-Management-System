# Agent Context — EduManage Faculty Dashboard

## Architecture
- **Frontend**: React + Vite + TypeScript SPA (root directory)
- **Backend**: Express + Prisma + PostgreSQL (`backend/` directory)
- Frontend Axios instance (`src/services/api.ts`) uses `VITE_API_BASE_URL || '/api'` as base URL
- **Local dev**: Vite proxies `/api` → `http://localhost:5000` (see `vite.config.ts:8`)

## Deployment (Single Vercel Project)
Both frontend and backend are deployed together in one Vercel project:

- **Serverless function**: `api/index.ts` — imports Express app from `backend/src/app.ts`
- **Frontend static build**: Vite outputs to `dist/`
- **Build command** (in `vercel.json`): `npm run build:vercel`
  - Installs backend deps, generates Prisma client, compiles backend TS
  - Then builds frontend with Vite
- **Env vars** (set in Vercel dashboard):
  - `DATABASE_URL` — PostgreSQL connection string (Supabase)
  - `JWT_SECRET` — random secret string
  - `JWT_REFRESH_SECRET` — another random secret
  - `CORS_ORIGIN` — the Vercel deployment URL itself (e.g. `https://faculty-dashboard.vercel.app`)
  - `COOKIE_SECRET` — random secret
  - `VITE_API_BASE_URL` — leave empty (defaults to `/api` on same origin)

### How routing works
- `api/vercel.json` routes `/api/(.*)` → `api/index.ts` (Express serverless function)
- Everything else → `index.html` (SPA client-side routing)

## Critical Decisions & Fixes

### Mock adapter (disabled in production)
- **`src/services/api.ts`**: Mock only enabled when `VITE_USE_MOCK=true` or `VITE_API_BASE_URL=''`
- **Don't enable mock in production** — real backend is deployed in same project

### SPA routing
- `vercel.json` has rewrite `"/(.*)" → "/index.html"` for client-side routing

### Role-aware navigation
- `QuickActions.tsx` and `QuickTimetableActions.tsx` use `useAuth()` to generate role-prefixed routes

### Sidebar resize
- CSS var `--sidebar-width` on `<html>` element; `.sidebar-resizing` class disables transitions

### Settings localStorage fallback
- `settings.service.ts`: If `/api/settings` fails, reads/writes from `localStorage` key `app_settings`
- This is a **development fallback only** — real settings persist in backend DB

### Logo upload
- Settings → Institute section uploads logo; stored in localStorage
- Not yet backed by backend (no upload endpoint for institute logo)

### Removed features (intentional)
- Reports, Advanced Search, My Schedule, My Timetable removed from admin sidebar
- Theme toggle removed from Navbar

## Backend Structure
- Express server in `backend/src/server.ts` (only used locally)
- Routes mounted under `/api/` prefix (e.g. `/api/auth`, `/api/faculty`, `/api/timetable`)
- Prisma ORM with PostgreSQL (Supabase)
- Health check at `GET /api/health`
- Serverless entry: `api/index.ts` at project root (exports Express app for Vercel)

## Common Pitfalls
- If adding new API endpoints, add corresponding route in `backend/src/app.ts` and controller/service
- If adding new frontend pages, ensure route follows role-prefixed pattern (`/dashboard/:role/…`)
- Backend env vars must be set in Vercel dashboard (`.env` file only works locally)
- File uploads won't persist on Vercel without Cloudinary/S3 config
- Run `npm run build` locally (frontend only) for quick verification
- Vercel build uses `npm run build:vercel` which builds both frontend + backend
