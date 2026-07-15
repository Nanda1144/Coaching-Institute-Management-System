# Batch Management - CIIMS

**Task IDs:** FE2-027 (Batch List), FE2-028 (Add Batch)

## Task Description

A unified batch management module for the Coaching Institute Management System (CIIMS) combining batch listing with search/filter/pagination and a fully validated batch creation form. The two features share a common state so that batches created via the form appear immediately in the list.

## Features

### Batch List (FE2-027)
- Responsive table with 9 columns: Batch ID, Batch Name, Course, Faculty, Schedule, Classroom, Students, Status, Actions
- Real-time search by batch name, ID, course, or faculty
- Filter dropdowns for Course, Faculty, Status, and Schedule
- Clear Filters button to reset all filters
- Total matching batch count displayed in header
- Pagination with page navigation and rows-per-page selector (5, 10, 20, 50)
- View, Edit, and Delete action buttons per row
- Loading spinner state
- Empty state and "No batches found" state

### Add Batch (FE2-028)
- 12 form fields across 3 sections: Basic Information, Schedule, Status
- Dropdowns for Course, Faculty (with department), and Classroom (with capacity)
- Multi-day selector with toggle chips (Mon–Sun)
- Full client-side validation with inline error messages
- Date validation: prevents past start dates, end date must be after start date
- Time validation: end time must be after start time
- Success notification modal on valid submission
- Create Batch, Reset, and Cancel buttons

### Merged Workflow
- Sidebar navigation between Batch List and Add Batch pages
- Shared batch state persisted in `sessionStorage`
- New batches created in Add Batch immediately appear in Batch List
- Batch List data persists across page navigation and browser refreshes

## Technologies Used

- **React 18** – UI library
- **Vite 5** – Build tool and dev server
- **JavaScript (JSX)** – Application logic
- **CSS3** – Styling with responsive design

## Project Structure

```
batch-management/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx / Sidebar.css
│   │   ├── Header.jsx / Header.css
│   │   ├── SearchBar.jsx / SearchBar.css
│   │   ├── FilterPanel.jsx / FilterPanel.css
│   │   ├── BatchTable.jsx / BatchTable.css
│   │   ├── Pagination.jsx / Pagination.css
│   │   ├── StatusBadge.jsx / StatusBadge.css
│   │   ├── LoadingState.jsx / LoadingState.css
│   │   ├── EmptyState.jsx / EmptyState.css
│   │   ├── FormField.jsx / FormField.css
│   │   ├── DaySelector.jsx / DaySelector.css
│   │   ├── SuccessNotification.jsx / SuccessNotification.css
│   │   └── BatchForm.jsx / BatchForm.css
│   ├── pages/
│   │   ├── BatchListPage.jsx
│   │   └── AddBatchPage.jsx
│   ├── data/
│   │   ├── batches.js
│   │   └── formData.js
│   ├── hooks/
│   │   ├── useBatchFilters.js
│   │   └── useFormValidation.js
│   ├── App.jsx / App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installation Steps

1. Navigate to the `batch-management` directory:
   ```bash
   cd batch-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## How to Run the Project

```bash
npm run dev
```

The development server will start at `http://localhost:5173`.

### Other Commands

- `npm run build` – Build for production to the `dist/` folder
- `npm run preview` – Preview the production build locally

## Workflow

1. **Batch List** (default page) – Displays all existing batches with search, filter, and pagination
2. Click **Add Batch** in the sidebar – Navigates to the creation form
3. Fill out the form and click **Create Batch** – Validates all fields and shows a success modal
4. Click **OK** on the modal, then click **Batch List** in the sidebar – The new batch appears in the table
5. Data persists in `sessionStorage` across page refreshes within the same browser tab

## Form Validation

| Field | Rule |
|---|---|
| Batch Name | Required, min 3 characters |
| Batch Code | Required, alphanumeric (hyphens allowed) |
| Course | Required selection |
| Faculty | Required selection |
| Classroom | Required selection |
| Start Date | Required, cannot be in the past |
| End Date | Required, must be after start date |
| Start Time | Required |
| End Time | Required, must be after start time |
| Days | At least one day required |
| Max Students | Required, 1–200 |

## Available Frontend Functionality

- **Sidebar** – Collapsible navigation with active page highlighting; navigates between Batch List and Add Batch (other items are placeholders)
- **Batch List** – Full CRUD-adjacent UI with search, 4 filter dimensions, pagination, and action buttons
- **Add Batch** – Complete validated form with day selector, dropdowns, and success notification
- **State Persistence** – Batches stored in `sessionStorage` survive page refreshes

## Screenshots

*Screenshots to be added.*

## Future Improvements

- Integrate with real backend API
- Edit and Delete functionality on batch rows
- Batch code auto-generation
- Classroom availability validation
- Duplicate batch name/code detection
- Bulk batch creation via CSV upload
- Sortable table columns
- Dark mode toggle
- Export batch list to CSV/Excel
- Role-based access control
