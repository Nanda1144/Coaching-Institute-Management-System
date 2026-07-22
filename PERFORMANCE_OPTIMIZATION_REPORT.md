# Performance Optimization Report

**Generated:** 2026-07-20  
**Scope:** Backend API, Database Queries, Indexes, Caching (all layers), React Rendering, Bundle Size, Memory Usage, N+1 Queries

---

## Scorecard

| Category | Score | Severity |
|----------|-------|----------|
| **N+1 Queries** | 4/10 | HIGH |
| **Database Queries** | 5/10 | MEDIUM |
| **Indexes** | 7/10 | MEDIUM |
| **Backend Caching** | 3/10 | HIGH |
| **React Rendering** | 4/10 | HIGH |
| **Bundle Size** | 4/10 | HIGH |
| **Memory Usage** | 6/10 | MEDIUM |
| **API Speed** | 5/10 | MEDIUM |
| **Overall** | **4.8/10** | HIGH |

---

# PART 1: N+1 QUERIES

## Found: 9 N+1 / Inefficient Query Patterns

### CRITICAL — Dashboard Recent Activities (N+1 per faculty lookup)

**File:** `dashboard.service.ts:134-142`
```ts
const enrichedLogs = await Promise.all(
  logs.map(async (log: any) => {
    const faculty = log.facultyId
      ? await db.findUnique('faculty', [{ column: 'id', value: log.facultyId }], ...)
      : null;
    return { ...log, faculty };
  })
);
```
- **Pattern:** N logs fetched → N individual faculty lookups (1 + N queries)
- **Impact:** 11 queries for 10 logs; 101 queries for 100 logs
- **Fix:** Batch fetch all faculty IDs in one query:
```ts
const facultyIds = [...new Set(logs.filter(l => l.facultyId).map(l => l.facultyId))];
const faculties = facultyIds.length
  ? await db.findMany('faculty', { where: [{ column: 'id', operator: 'IN', value: facultyIds }] })
  : [];
const facultyMap = new Map(faculties.map(f => [f.id, f]));
const enriched = logs.map(log => ({ ...log, faculty: log.facultyId ? facultyMap.get(log.facultyId) : null }));
```

### HIGH — Assignment findById Fetches 10 Separate Relations

**File:** `assignment.service.ts:83-108`
```ts
const [subject, batch, faculty, department, course, semester, createdBy, updatedBy, attachments, submissionCount] =
  await Promise.all([...9 individual queries...]);
```
- **Pattern:** 10 parallel queries where 1 JOIN query would suffice
- **Impact:** 10 round-trips for a single resource read
- **Fix:** Replace with a single SQL JOIN query or use `db.findMany` with a view.

### HIGH — Faculty Username Generation While-Loop

**File:** `faculty.service.ts:17-20`
```ts
while (await db.findUnique('faculty', [{ column: 'username', value: username }])) {
  username = `${base}${suffix++}`;
}
```
- **Pattern:** Each collision triggers a new SELECT
- **Impact:** Unbounded loop under high concurrency
- **Fix:** Use `INSERT ... ON CONFLICT` with retry, or append `Date.now()` to guarantee uniqueness without looping.

### MEDIUM — Faculty Create Triple Uniqueness Check

**File:** `faculty.service.ts:80-87`
```ts
const existingEmail = await db.findUnique('faculty', ...)
const existingPhone = await db.findUnique('faculty', ...)
const existingEmployeeId = await db.findUnique('faculty', ...)
```
- **Pattern:** 3 sequential queries for what 1 query can do
- **Impact:** 3× DB round-trips per faculty creation
- **Fix:** `SELECT id, email, phone, employee_id FROM faculty WHERE email=$1 OR phone=$2 OR employee_id=$3 LIMIT 1`

### MEDIUM — Missing Include on Attendance Queries

**File:** `attendance.service.ts:201` and `student-dashboard.service.ts:140-141`
```ts
subjectName: r.subject?.subjectName ?? 'Unknown',  // r.subject is ALWAYS undefined
facultyName: a.facultyName,  // never fetched
```
- **Pattern:** Accessing relation fields that were never joined
- **Impact:** Always returns default values (`'Unknown'`). Silent data loss.
- **Fix:** Add JOIN to the upstream query or fetch related data separately.

### MEDIUM — QR Session + Scans as Separate Queries

**File:** `qr-attendance.service.ts:87-94`
- **Pattern:** 2 queries where 1 JOIN would suffice
- **Fix:** Single JOIN query.

### LOW — Parent Dashboard Duplicate `getParentWithStudent()` Call Per Endpoint

**File:** `parent-dashboard.service.ts` (all method entries)
- **Pattern:** `getParentWithStudent()` called in every endpoint invokes 2 individual queries
- **Impact:** If a parent opens all 8 dashboard tabs, 16 individual DB queries just to identify the student
- **Fix:** Cache parent+student in the request scope, or use JOIN.

### LOW — Faculty Transfer Redundant Re-Fetch After Update

**File:** `faculty-transfer.service.ts:86-87`
- **Pattern:** Re-fetches faculty after already having updated it
- **Fix:** Use the return value from `db.update()` instead of a new `findUnique`.

### LOW — Timetable Redundant Faculty Existence Check

**File:** `timetable.service.ts`
- **Pattern:** `findFirst` on faculty table before main query on timetable tables
- **Impact:** 1 extra query per timetable lookup
- **Fix:** Rely on FK constraint in DB; catch error if faculty doesn't exist.

---

# PART 2: DATABASE QUERY EFFICIENCY

## SQL Injection in `extraWhere` (Performance + Security)

**Affected files:** `attendance.service.ts` (lines 55, 60, 63, 141, 172, 177), `qr-attendance.service.ts` (line 103)

Date/time values are interpolated into SQL strings instead of parameterized:
```ts
extraWhere = `"attendance_date" >= '${startOfDay.toISOString()}' AND ...`;
```
- **Performance impact:** Each `extraWhere` string is constructed on every request, preventing query plan caching in PostgreSQL
- **Fix:** Add parameter support to `extraWhere` in `db.ts` instead of string interpolation.

## Raw SQL Queries Bypassing Abstraction

- `correction.service.ts:46-53` — Transactional multi-table update (acceptable, but could use `db.update`)
- `material.service.ts:149` — Atomic increment `total_downloads = total_downloads + 1` (correctly parameterized)

## All Paginated Endpoints Use Offset-Based Pagination

Every list endpoint uses `OFFSET`/`LIMIT` via `skip`/`take` pattern:
- Performance degrades as offset increases (PostgreSQL must scan and discard earlier rows)
- **Fix:** Add cursor-based pagination for high-volume tables (`attendances`, `assignments`, `assignment_logs`).

## Aggregate Query Pattern on Dashboard

**`dashboard.service.ts`** issues 7 separate `COUNT`/`findMany` queries for admin stats:
```ts
const [totalFaculty, activeFaculty, totalStudents, totalSubjects, totalClasses, todayAttendance, pendingAssignments, upcomingHolidays] =
  await Promise.all([...7 parallel queries...]);
```
- **Impact:** 7 full table scans on every dashboard load (even with caching, cache miss = heavy query load)
- **Fix:** Create a PostgreSQL materialized view that refreshes every 30 seconds:
```sql
CREATE MATERIALIZED VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM faculty WHERE is_deleted = false) AS total_faculty,
  (SELECT COUNT(*) FROM faculty WHERE status = 'active' AND is_deleted = false) AS active_faculty,
  ...
```

---

# PART 3: INDEX ANALYSIS

## Current State: 93 indexes (3 composite, 90 single-column) — Adequate

## Missing Indexes

| # | Table | Missing Index | Common Query Pattern | Impact |
|---|-------|---------------|---------------------|--------|
| I1 | `assignments` | `(due_date)` | Filtering/sorting by due date | Full scan on deadline queries |
| I2 | `attendances` | `(student_id, attendance_date)` | Checking if a student has attendance on a date | Sequential scan per student |
| I3 | `timetable` | `(faculty_id, day_of_week, start_time)` | Conflict detection | Sequential scan for schedule checks |
| I4 | `homework` | `(status)`, `(due_date)` | Filter by status or due date | Full scan on common filters |
| I5 | `students` | `(batch_id, status)` | Finding active students in a batch | Sequential scan |

## Over-Indexing Concerns

- **22 single-column indexes** on rarely-filtered FK columns (e.g., `FaceRecognition.createdById`, `Holiday.createdBy`)
- Each index adds write overhead (INSERT/UPDATE/DELETE must update all indexes)
- **Recommendation:** Audit actual query patterns via `pg_stat_user_indexes` and drop unused indexes.

---

# PART 4: CACHING ANALYSIS

## Backend Caching: Score 3/10

### Current State
| Layer | Mechanism | Cache Keys | TTL |
|-------|-----------|------------|-----|
| In-memory | `Map<string, {data, expiry}>` | 2 keys (`admin-stats`, `faculty-stats-{id}`) | 30s |
| Everything else | No cache | 0 keys | N/A |

### Critical Gaps

1. **Only 2 cache keys in entire backend** — Every other endpoint (faculty lists, attendance, timetable, assignments, holidays, materials, all CRUD) hits the database on every request
2. **No Redis** — In-memory `Map` breaks with multiple server instances
3. **No cache invalidation** — `clearCache()` exists but is never called. Dashboard stats become stale the moment any CRUD happens
4. **No cache on read-heavy endpoints** — Faculty lists, timetable lookups, and holiday lists are read frequently but never cached
5. **No HTTP-level caching** — No `Cache-Control`, `ETag`, or `Last-Modified` headers on any response

### Cache TTL Comparison

| Data Type | Ideal TTL | Current | Gap |
|-----------|-----------|---------|-----|
| Dashboard stats | 30-60s | 30s | OK |
| Faculty list | 60-300s | 0 (not cached) | HIGH |
| Timetable entries | 60-300s (per day) | 0 (not cached) | HIGH |
| Holiday list | 3600s (1 hour) | 0 (not cached) | HIGH |
| Material list | 60-300s | 0 (not cached) | MEDIUM |
| Attendance stats | 15-30s | 0 (not cached) | MEDIUM |
| Assignment list | 30-60s | 0 (not cached) | MEDIUM |

## Frontend Caching: Score 5/10

### Current React Query Config
| Parameter | Value | Assessment |
|-----------|-------|------------|
| `staleTime` | 30s (global) | Good default |
| `retry` | 1 | Good (not too aggressive) |
| `refetchOnWindowFocus` | false | Good |
| `refetchOnReconnect` | false | Good |
| `gcTime` | 5 min (default) | Too long — should be 60s |

### Critical Frontend Caching Gaps

1. **Cache key collision** — `useReactQuery.ts` and `useSharedData.ts` use IDENTICAL query keys (`['faculty', params]`) but different `staleTime`/`gcTime` configurations. Both hooks fight over the same cache entry.
2. **Dashboard stats never invalidated** — Mutations (create faculty, mark attendance) don't invalidate `['adminDashboard']` or `['facultyDashboard']`
3. **No `gcTime` in global defaults** — Default 5min means stale data persists too long
4. **No optimistic updates** — No `onMutate` for instant UI feedback during mutations
5. **No `refetchInterval`** — No polling for near-real-time data

---

# PART 5: REACT RENDERING PERFORMANCE

## Critical Issues

### P1: Inline Component Definitions → Unmount/Remount on Every Navigation

**File:** `App.tsx:72,83,91,102`
```tsx
function ProtectedRoute(...)   // defined inside App()
function RoleGuard(...)         // defined inside App()
function HomeRoute(...)         // defined inside App()
function MainLayout(...)        // defined inside App()
```
- Each `App` re-render (every route change) creates new function identities
- React unmounts and remounts the entire DOM subtree — losing all state, scroll, animation
- **Fix:** Move all 4 components outside `App()` to module scope

### P2: AuthContext Value Not Memoized

**File:** `contexts/AuthContext.tsx:90`
```tsx
<AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkAuth }}>
```
- Every `AuthProvider` re-render creates a new object reference
- ALL context consumers re-render unconditionally
- **Fix:** Wrap in `useMemo([user, isLoading, login, logout, checkAuth])`

### P3: HeroBackground Renders on ALL Routes (Including Authenticated Dashboard)

**File:** `App.tsx:134`
```tsx
<HeroBackground />   // Always rendered, even for authenticated users
```
- 538-line Three.js 3D animation runs continuously on dashboard pages
- GPU-intensive for zero benefit (users don't see it behind dashboard UI)
- **Fix:** Conditionally render only on public routes, or lazy-load when `!isAuthenticated`

## High Issues

### H1: Zero React.memo Usage in Entire Codebase
- Every component re-renders when its parent re-renders
- Biggest candidates: `Sidebar` (20+ NavLink items), `DashboardCard`, chart components, `Navbar`

### H2: `useCallback` Without `React.memo` Children (Anti-pattern)
- `AttendanceDashboard.tsx:91-95` wraps handlers in `useCallback` but child components like `AttendanceFilters` are NOT memoized — callback stability provides zero benefit

### H3: 10 Pages Eagerly Imported
- `Dashboard`, `DepartmentsPage`, `CoursesPage`, `AssignmentsPage`, `SettingsPage` are static imports (not lazy-loaded)
- Adds to initial bundle size and parse time

### H4: Suspense Boundary Misplaced
- `<Suspense>` at line 144 is nested inside `ProtectedRoute → MainLayout`
- Public routes (`/`, `/login`, etc.) are NOT wrapped — would crash if they used lazy imports

### H5: 13-Level Deep Component Tree
- Deepest authenticated page: `BrowserRouter → AuthProvider → ToastProvider → Routes → Route → ProtectedRoute → MainLayout → AnimatePresence → motion.div → ErrorBoundary → Suspense → Routes → Route → Page`
- Each level adds React reconciliation overhead

## Medium Issues

### M1: Unnecessary `useMemo` with `Math.random()`
- `FloatingCards.tsx:24`: `useMemo(() => delay + Math.random() * 0.5, [delay])` — `Math.random()` makes the value non-deterministic, memoization provides ZERO benefit

### M2: Dead localStorage Writes
- `AuthContext.tsx:73-74`: `login()` writes `userRole` and `userName` to localStorage but they're never read — wasted I/O

### M3: Inconsistent Data Fetching
- Some pages use React Query (faculty list, attendance), others use raw `useState` + `useEffect` (departments, courses, assignments, settings, search, transfers)
- No caching, deduplication, or retry on manual-fetch pages

---

# PART 6: BUNDLE SIZE ANALYSIS

## Current Bundle Composition (Estimated)

| Package | Size (gzip) | Category | Status |
|---------|-------------|----------|--------|
| `three` | ~600 KB | 3D | ⚠️ Only used in landing page animation |
| `xlsx` | ~350 KB | Spreadsheet | ⚠️ Only for export features |
| `react-icons` | ~200+ KB | Icons | ❌ **Not tree-shakeable** |
| `framer-motion` | ~150 KB | Animation | ⚠️ Heavy but used pervasively |
| `recharts` | ~120 KB | Charts | ⚠️ Heavy charting library |
| `lucide-react` | ~100 KB | Icons | ✅ Tree-shakeable |
| `react-router-dom` | ~65 KB | Routing | ✅ Expected |
| `@tanstack/react-query` | ~30 KB | Data Fetching | ✅ Expected |
| `axios` | ~14 KB | HTTP | ✅ Expected |
| `react-hook-form` | ~12 KB | Forms | ✅ Expected |

**Estimated total: ~1.64 MB gzip (unoptimized)**

## Bundle Optimization Opportunities

### B1 — Remove Redundant `react-icons` (Save ~200 KB)
- Both `react-icons` AND `lucide-react` are installed
- Codebase imports from both — standardizing on `lucide-react` (tree-shakeable) saves ~200 KB

### B2 — Lazy Load `three` (Save ~600 KB from initial bundle)
- `HeroBackground` is the only consumer of `three`
- Currently imported statically → loads on every page
- **Fix:** `const HeroBackground = lazy(() => import('./features/Main_interface/animations/HeroBackground'))`
- Only render via conditional `<Suspense>` on public routes

### B3 — Lazy Load `xlsx` (Save ~350 KB from initial bundle)
- Only used when user triggers an export/download
- **Fix:** Dynamic import: `const XLSX = await import('xlsx')` at export time

### B4 — Configure `manualChunks` in Vite

**Current `vite.config.ts` has NO `build` section.** Add:
```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        animation: ['framer-motion'],
        charts: ['recharts'],
        spreadsheet: ['xlsx'],
      },
    },
  },
  chunkSizeWarningLimit: 300,
}
```

### B5 — Lower `chunkSizeWarningLimit`
- Default: 500 KB → recommended: 300 KB
- With `manualChunks`, the vendor chunk (react + react-dom + router) will be ~200 KB — manageable

### B6 — Add Bundle Visualizer
```bash
npm install -D rollup-plugin-visualizer
```
Add to `vite.config.ts` to visualize bundle composition and track optimization progress.

---

# PART 7: MEMORY USAGE

## Backend Memory

### In-Memory Cache — Unbounded Growth Risk
- `cache.ts` uses a `Map` with no max size, no LRU eviction, no TTL cleanup
- `setCache()` adds entries indefinitely
- Entries are only evicted on read via `getCached` expiry check (lazy eviction)
- If many different faculty IDs request dashboard stats, cache grows unbounded

**Fix:** Add max size (e.g., 100 entries) with LRU eviction, or replace with Redis.

### Connection Pool — Acceptable
- `database.ts` uses `pg.Pool` with configurable `max` connections
- Default PostgreSQL pool size = 10–20. Adequate for this scale.

### No Memory Leak Patterns Detected
- No global variable accumulation in hot paths
- No closure-related leaks in service files
- No event listener accumulation

## Frontend Memory

### AuthContext Keeps User Object in Memory + localStorage
- `user` state object in AuthContext holds full user data indefinitely
- `localStorage` stores `accessToken`, `userRole`, `userName` (2 of 3 are dead writes)
- On logout, `setUser(null)` and `localStorage.removeItem('accessToken')` — proper cleanup

### React Query Cache Growth
- Default `gcTime: 5 min` means cached data persists for 5 minutes after the component unmounts
- With 50+ pages each mounting/unmounting during navigation, cache can accumulate stale entries
- **Fix:** Set explicit `gcTime: 60000` (60s) globally

### Large Bundle → Large Parse/Execute Memory
- 1.64 MB+ gzip bundle means ~5+ MB uncompressed
- Parsing 600 KB of `three` on every page load is wasteful
- Fixing bundle issues (B1-B6) will significantly reduce memory at load time

### No Detected Frontend Memory Leaks
- No `setInterval` without cleanup
- No event listeners without removal
- No detached DOM references

---

# PART 8: API SPEED

## Estimated Response Times (Current)

| Endpoint | Estimated Time | Bottleneck |
|----------|---------------|------------|
| `GET /api/dashboard/admin` | 80-150ms | 7 parallel COUNT queries; no cache on first hit |
| `GET /api/assignments/:id` | 50-120ms | 10 parallel relation queries (N+1) |
| `GET /api/attendance` | 30-80ms | Potential full table scan without date filter |
| `GET /api/timetable/faculty/:id` | 20-60ms | Redundant existence check |
| `GET /api/faculty` | 20-50ms | Paginated, indexed |
| `POST /api/faculty` | 80-150ms | 3 sequential uniqueness checks + bcrypt hash (12 rounds) |
| `POST /api/auth/login` | 100-300ms | bcrypt compare (12 rounds) + JWT sign |

## Speed Optimization Opportunities

### S1 — Materialized View for Dashboard (Eliminates 7 COUNT Queries)
Replace 7 parallel queries with a single `SELECT * FROM admin_dashboard_stats` that refreshes every 30 seconds via `pg_cron` or application-level trigger. Estimated time: 80-150ms → 5-15ms.

### S2 — Password Hashing Cost Optimization
- BCrypt 12 rounds is appropriate for login (security-first)
- For bulk faculty creation (admin feature), consider async hashing or background job
- Current: synchronous `bcrypt.hash()` on the main thread blocks the event loop for ~200ms per faculty

### S3 — Prepared Statement Caching
- `db.ts` builds SQL strings dynamically on every call
- Fixed queries (`findById`, `findByFaculty`, etc.) should use prepared statements
- PostgreSQL caches query plans for identical parameterized queries — dynamic SQL defeats this

### S4 — Remove Redundant Existence Checks
- `timetable.service.ts` does `findFirst(faculty)` before `findMany(timetable)` — trust the FK
- `faculty-transfer.service.ts` re-fetches faculty after update — use the update return value

---

# PRIORITIZED OPTIMIZATION PLAN

## P0 — Fix This Week (Critical Impact)

| ID | Issue | Files | Expected Improvement |
|----|-------|-------|---------------------|
| P0-1 | Dashboard N+1 (batch faculty fetch) | `dashboard.service.ts:134-142` | 11→2 queries (82% reduction) |
| P0-2 | Inline components → unmount/remount | `App.tsx:72,83,91,102` | Eliminates full-page remount on nav |
| P0-3 | AuthContext value memoization | `AuthContext.tsx:90` | Stops cascading consumer re-renders |
| P0-4 | HeroBackground conditional render | `App.tsx:134` | Saves 600KB parse + GPU on dashboard |
| P0-5 | `extraWhere` SQL injection fix | `attendance.service.ts` | Enables query plan caching |

## P1 — Fix This Sprint (High Impact)

| ID | Issue | Files | Expected Improvement |
|----|-------|-------|---------------------|
| P1-1 | Assignment 10-query relation fetch | `assignment.service.ts:83-108` | 10→1 query (90% reduction) |
| P1-2 | Faculty create 3 sequential uniqueness checks | `faculty.service.ts:80-87` | 3→1 query (67% reduction) |
| P1-3 | Remove `react-icons`, standardize on `lucide-react` | `package.json` | Saves ~200 KB gzip |
| P1-4 | Lazy load `three` (HeroBackground) | `App.tsx` | Saves ~600 KB from initial bundle |
| P1-5 | Add `manualChunks` to vite config | `vite.config.ts` | Enables parallel chunk loading |
| P1-6 | Add React.memo to Sidebar, DashboardCard | Sidebar, DashboardCard | Reduces unnecessary re-renders |
| P1-7 | Missing include on attendance queries | `attendance.service.ts:201`, `student-dashboard.service.ts:140-141` | Fixes silent `'Unknown'` data bug |
| P1-8 | Cache key collision fix | `useReactQuery.ts` vs `useSharedData.ts` | Prevents cache thrashing |

## P2 — Fix This Month (Medium Impact)

| ID | Issue | Expected Improvement |
|----|-------|---------------------|
| P2-1 | Replace in-memory cache with Redis | Multi-instance support, persistence |
| P2-2 | Add cache invalidation to mutations | Dashboard stats stay fresh |
| P2-3 | Add missing indexes (due_date, student+date, faculty+day+time, batch+status) | Faster filtering on common queries |
| P2-4 | Materialized view for dashboard | 7 COUNT queries → 1 SELECT |
| P2-5 | Cursor-based pagination for high-volume tables | Avoids OFFSET slowdown at high page numbers |
| P2-6 | Remove dead localStorage writes | Eliminates unnecessary I/O |
| P2-7 | Add `gcTime: 60000` to React Query defaults | Faster cache cleanup |
| P2-8 | Fix Suspense boundary for public routes | Prevents crash if public routes use lazy |
| P2-9 | Lazy load `xlsx` | Saves ~350 KB from initial bundle |
| P2-10 | Lower `chunkSizeWarningLimit` to 300KB | Early awareness of large chunks |

## P3 — Technical Debt (Low Impact)

| ID | Issue | Notes |
|----|-------|-------|
| P3-1 | Inconsistent data fetching (some pages use raw useEffect) | Migrate to React Query |
| P3-2 | `useCallback` without `React.memo` children | Harmless but misleading |
| P3-3 | `Math.random()` in useMemo | Remove memo wrapper |
| P3-4 | Redundant timetable faculty existence check | Minor overhead |
| P3-5 | Redundant faculty-transfer re-fetch | Minor overhead |

---

## Estimated Speed Improvements After P0+P1

| Endpoint | Before | After | Improvement |
|----------|--------|-------|-------------|
| `GET /api/dashboard/admin` (cold) | 100ms | 15ms | 85% faster |
| `GET /api/dashboard/admin` (cached) | — | 5ms | Added caching |
| `GET /api/assignments/:id` | 80ms | 10ms | 88% faster |
| `POST /api/faculty` | 120ms | 80ms | 33% faster |
| Frontend initial load (bundle) | ~1.64 MB | ~840 KB | **49% smaller** |
| Frontend nav (route change) | ~200ms remount | ~5ms | 97% faster |
| Auth consumer re-renders | All consumers | Targeted only | Significant |

---

*End of Performance Optimization Report*
