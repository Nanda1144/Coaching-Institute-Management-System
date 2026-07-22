# EduManage — Faculty Management ERP

A full-stack **Faculty Management System** built with React + Express + PostgreSQL. Designed for college administrators to manage faculty records, attendance, timetables, assignments, transfers, and profiles with an intuitive dashboard interface.

---

## Tech Stack

| Layer            | Technology                                     |
| ---------------- | ---------------------------------------------- |
| **Frontend**     | React 19, TypeScript, Vite 8                   |
| **Styling**      | Tailwind CSS v4 (via `@tailwindcss/vite`)      |
| **Routing**      | React Router v7                                |
| **Animations**   | Framer Motion v12                              |
| **Icons**        | React Icons (Material Design icons)            |
| **Charts**       | Recharts                                       |
| **Forms**        | React Hook Form v7                             |
| **Export**       | SheetJS (xlsx) — CSV & XLSX export             |
| **State Mgmt**   | React Query + Component-local state            |
| **Backend**      | Express.js, Prisma ORM, PostgreSQL             |
| **Auth**         | JWT (access + refresh tokens)                  |

---

## Features

### Feature Modules

| Module                    | Description                                      |
| ------------------------- | ------------------------------------------------ |
| **Dashboard**             | Statistics, charts, recent activities, schedule  |
| **Faculty**               | Faculty list with sortable table, filters, CRUD  |
| **Add/Edit Faculty**      | Multi-section form for faculty registration      |
| **Faculty Profile**       | Full profile with courses, timetable, documents  |
| **Faculty Assignment**    | Assign courses to faculty members                |
| **Faculty Transfer**      | Transfer faculty between branches                |
| **Faculty Search**        | Advanced search across all faculty records       |
| **Attendance**            | Record and manage attendance                     |
| **Attendance Analytics**  | Charts and insights on attendance data           |
| **Attendance Correction** | Request and approve attendance corrections       |
| **Attendance History**    | View historical attendance records               |
| **Attendance Reports**    | Generate attendance reports                      |
| **Timetable**             | View and manage timetables                       |
| **Create Timetable**      | Create new timetable entries                     |
| **Face Recognition**      | Face-based attendance marking                    |
| **Fingerprint Attendance**| Fingerprint-based attendance marking             |
| **QR Attendance**         | QR code-based attendance marking                 |
| **Manual Attendance**     | Manual attendance entry                          |
| **Holiday Management**    | Manage holidays and special events               |
| **Interactive Calendar**  | Calendar view of schedules and events            |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later (ships with Node.js)
- **PostgreSQL** 14 or later (for backend)

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

### 4. Available Scripts (Frontend)

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start Vite development server (HMR enabled)        |
| `npm run build`     | Type-check with `tsc` then build for production    |
| `npm run preview`   | Preview the production build locally               |

### 5. Backend Setup

```bash
cd backend
npm install
```

Set up your PostgreSQL database, then configure `backend/.env` (see `.env.example`).

Run migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

The API server starts at **http://localhost:5000/api**.

### 6. Production Build (Frontend)

```bash
npm run build
```

Output is written to the `dist/` folder. You can serve it with:

```bash
npm run preview
```

---

## Project Structure

```
faculty-dashboard/
├── index.html                 # Entry HTML
├── package.json               # Frontend dependencies & scripts
├── tsconfig.json              # Frontend TypeScript config
├── vite.config.ts             # Vite configuration
├── .env                       # Frontend environment variables
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
│   ├── hooks/                 # Custom React hooks
│   ├── pages/
│   │   └── Dashboard.tsx      # Dashboard page
│   ├── services/              # API service layer
│   └── features/              # Feature modules
│       ├── faculty/           # Faculty list (CRUD)
│       ├── add-faculty/       # Add / Edit faculty
│       ├── faculty-profile/   # Faculty profile view
│       ├── attendance/        # Attendance management
│       ├── timetable/         # Timetable management
│       └── ...                # Other feature modules
├── backend/
│   ├── package.json           # Backend dependencies
│   ├── tsconfig.json          # Backend TypeScript config
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── src/
│       ├── server.ts          # Entry point
│       ├── app.ts             # Express app setup
│       ├── config/            # Configuration
│       ├── modules/           # Route modules
│       └── shared/            # Shared middleware & utils
└── dist/                      # Frontend build output
```

Each feature module follows a consistent structure:

```
faculty/
├── components/    # UI components
├── data/          # Form options / UI config constants
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
| Backend won't start            | Check PostgreSQL is running and `.env` is set |
| Prisma migration fails         | Verify database credentials in `backend/.env` |

---

## License

Internal project — College ERP System.
