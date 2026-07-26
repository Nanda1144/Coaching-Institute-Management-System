# Changelog — July 26, 2026

## Overview

This document captures all changes made during the July 26, 2026 development session.
Each feature includes its purpose, value to the project, and design constraints.

---

## 1. Sidebar & Navigation Cleanup

### Changes
- **Removed "Reports"** standalone nav item from admin sidebar
- **Removed "Advanced Search"** nav item from admin sidebar
- **Removed "Attendance Reports"** sub-item from Attendance dropdown
- **Removed "My Schedule"** and **"My Timetable"** sub-items from Schedule dropdown in admin sidebar

### Purpose
The admin sidebar had become cluttered with items that either duplicate other routes or are irrelevant for the admin user role. "My Schedule" and "My Timetable" are student/faculty-specific pages that confuse admins. "Reports" is already accessible under Attendance analytics or dedicated report pages.

### Value
- Cleaner navigation with fewer distractions
- Reduced cognitive load for admin users
- Fewer dead-end routes (RoleGuard redirects) that frustrate users

### Constraints
- Items were only removed from the admin nav array; the actual route pages remain accessible via direct URL for cross-role access
- Faculty, Student, and Parent sidebars were left untouched since their items apply directly to those roles

---

## 2. Theme Toggle Removal (Navbar)

### Changes
- Removed the dark/light mode toggle button from the header navbar
- Removed `MdDarkMode` / `MdLightMode` imports
- Removed `darkMode` state and its `useEffect` that toggled the `dark` class on `<html>`

### Purpose
The dark mode implementation was incomplete and led to visual inconsistencies across pages. Components were not designed with dark mode in mind (hardcoded light backgrounds, unreadable text in dark mode, etc.).

### Value
- Eliminates a broken UI feature that negatively impacts user experience
- Prevents users from encountering unreadable pages
- Simplifies the codebase by ~15 lines of state management

### Constraints
- The `localStorage('theme')` entry remains in users' browsers but is no longer read
- Future dark mode implementation should use CSS variables and a proper design system
- No dark mode stylesheets existed, so the toggle was purely cosmetic for the navbar

---

## 3. Role-Aware Quick Actions (Dashboard)

### Changes
- `QuickActions.tsx` now uses `useAuth` to determine the user's role
- Routes are dynamically selected per role:
  - **Timetable**: Faculty → `/faculty/timetable`, Admin → `/timetable`, Student → `/student/timetable`, Parent → `/child-timetable`
  - **Calendar/Conflicts**: Admin/Faculty → `/timetable/calendar`, others → respective timetable
  - **Reports**: Admin/Faculty → `/attendance/reports`, others → `/my-attendance`

### Purpose
The previous version used hardcoded `/dashboard/faculty/timetable` for all roles. Students, parents, and admins would encounter 404s or RoleGuard redirects when clicking "Timetable".

### Value
- Each user role sees appropriate routing
- Eliminates "page not found" errors from the main dashboard
- Students can directly access their timetable, parents their child's timetable

### Constraints
- Relies on `user.role` from AuthContext; if role is undefined, defaults to parent route (safe fallback)
- Route strings must stay in sync with `App.tsx` route definitions
- Faculty route `/faculty/timetable` is RoleGuard-protected for `['FACULTY', 'HOD']`

---

## 4. Quick Timetable Actions Route Fix

### Changes
- Changed route paths in `QuickTimetableActions.tsx`:
  - `/timetable/create` → `/dashboard/timetable/create`
  - `/timetable/calendar` → `/dashboard/timetable/calendar`

### Purpose
The routes used absolute paths (`/timetable/create`) that resolved outside the `/dashboard/*` context, causing 404 errors when users clicked "Create Timetable" or "View Calendar".

### Value
- Both buttons now correctly navigate to the intended pages
- Eliminates user-facing 404 errors on the schedule dashboard

### Constraints
- All dashboard routes are nested under a `/dashboard` prefix in `App.tsx`
- `useNavigate()` with an absolute path (`/dashboard/...`) correctly navigates within the SPA router

---

## 5. Interactive Calendar Error Fix

### Changes
- Moved `const totalEvents = events.length` from **before** to **after** `const [events, setEvents] = useState<CalendarEvent[]>([])`

### Purpose
Line 71 accessed `events.length` before the `events` variable was declared (temporal dead zone), causing:
```
ReferenceError: Cannot access 'events' before initialization
```

### Value
- The calendar page no longer crashes on load
- Users can view the daily/weekly/monthly calendar without errors

### Constraints
- Simply reordered declarations; no logic changes needed
- `totalEvents` is recalculated on every render via `events.length` (no performance concern)

---

## 6. Sidebar Resize → Body Layout Sync

### Changes
- `Sidebar.tsx` sets CSS variable `--sidebar-width` on `document.documentElement` whenever width changes
- `index.css` updated: `.dashboard-main.sidebar-open` now uses `var(--sidebar-width, 280px)` instead of hardcoded `280px`
- Added `.sidebar-resizing .dashboard-main { transition: none }` class to disable margin animation during drag
- Sidebar resize uses `sidebarWidthRef` to persist the final width correctly on mouse-up

### Purpose
Previously, dragging the sidebar resize handle only changed the sidebar itself. The main content area kept its hardcoded 280px left margin, causing a gap or overlap when the sidebar was resized to a different width.

### Value
- The entire page layout follows the sidebar width in real-time during drag
- Smooth spring animation when resize completes
- Width persists across page reloads via localStorage

### Constraints
- Minimum width: 220px; Maximum width: 500px
- Below 1024px viewport, the sidebar overlays (mobile behavior) — no margin adjustment needed
- CSS transition is temporarily disabled during drag to prevent lag

---

## 7. Student / Faculty Timetable Role Guard Expansion

### Changes
- `App.tsx` RoleGuard for `/student/timetable`: added `'SUPER_ADMIN'`, `'ADMIN'`, `'HOD'` to allowed roles
- `App.tsx` RoleGuard for `/faculty/timetable`: added `'SUPER_ADMIN'`, `'ADMIN'` to allowed roles

### Purpose
Admins clicking "My Schedule" or "My Timetable" in the sidebar would be redirected to the admin dashboard by RoleGuard. This was confusing since the sidebar explicitly offers those links.

### Value
- Admins can now view student and faculty timetable pages for reference
- Eliminates "redirected to dashboard" frustration

### Constraints
- Adding more roles to RoleGuard widens access; future security audits may restrict this
- The pages are read-only views — no student/faculty-specific mutations exposed to admin

---

## 8. PDF Receipt Download (Fees Page)

### Changes
- Installed `jspdf` and `jspdf-autotable` packages
- Added `downloadReceipt()` function in `AdminFeesPage.tsx`
- Wired the existing "PDF" button in the Collection table to trigger `downloadReceipt`
- Receipt includes: EduManage header, receipt number, date, student details (name, roll), amount table, total, and auto-generated notice

### Purpose
The "PDF" button in the Collection tab was non-functional (no onClick handler). Fee managers needed downloadable receipts for record-keeping and distribution to students/parents.

### Value
- One-click receipt generation saves manual receipt writing
- Professional PDF format suitable for printing and emailing
- Reduces administrative overhead

### Constraints
- Uses client-side PDF generation (no backend endpoint)
- Relies on transaction data loaded from the fee API
- PDF format is A4 portrait with standard margins
- Large fonts use `helvetica` (standard PDF font, no embedding needed)

---

## 9. Settings Page — 404 & localStorage Fallback

### Changes
- Modified `settings.service.ts` to catch API 404 errors and fall back to localStorage
- Settings data is stored in `localStorage('app_settings')` as JSON
- On successful API response, data is cached to localStorage
- On API failure, cached/local defaults are returned
- `updateSettings()` follows same pattern: try API → on failure, save locally
- Settings data persists across page reloads

### Purpose
The `/api/settings` endpoint does not exist on the backend. Visiting `/dashboard/settings` showed numerous 404 console errors and the settings page could not load or save any data.

### Value
- Settings page is fully functional with data persistence
- No 404 console errors
- When the backend eventually implements the settings API, the service will seamlessly migrate to using it
- Logo uploads, institute name, and other preferences survive page reloads

### Constraints
- localStorage has a ~5MB limit (sufficient for text settings and small logo data URLs)
- Settings are per-browser; they do not sync across devices
- No server-side validation of settings values

---

## 10. Holiday Management — Full CRUD with Draft/Announce

### Changes
- **Type**: Added `'draft'` to `HolidayStatus` union type
- **New component**: `HolidayFormModal.tsx` — modal form with fields (name, date, type, department, description), preview toggle, and dual-action buttons
- **HolidayList.tsx**: Replaced "Details" button with Edit, Delete, and Announce action buttons per row; status badge updated to handle `'draft'`
- **HolidayManagementPage.tsx**: Refactored data fetching into `fetchData` callback; added `handleCreate`, `handleEdit`, `handleSave`, `handleDelete`, `handleAnnounce` handlers; wired modal and list actions

### Actions available:
- **Create Holiday** button in header → opens blank form modal
- **Preview** toggle shows animated card with holiday details as they would appear
- **Save as Draft** persists holiday with `status: 'draft'` (visible only in admin view)
- **Save & Announce** persists with `status: 'upcoming'` (visible on calendar to all users)
- **Edit** button per row → opens modal pre-filled with existing data
- **Delete** button per row → confirmation prompt → removes holiday
- **Announce** button (draft items only) → promotes `draft` → `upcoming`

### Purpose
The holiday management page was read-only — users could only view holidays but not create, edit, or delete them. This made it impossible for administrators to maintain the academic calendar.

### Value
- Complete holiday lifecycle management: draft → preview → announce → edit → delete
- Draft workflow prevents premature announcements
- Preview ensures correct data before publishing
- Reduces dependency on backend admin panels for calendar management

### Constraints
- Delete uses `window.confirm()` — could be replaced with a custom modal for consistency
- Status badge colors: Draft = amber, Upcoming = blue, Ongoing = emerald, Completed = gray
- Announce button only appears on items with `status === 'draft'`
- Form validation requires at minimum a name and date to save

---

## 11. Logo Upload (Settings → Institute)

### Changes
- Added `logo: { type: 'file' }` to the institute section `FIELD_TYPES` in `SettingsPage.tsx`
- Added `handleFileUpload` function that reads the selected file as a data URL via `FileReader`
- Added `MdUpload` icon import
- Updated form rendering to handle `type: 'file'` with preview, remove button, and file picker
- `settings.service.ts` defaults include `logo: ''` for the institute section
- `Sidebar.tsx` reads logo from `localStorage('app_settings')` and displays it; falls back to default `MdSchool` icon

### Purpose
Institutes want to brand their CIMS platform with their own logo instead of the default EduManage icon. The logo should appear in the sidebar for all authenticated pages.

### Value
- Custom branding across all dashboard pages
- Logo is persisted (via localStorage fallback) and survives reloads
- No server-side storage needed during development

### Constraints
- Logo is stored as a base64 data URL in localStorage (~5MB limit applies)
- Very large image files may exceed localStorage quota
- File types: any image format accepted by the browser (JPEG, PNG, GIF, WebP, SVG)
- Logo resets per browser (not per user account) since it uses localStorage

---

## 12. Copyright Footer (All Dashboard Pages)

### Changes
- Added `<footer>` element inside `MainLayout` in `App.tsx` below the `<main>` content
- Footer displays: `© {currentYear} EduManage. All rights reserved.`
- Applied `min-height` to `<main>` to push footer to bottom when content is short
- Footer styling: subtle border-top, centered text, small gray font

### Purpose
No copyright notice existed anywhere in the application. A footer provides legal protection and professional appearance.

### Value
- Legal requirement for displaying copyright
- Professional polish on every dashboard page
- Dynamic year updates automatically

### Constraints
- Appears on all authenticated pages (under `/dashboard/*`)
- Not shown on landing page or public routes (outside MainLayout)
- Year is dynamically generated via `new Date().getFullYear()`

---

## Summary

| # | Feature | Files Changed | Status |
|---|---------|---------------|--------|
| 1 | Sidebar cleanup | `Sidebar.tsx` | Done |
| 2 | Theme toggle removed | `Navbar.tsx` | Done |
| 3 | Role-aware QuickActions | `QuickActions.tsx` | Done |
| 4 | Timetable route fix | `QuickTimetableActions.tsx` | Done |
| 5 | Calendar ReferenceError fix | `InteractiveCalendarPage.tsx` | Done |
| 6 | Sidebar resize → body sync | `Sidebar.tsx`, `index.css` | Done |
| 7 | RoleGuard expansion | `App.tsx` | Done |
| 8 | PDF receipt download | `AdminFeesPage.tsx`, `package.json` | Done |
| 9 | Settings localStorage fallback | `settings.service.ts` | Done |
| 10 | Holiday CRUD + draft/announce | Multiple holiday files | Done |
| 11 | Logo upload | `SettingsPage.tsx`, `Sidebar.tsx`, `settings.service.ts` | Done |
| 12 | Copyright footer | `App.tsx` | Done |

### Pre-existing Issues (not introduced by these changes)
- `ReportActions.tsx` — unused imports `MdPictureAsPdf`, `MdTableChart`
- `CalendarSidebar.tsx` — unused import `motion`
