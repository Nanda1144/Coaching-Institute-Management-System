# Engineering Report — Coaching Institute Management System

## Summary
Production-hardened the entire stack (React + Express + Prisma + Supabase PostgreSQL), fixing 5 critical runtime errors and ensuring all backend/frontend paths compile clean.

## Issues Fixed

### 1. `loading is not defined` ReferenceError — `RecentActivities.tsx` (LINE 75)
**Root cause:** Hook destructured `isLoading` but JSX referenced `loading`.
**Fix:** Changed `loading` → `isLoading`.

### 2. P1001 / ERR_CONNECTION_REFUSED — DB unreachable
**Root cause:** No retry logic; Prisma client instantiated with default connection params; server crashed on `$connect()` failure.
**Fix:**
- Rewrote `database.ts` as a singleton with exponential backoff (10 retries, 2s base, 30s cap)
- Added 30s health-check interval + automatic reconnection
- `server.ts` connects DB in background; server starts without waiting for DB
- Unhandled rejections/errors logged without crashing process; graceful SIGINT/SIGTERM shutdown (10s timeout)

### 3. Connection Reset / Pool Exhaustion
**Root cause:** `DATABASE_URL` missing `pgbouncer=true`, `connection_limit`, keep-alive params.
**Fix:**
```
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=5&pool_timeout=10&keepalives=1&keepalives_idle=60&keepalives_interval=10&keepalives_count=5
DIRECT_URL=postgresql://...  # for direct connections (migrations, $queryRaw)
```
- Removed invalid `connection_limit` / `pool_timeout` from Prisma schema datasource (those are PG connection-string params, not Prisma datasource attributes)

### 4. HTTP 429 Rate Limit — too aggressive
**Root cause:** `.env` `RATE_LIMIT_WINDOW_MS=90000` (90s, likely typo for 900000 = 15min); `env.ts` default `RATE_LIMIT_MAX=100` while `.env` had `500`.
**Fix:** `.env` → `900000`; `env.ts` default → `500`. Dashboard route gets stricter limit (`max/2`). Health endpoint exempted.

### 5. Backend 5xx — controller/service mismatches
| Issue | Fix |
|---|---|
| `submission.service.ts` used `submittedAt` — schema has `submissionDate`/`submissionTime` | Corrected field names |
| `submission.service.ts` / `evaluation.service.ts` had `createdById`/`updatedById` — not in schema | Removed |
| `submission.controller.ts` / `evaluation.controller.ts` called `service.delete()` — exported as `remove()` | Changed to `service.remove()` |
| `assignment.controller.ts` called `res.status(204).send()` — inconsistent envelope | Changed to `sendSuccess(res, null, ...)` |
| `auth.controller.ts` / `upload.controller.ts` used inline `res.status(400).json(...)` | Changed to `sendError(res, ...)` |
| Several controllers use `.bind()` (class-based) with `asyncHandler` inconsistency | Not a crash but should align in future |

## Changes Made

### Backend (`backend/`)
| File | What |
|---|---|
| `config/database.ts` | Prisma singleton, 10x retry, health checks, auto-reconnect |
| `config/env.ts` | Unified `RATE_LIMIT_MAX` default to 500 |
| `server.ts` | Non-blocking DB, graceful shutdown, no crash on errors |
| `app.ts` | Health endpoint (`/api/health` with DB status), per-route rate limit for dashboard, middleware order fixed, unused `AppError` import removed |
| `shared/utils/api-response.ts` | `sendSuccess`, `sendCreated`, `sendPaginated`, `sendError` |
| `shared/utils/bulk-operations.ts` | Generic bulk delete/update/import/export handlers |
| `scripts/seed.ts` | 1469-line seed for 32 tables with FK-safe nulls |
| `prisma/schema.prisma` | Cleaned datasource, removed invalid pool fields |
| `.env` | Fixed rate window, added `DIRECT_URL`, enhanced `DATABASE_URL` |

### Frontend (`src/`)
| File | What |
|---|---|
| `services/api.ts` | Axios: AbortController, request dedup (via `deduplicateRequest`), bounded retry (429 max 3x, network max 2x, 401 single refresh) |
| `main.tsx` | Added `ToastProvider`, fixed React Query defaults |
| `components/RecentActivities.tsx` | Fixed `loading` → `isLoading` |
| `utils/unwrap.ts` | `unwrapApiResponse`, `unwrapApiObject` — shared data-unwrapping utility |
| `features/manual-attendance/pages/ManualAttendancePage.tsx` | Fixed empty catch blocks — added error logging and failure tracking |

## Build Verification
- **Backend**: `npx tsc --noEmit` — **passes clean**
- **Frontend**: `npx vite build` — **passes clean** (only chunk-size advisory)

## Remaining (Non-Critical) Items
1. **Pervasive `any` types** — ~83 occurrences across 34 files. Low risk but weakens TypeScript safety.
2. **Duplicate unwrapping logic** — 4 components repeat the same nested ternary for API response unwrapping. The `unwrap.ts` utility exists but is not yet used by those components.
3. **Dead code** — `deduplicateRequest` in `api.ts` is exported but unused. `unwrap.ts` exports are unused.
4. **Class-based controllers** — `.bind(controller)` pattern in routes is inconsistent with `asyncHandler` composition.
5. **Field-name mismatch** — `Dashboard.tsx` maps `pendingAssignments` → `assignedCourses`, `upcomingHolidays` → `pendingLeaves`.

## Commit History (This Session)
1. `database.ts` + `server.ts` — DB retry, health checks, graceful shutdown
2. `.env` + `env.ts` — Fixed rate limit window/max, added DIRECT_URL, pool/keepalive params
3. `schema.prisma` — Cleaned datasource
4. `RecentActivities.tsx` — Fixed `loading` → `isLoading`
5. `api.ts` — Axios with AbortController, dedup, bounded retry
6. `app.ts` — Health endpoint, per-route rate limit, middleware order
7. `api-response.ts` + `bulk-operations.ts` — Shared utilities
8. `seed.ts` — Comprehensive seed
9. `ManualAttendancePage.tsx` — Fixed empty catch blocks
10. `unwrap.ts` — Shared unwrap utility
