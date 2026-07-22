# Validation Audit Report

**Generated:** 2026-07-20  
**Scope:** Backend (Zod validators + routes), Frontend (forms + API normalizers), Database (Prisma schema constraints)

---

## Executive Summary

| Layer | Total Checks | Pass | Weak | Missing | Score |
|-------|-------------|------|------|--------|-------|
| **Backend (Routes)** | 22 modules | 14 partial | 10 | 8 zero-coverage modules | 4.5/10 |
| **Backend (Schemas)** | 37 schemas | 24 | 11 | 3 orphaned | 5.7/10 |
| **Frontend** | 25 form locations | 12 | 10 | 3 | 5.2/10 |
| **Database** | 22 unique + 93 indexes | 18 | 6 | 9 missing constraints | 6.0/10 |
| **Overall** | — | — | — | — | **5.4/10** |

---

# PART 1: BACKEND VALIDATION

## 1.1 Route Coverage — Modules With ZERO Validation

**8 route modules (36%) have no `validate()` middleware on any endpoint:**

| Module | Endpoints | Impact |
|--------|-----------|--------|
| **student** | GET /, GET /:id, POST /, PATCH /:id, DELETE /:id | CRUD on all students — arbitrary data |
| **parent** | GET /, POST /, PATCH /:id, DELETE /:id | CRUD on all parents — arbitrary data |
| **exam** | GET /, POST /, PATCH /:id, DELETE /:id | Exam schedule — arbitrary data |
| **fee** | GET /transactions, /pending, /structure | Fee data — no query validation |
| **notification** | GET /history, POST /send | Notification broadcast — arbitrary target/message |
| **student-dashboard** | GET /overview, /attendance, /timetable, /assignments, /marks, /materials, /fees, /notifications, PATCH notifications/:id/read | Student data — no query param validation |
| **parent-dashboard** | GET /overview, /attendance, /timetable, /assignments, /marks, /materials, /fees, /notifications | Parent data — no query param validation |
| **dashboard** | GET /admin, /faculty/:facultyId, /recent-activities | Admin/faculty stats — no query validation |

## 1.2 Route-Level Gaps Within Modules That Have Partial Validation

Even in validated modules, **many specific routes lack validation**:

| Module | Unvalidated Routes |
|--------|-------------------|
| **auth** | POST /refresh-token, POST /logout, GET /me |
| **faculty** | GET /profile, /dashboard, /:id, DELETE /:id |
| **assignment** | GET /faculty/:facultyId, DELETE /:id, GET /:id |
| **material** | GET /categories, /faculty/:facultyId, /:id, DELETE /:id |
| **attendance** | GET /today, /stats, /:id, DELETE /:id + biometric verification routes |
| **homework** | GET /faculty/:facultyId, /:id, DELETE /:id |
| **timetable** | GET /faculty/:facultyId (x2), /:id, DELETE /:id |
| **reminder** | GET /my/:facultyId, /:id, PATCH /:id/sent, DELETE /:id |
| **submission** | GET /assignment/:assignmentId, POST /, PATCH /:id, DELETE /:id |
| **holiday** | GET /upcoming/:days, /stats, /special-events, /:id, DELETE /:id |
| **evaluation** | GET /faculty/:facultyId, DELETE /:id, PATCH /:id/publish |
| **upload** | DELETE /:id |

## 1.3 Weak Validations in Schemas

### W1 — Weak Password Policy
- **Password:** `.min(6)` only — no uppercase, lowercase, digit, or special char requirement
- **Location:** `auth.validator.ts`, `student-auth.validator.ts`
- **Risk:** Brute force, credential stuffing

### W2 — Phone Number Lacks Format Validation
- **Phone:** `.min(10).max(15)` length only — no regex for digits, country code
- **Location:** `faculty.validator.ts`
- **Risk:** Invalid phone numbers stored

### W3 — String IDs Replace UUID Validation
- **Homework, Material, Timetable** validators use `.min(1)` instead of `.uuid()` for entity IDs
- **Risk:** Non-existent references accepted

### W4 — `dayOfWeek` Has No Enum Constraint
- **Timetable** schema: `dayOfWeek` is `.min(1)` string — any value accepted
- **Risk:** Invalid day values stored

### W5 — `holidayType` Has No Enum Constraint
- **Holiday** schema: `.min(1)` string — any value accepted
- **Risk:** Inconsistent holiday type data

### W6 — Missing `.max(100)` on Pagination Limit
- **Submission** and **Evaluation** query schemas omit `.max(100)` on `limit`
- **Risk:** Clients can request unlimited records

### W7 — Date Fields Use Custom Refine Instead of `coerce.date()`
- **Faculty** validator: `dateOfBirth` and `joiningDate` use `refine(val => !isNaN(Date.parse(val)))`
- **Inconsistency:** All other modules use `.coerce.date()` — inconsistent pattern

## 1.4 Duplicate / Inconsistent Validations

### D1 — `facultyId` Validated Inconsistently Across 8 Schemas

| Schema | Constraint |
|--------|-----------|
| Assignment | `.uuid()` |
| Attendance query | `.uuid()` optional |
| Faculty-transfer | `.uuid()` |
| Homework | `.min(1)` — **weak** |
| Timetable | `.min(1)` — **weak** |
| Evaluation | `.uuid()` |
| Material (query) | unconstrained string |

### D2 — Pagination Fields Duplicated 12+ Times
Identical pattern: `page` (coerce, int, positive, default 1) and `limit` (coerce, int, positive, max 100, default 10). Should be extracted to a shared `paginationSchema`.

### D3 — Email Validated 4 Times — All Consistent
Login, register, student-login, faculty-create all use `.email()` — consistent.

## 1.5 Orphaned / Unused Schemas

| Schema | Module | Fields |
|--------|--------|--------|
| `changePasswordSchema` | auth | currentPassword, newPassword, confirmNewPassword |
| `createFaceRecognitionSessionSchema` | attendance | studentId, confidence, imageUrl, deviceId, metadata |
| `createFingerprintSessionSchema` | attendance | fingerprintId, studentId, scannerId, metadata |

All three are **defined, exported, but never referenced in any route**.

---

# PART 2: FRONTEND VALIDATION

## 2.1 Form Validation Coverage

| Form | Library | Quality | Gaps |
|------|---------|---------|------|
| **Add/Edit Faculty** | react-hook-form | GOOD | No Yup/Zod schema; no async uniqueness check |
| **Manual Attendance** | Custom | WEAK | Only "is filled" checks; no enum validation on status |
| **Create/Edit Timetable** | Custom | WEAK | No conflict detection; no time-format validation |
| **Main Interface Login** | Custom | MODERATE | Email regex + length check; no rate limiting |
| **Main Interface Signup** | Custom | MODERATE | Password match check; no complexity rules |
| **LoginModal** | HTML5 only | **CRITICAL** | Only HTML `required` — no JS validation |
| **Contact Page** | HTML5 only | **CRITICAL** | Only HTML `required` — no JS validation |

## 2.2 Critical Frontend Gaps

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| F1 | **No Yup/Zod/Formik schemas** | All forms | No reusable validation; only inline per-component rules |
| F2 | **No file type/size validation** on photo upload | `PhotoUpload.tsx` | Any file type accepted; no size limit |
| F3 | **No server-side validation fallback** | All forms | If JS fails or user bypasses client, invalid data submitted |
| F4 | **Contact form JS validation absent** | `ContactPage.tsx` | Submit always succeeds regardless of input |
| F5 | **LoginModal only has HTML5 required** | `LoginModal.tsx` | No format, length, or pattern validation |

## 2.3 Weak Frontend Validations

| # | Issue | Location |
|---|-------|----------|
| W8 | Password `minLength={6}` (should be 8+) | LoginModal signup |
| W9 | Date fields have no min/max bounds | All date pickers |
| W10 | `experience` stored as string not number | registration.types.ts |
| W11 | No `maxLength` on any text field | All forms |
| W12 | No debounced async uniqueness check | AddFaculty username |
| W13 | `safePhone()` only strips spaces — no format check | normalizers.ts |

## 2.4 API Response Validation

**Runtime normalizers exist for 15 entity types** but there is a split:

| Entity Type | Runtime Validation | Method |
|-------------|-------------------|--------|
| Faculty | ✅ Full normalization | `normalizeFaculty()` |
| Attendance | ✅ Full normalization | `normalizeAttendanceRecord()` |
| Timetable | ✅ Full normalization | `normalizeTimetableEntry()` |
| Assignment | ✅ Full normalization | `normalizeAssignment()` |
| Holiday | ✅ Full normalization | `normalizeHoliday()` |
| Material | ✅ Full normalization | `normalizeMaterial()` |
| Dashboard | ✅ Full normalization | `normalizeDashboardStats()` |
| **Student** | ❌ Raw cast only | `(result as any)?.data` |
| **Parent** | ❌ Raw cast only | `(result as any)?.data` |
| **Batch** | ❌ Raw cast only | `(result as any)?.data` |
| **Exam** | ❌ Raw cast only | `(result as any)?.data` |
| **Fee** | ❌ Raw cast only | `(result as any)?.data` |
| **Notification** | ❌ Raw cast only | `(result as any)?.data` |

## 2.5 Error / Loading States

| Component | Type | Status |
|-----------|------|--------|
| ErrorBoundary | Global class component | ✅ Good |
| ChartErrorBoundary | Chart-specific | ✅ Good |
| LoadingSpinner | Generic | ✅ Good |
| Skeleton | Generic | ✅ Good |
| FallbackUI | Error display | ✅ Good |
| ErrorMessage | Inline error | ✅ Good |
| EmptyState | No data | ✅ Good |
| Retry btn on API errors | Per-page | ⚠️ Partial — not on all pages |

---

# PART 3: DATABASE VALIDATION

## 3.1 Database Constraint Summary

| Type | Count | Status |
|------|-------|--------|
| @unique constraints | 22 (on 15 models) | ✅ 18 adequate, 4 gaps |
| @default values | 60+ | ✅ Comprehensive |
| @@index definitions | 93 (3 composite) | ✅ Good coverage |
| @relation onDelete/onUpdate | 0 | ❌ **ALL MISSING** |
| Native Prisma enums | 18 | ✅ Good |
| String fields → should be enum | 24 | ❌ Weak type enforcement |

## 3.2 Missing Database Constraints

### Critical — No Referential Action on Any Relation
**ALL 100+ relations** lack `onDelete`/`onUpdate`. Default PostgreSQL behavior (`NO ACTION`) prevents deletion of any parent with children. No cascade, set-null, or restrict configured anywhere.

### Important Missing @unique Constraints

| # | Model | Missing Unique | Risk |
|---|-------|---------------|------|
| M1 | **Student** | `phone` | Duplicate phone numbers (Faculty has it unique) |
| M2 | **Parent** | `phone` | Duplicate phone numbers |
| M3 | **Batch** | `(batchName, department, course, semester)` | Duplicate batch entries |
| M4 | **Classroom** | `(building, floor, roomNumber)` | Same room entered twice |
| M5 | **Chapter** | `(chapterName, subjectId)` | Duplicate chapter names per subject |
| M6 | **Holiday** | `(holidayName, startDate)` | Duplicate holidays |
| M7 | **FeePending** | `(student, roll)` | Multiple pending fees per student |
| M8 | **Homework** | (no unique identifier at all) | No way to deduplicate homework |

### Important Missing @@index Definitions

| # | Model | Missing Index | Common Query |
|---|-------|---------------|-------------|
| I1 | **Assignment** | `(dueDate)` | Filter/sort by due date |
| I2 | **Attendance** | `(studentId, attendanceDate)` | Check existing attendance for a student on a date |
| I3 | **Timetable** | `(facultyId, dayOfWeek, startTime)` | Conflict detection |
| I4 | **Homework** | `(status)`, `(dueDate)` | Filter by status or due date |

## 3.3 Denormalization Issues

| Model | Denormalized Fields | Risk |
|-------|-------------------|------|
| **Timetable** | subject, subjectCode, facultyName, batchName, building, floor, roomNumber, batch (9 fields) | Data drift — updates to Subject/Faculty/Batch/Classroom don't propagate |
| **Faculty** | assignedCourses, assignedSubjects, assignedBatches, assignedSemesters (4 JSON fields) | Duplicates data in Assignment/Timetable; not indexable |
| **Exam** | subject, batch (plain strings) | No referential integrity |
| **FeeTransaction** | student, roll (plain strings) | No FK to Student |
| **Parent** | linkedStudent, linkedRoll (plain strings) | No FK to Student |
| **FeeStructure** | dueDate (String) | Cannot do date comparisons |

## 3.4 String Fields That Should Be Native Enums (24 Identified)

Top offenders by impact:
- **Faculty.role** (now `"faculty"` string — should reference UserRole enum)
- **Faculty.status**, **Student.status**, **Timetable.status**, **Exam.status**, **StudyMaterial.status** — all plain strings with defaults
- **Faculty.gender**, **Student.gender** — could be Gender enum
- **Timetable.dayOfWeek** — should be DayOfWeek enum
- **Holiday.holidayType** — should be HolidayType enum
- **FeeTransaction.status** — should be PaymentStatus enum
- **NotificationBroadcast.target** — should be AudienceTarget enum

---

# PART 4: CONSOLIDATED FINDINGS

## Priority Matrix

| ID | Finding | Layer | Severity | Effort |
|----|---------|-------|----------|--------|
| **P0-1** | 8 route modules have ZERO input validation | Backend | Critical | 2 days |
| **P0-2** | All 100+ DB relations lack onDelete/onUpdate | Database | Critical | 1 day |
| **P0-3** | No file type/size validation on upload | Frontend | Critical | 0.5 day |
| **P1-1** | No Yup/Zod schemas on frontend | Frontend | High | 5 days |
| **P1-2** | 24 String fields should be enums | Database | High | 3 days |
| **P1-3** | 3 Zod schemas orphaned (defined but unused) | Backend | High | 0.5 day |
| **P1-4** | 9 missing @unique constraints | Database | High | 2 days |
| **P1-5** | Weak password policy (min 6, no complexity) | Backend | High | 0.5 day |
| **P2-1** | Inconsistent ID validation (.min(1) vs .uuid()) | Backend | Medium | 1 day |
| **P2-2** | Missing .max(100) on submission/evaluation limit | Backend | Medium | 0.5 day |
| **P2-3** | No HTML maxLength on any frontend field | Frontend | Medium | 1 day |
| **P2-4** | No date min/max bounds on any form | Frontend | Medium | 1 day |
| **P2-5** | Missing composite indexes (4 identified) | Database | Medium | 1 day |
| **P3-1** | Pagination schema should be shared (12+ duplicates) | Backend | Low | 1 day |
| **P3-2** | Faculty JSON fields drift risk | Database | Low | 5 days |
| **P3-3** | Timetable denormalization drift risk | Database | Low | 10 days |

## What's Working Well

- **Backend Zod validation** when present is thorough (UUID checks, positive ints, date coercion, enums)
- **Frontend normalizers** (`safe.ts` + `normalizers.ts`) provide excellent runtime API response safety
- **Database indexing** is generous (93 indexes) with smart composite keys
- **18 native Prisma enums** properly constrain critical fields
- **Soft-delete pattern** is consistent across 25 of 39 models
- **UUID primary keys** everywhere with proper `@map` snake_case naming
- **Frontend ErrorBoundary** + ChartErrorBoundary provide solid error containment
- **React Query hooks** use normalized data with safe defaults on failure

---

*End of Validation Audit Report*
