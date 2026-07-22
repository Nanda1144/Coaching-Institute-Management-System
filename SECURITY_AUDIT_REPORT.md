# Security Audit Report

**Generated:** 2026-07-20  
**Scope:** JWT, BCrypt, RBAC, HTTPS, Helmet, Rate Limiting, CORS, XSS, SQL Injection, CSRF, Audit Logs, File Upload

---

## Security Scorecard

| Category | Score | Risk |
|----------|-------|------|
| **JWT** | 7/10 | MEDIUM |
| **BCrypt** | 9/10 | LOW |
| **RBAC** | 6/10 | MEDIUM |
| **HTTPS** | 2/10 | HIGH |
| **Helmet** | 7/10 | LOW |
| **Rate Limiting** | 5/10 | MEDIUM |
| **CORS** | 8/10 | LOW |
| **XSS / CSP** | 7/10 | LOW |
| **SQL Injection** | 8/10 | LOW |
| **CSRF** | 6/10 | LOW |
| **Audit Logs** | 2/10 | **HIGH** |
| **File Upload** | 2/10 | **CRITICAL** |
| **Environment** | 8/10 | LOW |
| **Database SSL** | 5/10 | MEDIUM |
| **Overall** | **5.5/10** | **MEDIUM** |

---

## 1. JWT (Score: 7/10)

### ✅ What's Done Right
- Access token expiry: `24h` (configurable via `JWT_EXPIRES_IN`)
- Refresh token expiry: `30d` (configurable via `JWT_REFRESH_EXPIRES_IN`)
- Secrets validated at startup — crashes if `JWT_SECRET` or `JWT_REFRESH_SECRET` missing (`env.ts:19-21`)
- Production guard rejects default secrets (`super-secret-key-change-in-production`) (`env.ts:30-34`)
- Separate `STUDENT` role JWT with dedicated payload verification
- Refresh token uses `type: 'refresh'` claim verification
- Request queue pattern prevents 401 refresh loops (`isRefreshing + failedQueue`)

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **No explicit algorithm pinning** — defaults to HS256 but not enforced | `auth.middleware.ts:66` | Algorithm confusion if secret leaked |
| **SKIP_AUTH bypass** — when `SKIP_AUTH=true` in dev, ALL requests get SUPER_ADMIN | `auth.middleware.ts:50-57` | Dev environments exposed if accidentally deployed with `SKIP_AUTH=true` (production guard exists but dev environments are at risk) |
| **Refresh token body fallback** — `/refresh-token` accepts `req.body?.refreshToken` bypassing httpOnly cookie | `auth.controller.ts:33` | XSS can steal refresh token if sent via body |

**Fix:** Explicitly set `algorithms: ['HS256']` in `jwt.verify()`. Remove body fallback for refresh token.

---

## 2. BCrypt (Score: 9/10)

### ✅ What's Done Right
- Salt rounds: 12 (configurable, default 12) — strong for 2026
- Used in: faculty registration, student auth, faculty creation
- `bcrypt.compare()` in all login flows with generic error messages ("Invalid email or password")
- `BCRYPT_SALT_ROUNDS` env var for configuration

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **Password minimum only 6 chars** — no complexity enforcement before hashing | `auth.validator.ts` | Weak passwords can still be hashed |

**Fix:** Increase `min(6)` to `min(8)` with regex requiring uppercase + digit + special char.

---

## 3. RBAC (Score: 6/10)

### ✅ What's Done Right
- All 22 route modules have `authenticate` + `authorize()` middleware
- Router-level protection on student-dashboard and parent-dashboard
- Granular role separation: SUPER_ADMIN, ADMIN only on student/parent/exam/fee management
- FACULTY role is read-only on sensitive modules (homework, evaluation, etc.)
- HOD sits between ADMIN and FACULTY

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **No role hierarchy** — each route must list every allowed role explicitly | All route files | Easy to forget roles; no "inherits" logic |
| **STUDENT/PARENT siloed** — only appear in their respective dashboard modules | auth.routes.ts:14 | Cannot access any other endpoint |
| **No `requirePermission()` usage** anywhere despite being defined | shared middleware | Granular permissions field in JWT unused |
| **RoleGuard silent redirect** on frontend — no error message for unauthorized access | App.tsx:83-88 | Confusing UX — redirected without explanation |

**Fix:** Implement role hierarchy utility function. Use `requirePermission()` for granular access. Improve frontend RoleGuard UX.

---

## 4. HTTPS / TLS (Score: 2/10)

### ✅ What's Done Right
- Cookie `secure` flag dynamically set in production
- Database SSL enabled (with `rejectUnauthorized: false`)

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **No application-level TLS** — plain `app.listen()` | `server.ts:15` | All traffic in plaintext if no reverse proxy |
| **No HSTS header** — Helmet default only adds in production, but no `max-age` customization | `app.ts:37` | No upgrade-insecure-requests enforcement |
| **Database SSL accepts self-signed certs** (`rejectUnauthorized: false`) | `database.ts:23` | MITM possible on database connection |

**Fix:** Add `https.createServer()` with cert paths in env, or document reverse proxy requirement. Set `rejectUnauthorized: true` with proper CA cert.

---

## 5. Helmet (Score: 7/10)

### ✅ What's Done Right
- `app.use(helmet())` with default v7 config
- Manual headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`
- Helmet v7.1.0 — current version

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **No custom CSP** — default `script-src 'self'; object-src 'none'` may break frontend | `app.ts:37` | Frontend inline scripts blocked; no reporting endpoint |
| **Manual headers duplicate Helmet defaults** | `app.ts:79-81` | Code clutter, no functional impact |
| **No `Referrer-Policy` customization** | Helmet default: `no-referrer` | May break analytics/referrer tracking |

**Fix:** Configure explicit CSP for the frontend origin. Remove redundant manual headers.

---

## 6. Rate Limiting (Score: 5/10)

### ✅ What's Done Right
- Global limiter: 500 requests / 15 min window (configurable)
- Dashboard limiter: 250 requests / 15 min (stricter for aggregation queries)
- Health endpoint exempted
- `express-rate-limit` v7.4.1 — current
- Standard headers enabled

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **No per-endpoint login ratelimit** — login shares global 500/15min limit | `auth.routes.ts` | Brute force password attack at 500 attempts per window |
| **No per-IP tracking** — rate limit is per-IP by default but no per-endpoint differentiation | Rate limiter config | All endpoints treated equally |
| **No graduated backoff** — no increasing delay on repeated violations | Rate limiter config | Attackers can retry immediately after window reset |

**Fix:** Add `loginLimiter` (5 attempts / min / IP). Add graduated backoff logic.

---

## 7. CORS (Score: 8/10)

### ✅ What's Done Right
- Single origin from `CORS_ORIGIN` env (default: `http://localhost:5173`)
- `credentials: true` for cookie-based auth
- Configurable via environment variable

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **Single origin restrictive** — no multiple origin support | `app.ts:38` | Cannot serve multiple frontend domains |
| **No allowed methods/headers restriction** — uses CORS defaults (all methods, all headers) | implicit | Slightly permissive |

**Fix:** Document that multiple origins need array support. Restrict methods explicitly.

---

## 8. XSS / CSP (Score: 7/10)

### ✅ What's Done Right
- JSON API only — no HTML template injection vector
- Helmet default CSP: `script-src 'self'; object-src 'none'`
- `X-XSS-Protection: 1; mode=block`
- Zod input validation sanitizes all request data

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **No CSP reporting endpoint** | Helmet config | Cannot detect CSP violations |
| **Stored XSS via file upload** — uploaded HTML/SVG files served without sanitization | Upload module | XSS when other users view uploaded files |
| **No output encoding on frontend** — React handles this but `dangerouslySetInnerHTML` not audited | Frontend | Potential XSS if raw HTML rendered |

**Fix:** Add `report-uri` to CSP. Add `Content-Disposition: attachment` header for file downloads. Audit `dangerouslySetInnerHTML` usage on frontend.

---

## 9. SQL Injection (Score: 8/10)

### ✅ What's Done Right
- `pg` parameterized queries everywhere: `pool.query(text, params)` with `$1, $2...` placeholders
- Custom `db.ts` utility forces parameterized pattern
- Column/table names use `toSnakeCase()` from hardcoded developer strings — not user input

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **`raw` operator in `buildWhereClause`** accepts developer-supplied SQL strings | `db.ts:56-61` | If a future developer passes user input to `raw`, SQL injection possible |
| **1 raw SQL usage** in `faculty.service.ts:33-37` for search | `faculty.service.ts` | Has parameter reindexing — safe but needs caution |

**Fix:** Document `raw` operator danger. Add lint rule preventing user input in `raw()` calls.

---

## 10. CSRF (Score: 6/10)

### ✅ What's Done Right
- All mutation endpoints use `Authorization: Bearer <token>` header — not cookie-based
- Refresh token cookie: `httpOnly: true`, `sameSite: 'strict'` — protected from script access and cross-site
- No `csurf` dependency needed for state-changing operations

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **Refresh token body fallback** — accepts `req.body?.refreshToken` bypassing SameSite cookie | `auth.controller.ts:33` | XSS can steal token; CSRF possible if token in body |
| **No CSRF token for form submissions** | Frontend forms | No CSRF protection for state changes (though irrelevant since Bearer tokens are used) |

**Fix:** Remove body fallback for refresh token. Verify SameSite cookie works across all target browsers.

---

## 11. Audit Logs (Score: 2/10) ⚠️ HIGH RISK

### ✅ What's Done Right
- `assignment_logs` table exists with structured fields (facultyId, action, entityType, oldValue, newValue, performedBy)
- Full object snapshots captured via `JSON.parse(JSON.stringify(...))`
- CREATE, UPDATE, DELETE actions logged (not READ)

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **Only 2 of 16+ modules log changes** — Assignment and Faculty only | All other service files | No historical record for Attendance, Fee, Homework, Exam, Material, Submission, Evaluation changes |
| **No audit on student/parent/fee/exam** — these handle sensitive financial and personal data | student/parent/fee/exam services | No forensic trail for financial changes |
| **No immutable storage** — logs can be deleted (no isDeleted guard) | prisma schema | Audit logs can be tampered with |
| **No login/logout audit trail** | auth service | Cannot track who logged in when |

**Fix:** Add audit logging to ALL mutation operations. Make audit logs append-only. Add login event logging.

---

## 12. File Upload Security (Score: 2/10) ⚠️ CRITICAL

### ✅ What's Done Right
- Authentication required (`SUPER_ADMIN, ADMIN, HOD, FACULTY`)
- Unique filename generation (prevents overwrite and path traversal)
- Path sanitization via `path.basename()` + `path.extname()`

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **No file type validation** — MIME type stored but not validated | `upload.service.ts:27-28` | Can upload `.exe`, `.html`, `.svg` with XSS payloads |
| **No file size limit** — multer configured without `limits.fileSize` | `upload.routes.ts:10` | Disk space exhaustion (only 10MB body limit provides partial protection) |
| **No content signature verification** — doesn't check magic bytes | `upload.service.ts` | File extension can be faked |
| **Files served without `Content-Disposition`** | No static file serving config | Uploaded HTML/SVG execute in browser context |
| **Hardcoded upload path** — not configurable via env | upload controller | Operational inflexibility |

**Fix:** Add `limits.fileSize: 10 * 1024 * 1024`, `fileFilter` for allowed MIME types, verify magic bytes with `file-type` package, add `Content-Disposition: attachment` header for downloads.

---

## 13. Environment Security (Score: 8/10)

### ✅ What's Done Right
- `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET` required at startup
- Production guard rejects default secrets (`env.ts:30-34`)
- Production guard rejects `SKIP_AUTH=true` (`env.ts:35-37`)
- Most config via env vars with safe defaults
- `requireEnv()` validation crashes on missing critical vars

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **No `.env.example` or env template** | root | New developers may miss required vars |
| **No env encryption at rest** | deployment | Secrets in plaintext `.env` files |

---

## 14. Database SSL (Score: 5/10)

### ✅ What's Done Right
- SSL enabled for PostgreSQL connection

### ❌ Gaps
| Issue | Location | Risk |
|-------|----------|------|
| **`rejectUnauthorized: false`** — accepts any certificate | `database.ts:23,134` | MITM between app and database possible |

**Fix:** Set `rejectUnauthorized: true` with `sslrootcert` pointing to CA certificate.

---

## Consolidated Risk Matrix

| Domain | Score | Top Risk | Fix Priority |
|--------|-------|----------|-------------|
| **File Upload** | 2/10 | Arbitrary file upload leading to RCE/XSS | **P0** |
| **Audit Logs** | 2/10 | No forensic trail for 14/16 modules | **P0** |
| **HTTPS** | 2/10 | All traffic in plaintext | **P1** |
| **Rate Limiting** | 5/10 | Brute force login attacks | **P1** |
| **RBAC** | 6/10 | No role hierarchy, no granular permissions | **P1** |
| **CSRF** | 6/10 | Refresh token body fallback | **P1** |
| **Database SSL** | 5/10 | MITM on DB connection | **P2** |
| **JWT** | 7/10 | No algorithm pinning | **P2** |
| **Helmet** | 7/10 | No custom CSP | **P2** |
| **XSS/CSP** | 7/10 | No CSP reporting | **P2** |
| **CORS** | 8/10 | Single origin restriction | **P3** |
| **SQL Injection** | 8/10 | `raw` operator documentation | **P3** |
| **BCrypt** | 9/10 | Weak password min (6 chars) | **P3** |
| **Environment** | 8/10 | No .env.example | **P3** |

---

## Top 5 Recommended Fixes

1. **🔴 File Upload Validation** — Add MIME type filter, file size limit, magic byte verification, and `Content-Disposition` headers
2. **🔴 Audit Logging** — Extend to ALL mutation operations across all 16 modules
3. **🟠 Login Rate Limiting** — Add per-IP 5 attempts/min/login endpoint
4. **🟠 HTTPS/TLS** — Add application-level TLS or document reverse proxy setup
5. **🟠 RBAC Hierarchy** — Implement role inheritance to prevent missing-role bugs

---

*End of Security Audit Report*
