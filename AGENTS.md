# Agent Context — EduManage Faculty Dashboard

## Architecture
- React + Vite + TypeScript SPA
- No backend deployed; all API calls served by a **mock adapter** (`src/services/mockAdapter.ts`)
- Mock adapter auto-enables when `VITE_API_BASE_URL` is undefined, empty string, or `VITE_USE_MOCK=true` (see `src/services/api.ts:7`)
- Axios instance at `src/services/api.ts` uses `VITE_API_BASE_URL || '/api'` as base URL

## Critical Decisions & Fixes

### Mock adapter auto-enable (prevents 404s on Vercel)
- **Why**: On Vercel, no backend exists — `/api/*` returns 404.
- **Fix** (`src/services/api.ts:7`): Auto-enable mock when `VITE_API_BASE_URL === undefined` (default when env var not set).
- **Don't change**: The mock adapter enables itself — do NOT remove this logic. Do NOT require `VITE_USE_MOCK=true` env var to be manually set for Vercel deploys.

### SPA routing (prevents direct URL 404s)
- **Why**: Without `vercel.json`, navigating directly to `/dashboard/settings` returns Vercel 404.
- **Fix**: `vercel.json` with rewrite `"/(.*)" → "/index.html"`.
- **Don't change**: Keep this file. Do not delete it.

### Role-aware navigation
- **`QuickActions.tsx`** and **`QuickTimetableActions.tsx`** use `useAuth()` to determine user role and generate correct routes (e.g. `/dashboard/faculty/timetable` vs `/dashboard/student/timetable`).
- **Don't change**: Routes are role-prefixed. Adding new action cards must follow the same pattern.

### Sidebar resize
- Sidebar width stored as CSS var `--sidebar-width` on `<html>` element.
- `.dashboard-main.sidebar-open` uses `var(--sidebar-width, 280px)`.
- During drag, `.sidebar-resizing` class disables transitions to prevent jank.
- **Don't change**: Both Sidebar.tsx and index.css must stay in sync.

### Settings localStorage fallback
- **`settings.service.ts`**: If `/api/settings` call fails, reads/writes from `localStorage` key `app_settings`.
- **Don't change**: This is the only persistence mechanism when using mock adapter (no real backend).

### Logo upload
- Settings → Institute section has a logo upload field.
- Logo stored in localStorage, displayed in sidebar.
- **Don't change**: Logo persists only in localStorage; no backend upload endpoint.

### Removed features
- Reports, Advanced Search, My Schedule, My Timetable removed from admin sidebar.
- Theme toggle removed from Navbar (incomplete feature).
- **Don't change**: These are intentionally removed. Do not re-add.

## Build & Deploy
- Build: `npm run build` (runs `tsc && vite build`)
- Type-check: `npx tsc --noEmit`
- Vercel config: Build Command = `npm run build`, Install = `npm install`, Output Dir = `dist`
- No environment variables needed on Vercel (mock adapter auto-enables)
- No backend needed — mock adapter provides full data

## Common Pitfalls
- If adding new API endpoints, add corresponding mock data in `mockAdapter.ts` — otherwise calls fail silently.
- If adding new dashboard pages, ensure the route follows the role-prefixed pattern (`/dashboard/:role/…`).
- `vercel.json` must exist with the SPA rewrite rule for any production deployment.
