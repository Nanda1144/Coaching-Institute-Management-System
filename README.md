# EduManage — Faculty Management ERP

A modern, responsive **Faculty Management System** built as a Single Page Application (SPA) with dummy JSON data. Designed for college administrators to manage faculty records, assignments, transfers, and profiles with an intuitive dashboard interface.

---

## Tech Stack

| Layer            | Technology                                     |
| ---------------- | ---------------------------------------------- |
| **Framework**    | React 19                                       |
| **Language**     | TypeScript 6 (strict mode)                     |
| **Build Tool**   | Vite 8                                         |
| **Styling**      | Tailwind CSS v4 (via `@tailwindcss/vite`)      |
| **Routing**      | React Router v7                                |
| **Animations**   | Framer Motion v12                              |
| **Icons**        | React Icons (Material Design icons)            |
| **Charts**       | Recharts                                       |
| **Forms**        | React Hook Form v7                             |
| **Export**       | SheetJS (xlsx) — CSV & XLSX export             |
| **State Mgmt**   | Component-local state (`useState` / `useMemo`) |
| **Data Source**  | Dummy JSON (no backend / no API)               |

---

## Features

### 7 Route Modules

| Route                 | Page              | Description                                      |
| --------------------- | ----------------- | ------------------------------------------------ |
| `/`                   | Dashboard         | Statistics, charts, recent activities, schedule  |
| `/faculty`            | Faculty List      | Sortable table, filters, pagination, CRUD        |
| `/faculty/add`        | Add Faculty       | Form to add a new faculty member                 |
| `/faculty/edit/:id`   | Edit Faculty      | Edit existing faculty details                    |
| `/faculty/profile/:id`| Faculty Profile   | Full profile with courses, timetable, documents  |
| `/faculty/assign`     | Assign Course     | Assign courses to faculty members                |
| `/faculty/transfer`   | Transfer Faculty  | Transfer faculty between branches                |
| `/faculty/search`     | Search Faculty    | Advanced search across all faculty records       |

### Implemented Tasks

1. **Export CSV / XLSX** — Export button with dropdown for CSV or XLSX download of current faculty list.
2. **Delete Faculty with Reason** — Delete button opens a confirmation modal requiring a deletion reason before proceeding.
3. **Assign Course** — Assign Course button navigates to the assignment page with the faculty ID pre-selected.
4. **Profile Card Fix** — Content text darkened for readability; gradient overlay z-index corrected.
5. **Sidebar Animation** — Smooth spring-based slide-in/out animation when toggling the sidebar.
6. **Profile Actions** — Edit and Assign Course buttons on the profile page are now fully wired to navigation.
7. **Dropdown Z-Index** — Faculty selector dropdown z-index raised to prevent overlap issues.

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later (ships with Node.js)

---

## Step-by-Step Execution

### 1. Clone / Navigate to Project

```bash
cd C:\nanda\ramp msme\coaching-instiution-management-system\Mytasks\faculty-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This installs all runtime and dev dependencies listed in `package.json`.

### 3. Start the Development Server (Frontend)

```bash
npm run dev
```

The Vite dev server starts at **http://localhost:5173** with hot module replacement (HMR). Open this URL in your browser.

### 4. Available Scripts

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start Vite development server (HMR enabled)        |
| `npm run build`     | Type-check with `tsc` then build for production    |
| `npm run preview`   | Preview the production build locally               |

### 5. Production Build

```bash
npm run build
```

Output is written to the `dist/` folder. You can serve it with:

```bash
npm run preview
```

---

## Backend

**This is a pure frontend application.** There is no backend server, database, or API integration. All data is provided as dummy JSON files located in each feature module's `data/` directory. No backend setup is required.

If you need backend integration in the future, the modular structure allows easy replacement of data files with API calls.

---

## Project Structure

```
faculty-dashboard/
├── index.html                 # Entry HTML
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── public/                    # Static assets (favicon, icons)
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Root component with routing
│   ├── index.css              # Global styles (Tailwind v4)
│   ├── components/            # Shared UI components
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── Navbar.tsx         # Top navigation bar
│   │   ├── Toast.tsx          # Toast notification
│   │   └── ...                # Other shared components
│   ├── data/
│   │   └── dashboardData.ts   # Dashboard mock data
│   ├── pages/
│   │   └── Dashboard.tsx      # Dashboard page
│   └── features/              # Feature modules
│       ├── faculty/           # Faculty list (CRUD)
│       ├── add-faculty/       # Add / Edit faculty
│       ├── faculty-profile/   # Faculty profile view
│       ├── faculty-assignment/# Course assignment
│       ├── faculty-transfer/  # Faculty transfer
│       └── faculty-search/    # Faculty search
└── dist/                      # Production build output
```

Each feature module follows a consistent structure:

```
faculty/
├── components/    # UI components
├── data/          # Mock data files
├── hooks/         # Custom React hooks
├── pages/         # Page-level components
└── types/         # TypeScript interfaces
```

---

## Troubleshooting

| Issue                          | Solution                                      |
| ------------------------------ | --------------------------------------------- |
| `npm install` fails            | Ensure Node.js v18+ is installed              |
| Port 5173 in use               | Vite auto-picks next available port           |
| TypeScript errors during build | Run `npm run build` to see detailed errors    |
| Blank page after build         | Ensure `index.html` is present in `dist/`     |

---

## License

Internal project — College ERP System.
