# HRMS Lite Frontend

A modern, production-ready React frontend for Human Resource Management System Lite with full backend integration.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Pages & Components](#pages--components)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#screenshots)

---

## Project Overview

HRMS Lite Frontend is a React-based single-page application that provides a professional user interface for managing employees and tracking attendance. It integrates seamlessly with the FastAPI backend.

### Key Features Implemented
- ✅ Employee Management (CRUD operations)
- ✅ Attendance Tracking
- ✅ Auto-generated Employee IDs
- ✅ Responsive Design
- ✅ Error Handling with Toast Notifications
- ✅ Loading States
- ✅ Form Validation
- ✅ Confirmation Dialogs
- ✅ Filtering and Search
- ✅ Attendance Summary Dashboard

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Core** | React | 18.2.0 |
| **Language** | TypeScript | 5.2.2 |
| **Build Tool** | Vite | 5.4.21 |
| **Styling** | Tailwind CSS | 3.3.6 |
| **Routing** | React Router DOM | 6.20.0 |
| **State Management** | Redux Toolkit | 1.9.7 |
| **HTTP Client** | Axios | 1.6.2 |
| **Forms** | React Hook Form | 7.48.2 |
| **Validation** | Zod | 3.22.4 |
| **Notifications** | React Hot Toast | 2.4.1 |
| **Icons** | Lucide React | 0.303.0 |
| **Date Handling** | date-fns | 2.30.0 |

---

## Features

### 👥 Employee Management
- View all employees in a responsive card layout
- Add new employees with auto-generated IDs
- Edit existing employee details
- Delete employees with confirmation dialog
- Search employees by name, ID, or email
- Filter employees by department
- View detailed employee information on separate page
- See employee's attendance history

### 📅 Attendance Tracking
- Mark daily attendance for employees
- View attendance records in sortable table
- Filter attendance by date range, employee, and status
- Edit/delete attendance records
- Export attendance data to CSV
- View attendance summary with statistics
- See present/absent counts and percentages
- Visual attendance rate progress bar

### 🎨 UI/UX Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Loading States** - Spinners and skeleton loading
- **Error Boundaries** - Graceful error handling
- **Toast Notifications** - Success/error messages
- **Empty States** - Professional empty state illustrations
- **Confirmation Dialogs** - Prevent accidental deletions
- **Form Validation** - Real-time field validation
- **Search & Filter** - Quick data filtering
- **Fixed Navigation** - Persistent navbar and sidebar

---

## Prerequisites

Before you begin, ensure you have installed:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 18.x or higher | `node --version` |
| npm | 9.x or higher | `npm --version` |
| Git | Latest | `git --version` |

---

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/zaidalam29/HRMS-Lite-Frontend.git
cd HRMS-Lite/frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=HRMS Lite
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at **http://localhost:5173**

---

## Project Structure

```text
frontend/
│
├── public/                      # Static files
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Main App component with routing
│   ├── vite-env.d.ts            # Vite environment types
│   │
│   ├── api/                     # API integration layer
│   │   ├── client.ts            # Axios instance with interceptors
│   │   ├── employees.ts         # Employee API calls
│   │   └── attendance.ts        # Attendance API calls
│   │
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared components
│   │   │   ├── Layout.tsx       # Main layout with navbar/sidebar
│   │   │   ├── Navbar.tsx       # Top navigation bar
│   │   │   ├── Sidebar.tsx      # Side navigation menu
│   │   │   ├── LoadingSpinner.tsx  # Loading indicator
│   │   │   ├── ErrorMessage.tsx    # Error display component
│   │   │   ├── EmptyState.tsx      # Empty data state
│   │   │   ├── ConfirmDialog.tsx   # Confirmation modal
│   │   │   ├── Modal.tsx           # Reusable modal
│   │   │   └── Toast.tsx           # Toast notification
│   │   │
│   │   ├── employees/           # Employee-specific components
│   │   │   ├── EmployeeList.tsx # Grid view of employees
│   │   │   └── EmployeeForm.tsx # Add/edit employee form
│   │   │
│   │   └── attendance/          # Attendance-specific components
│   │       ├── AttendanceForm.tsx    # Mark attendance form
│   │       ├── AttendanceList.tsx    # Attendance records table
│   │       ├── AttendanceFilters.tsx # Filter controls
│   │       └── AttendanceSummary.tsx # Attendance statistics
│   │
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── EmployeesPage.tsx    # Employee management page
│   │   ├── AttendancePage.tsx   # Attendance tracking page
│   │   ├── EmployeeDetailsPage.tsx # Individual employee view
│   │   └── NotFoundPage.tsx     # 404 page
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useEmployees.ts      # Employee data and operations
│   │   └── useAttendance.ts     # Attendance data and operations
│   │
│   ├── store/                   # Redux store
│   │   ├── index.ts             # Store configuration
│   │   └── slices/              # Redux slices
│   │       ├── employeeSlice.ts     # Employee state management
│   │       └── attendanceSlice.ts   # Attendance state management
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── employee.ts          # Employee types
│   │   ├── attendance.ts        # Attendance types
│   │   ├── api.ts               # API response types
│   │   └── index.ts             # Central type exports
│   │
│   ├── utils/                   # Utility functions
│   │   ├── formatters.ts        # Date/number formatting
│   │   ├── validators.ts        # Validation functions
│   │   └── constants.ts         # App constants
│   │
│   └── styles/                  # Global styles
│       └── globals.css          # Tailwind imports and custom styles
│
├── .env.example                 # Environment variables example
├── .gitignore
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # TypeScript for Node
├── vite.config.ts               # Vite configuration
└── README.md                    # This file
```

---

## Configuration

### Environment Variables

Create a `.env` file:

```env
# Backend API URL (required)
VITE_API_URL=http://localhost:8000

# Application name (optional)
VITE_APP_NAME=HRMS Lite
```

### Tailwind CSS Configuration

`tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

### Vite Configuration

`vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

---

## Running the Application

### Development Mode

```bash
# Start development server with hot reload
npm run dev

# The app will be available at http://localhost:5173
```

### Production Preview

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Pages & Components

### 📊 Dashboard (`/dashboard`)
- Overview statistics
- Quick action buttons
- Recent activity feed
- Today's attendance summary

### 👥 Employees Page (`/employees`)
- List of all employees in card layout
- Search and filter functionality
- Add/Edit/Delete employees
- Quick view employee details

### 📅 Attendance Page (`/attendance`)
- Mark daily attendance
- View attendance records table
- Filter by employee, date, status
- Export to CSV
- Attendance summary for selected employee

### 👤 Employee Details Page (`/employees/:id`)
- Detailed employee information
- Attendance history
- Delete confirmation
- Edit option

---

## API Integration

### API Client (`src/api/client.ts`)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail?.message || 'An error occurred';
    console.error('❌ API Error:', message);
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Employee API (`src/api/employees.ts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAll()` | `GET /api/v1/employees/` | Get all employees |
| `getById(id)` | `GET /api/v1/employees/{id}` | Get employee by ID |
| `create(data)` | `POST /api/v1/employees/` | Create new employee |
| `update(id, data)` | `PUT /api/v1/employees/{id}` | Update employee |
| `delete(id)` | `DELETE /api/v1/employees/{id}` | Delete employee |

### Attendance API (`src/api/attendance.ts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `mark(data)` | `POST /api/v1/attendance/` | Mark attendance |
| `getAll(params)` | `GET /api/v1/attendance/` | Get attendance records |
| `getByEmployee(id, params)` | `GET /api/v1/attendance/employee/{id}` | Get employee attendance |
| `getById(id)` | `GET /api/v1/attendance/{id}` | Get attendance by ID |
| `update(id, data)` | `PUT /api/v1/attendance/{id}` | Update attendance |
| `delete(id)` | `DELETE /api/v1/attendance/{id}` | Delete attendance |
| `getSummary(id, params)` | `GET /api/v1/attendance/summary/employee/{id}` | Get attendance summary |

---

## State Management

### Custom Hooks

#### `useEmployees.ts`

```typescript
const {
  employees,           // Employee[]
  selectedEmployee,    // Employee | null
  total,               // number
  loading,             // boolean
  error,               // string | null
  fetchEmployees,      // () => Promise<void>
  getEmployee,         // (id: string) => Promise<Employee | null>
  createEmployee,      // (data: EmployeeCreate) => Promise<Employee | null>
  updateEmployee,      // (id: string, data: EmployeeUpdate) => Promise<Employee | null>
  deleteEmployee,      // (id: string) => Promise<boolean>
} = useEmployees();
```

#### `useAttendance.ts`

```typescript
const {
  records,             // Attendance[]
  total,               // number
  loading,             // boolean
  error,               // string | null
  summary,             // AttendanceSummary | null
  fetchAttendance,     // (params?) => Promise<void>
  fetchAttendanceByEmployee, // (params) => Promise<void>
  markAttendance,      // (data) => Promise<Attendance | null>
  updateAttendance,    // (id, data) => Promise<Attendance | null>
  deleteAttendance,    // (id) => Promise<boolean>
  fetchSummary,        // (params) => Promise<void>
} = useAttendance();
```

---

## Error Handling

### Global Error Handling (API Client)
- Network errors
- 4xx/5xx responses
- Timeout errors

### Form Validation (React Hook Form + Zod)
- Required fields
- Email format validation
- Date validation (no future dates)
- Custom validation rules

### UI Error States
- `ErrorMessage` component
- Toast notifications
- Form field errors
- Empty states

### Error Boundary
- Prevents entire app from crashing
- Fallback UI for component errors

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Manual Testing Checklist
- Employee creation (with/without ID)
- Employee editing
- Employee deletion with confirmation
- Employee search and filter
- Mark attendance
- Edit attendance
- Delete attendance
- Filter attendance records
- Export to CSV
- Responsive design on mobile
- Error scenarios (duplicate email, future dates)

---

## Building for Production

```bash
# Create production build
npm run build

# The build output will be in the 'dist' folder
# Preview the build locally
npm run preview
```

### Build Output

```text
dist/
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── vendor-[hash].js
├── index.html
└── vite.svg
```

---

## Deployment

### Deploy to Vercel

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Deploy:**
```bash
vercel
```

Follow the prompts and set environment variables:
- `VITE_API_URL`: Your production backend URL

### Deploy to Netlify

**Build the project:**
```bash
npm run build
```

Then drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop), or connect your GitHub repository to Netlify.

### Environment Variables for Production

```env
VITE_API_URL=https://your-backend-api.onrender.com
VITE_APP_NAME=HRMS Lite
```

---

## Troubleshooting

### 1. Blank Page / No UI

**Check:**
- Browser console for errors
- CSS imports in `main.tsx`
- Tailwind configuration

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 2. API Connection Errors

**Check:**
- Backend is running (`http://localhost:8000/health`)
- CORS configuration on backend
- `.env` file has correct `VITE_API_URL`

**Solution:**
```env
VITE_API_URL=http://localhost:8000  # Make sure no trailing slash
```

### 3. Navbar Overlapping Content

**Check:**
- `Layout.tsx` has proper padding (`pt-16`)
- Navbar has fixed height (`h-16`)

**Solution:**
```tsx
// In Layout.tsx
<div className="flex pt-16">...</div>

// In Navbar.tsx
<nav className="fixed top-0 h-16">...</nav>
```

### 4. TypeScript Errors

**Check:**
- Types are properly defined
- Imports are correct

**Solution:**
```
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS server"
```

### 5. Build Fails

**Check:**
- All dependencies are installed
- No TypeScript errors

**Solution:**
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Browser Console Errors

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| `fetchAttendanceByEmployee is not a function` | Missing function in hook | Update `useAttendance.ts` |
| `selectedEmployee does not exist` | Missing state in hook | Update `useEmployees.ts` |
| `Failed to fetch` | Backend not running | Start backend server |
| `404 for /undefined` | Undefined ID in API call | Add null checks |

---

## Screenshots

### Dashboard

```
┌─────────────────────────────────────────────┐
│  HRMS Lite                         Admin    │
├─────────────────────────────────────────────┤
│  Dashboard - March 07, 2026                 │
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────┐│
│  │  Total  │ │ Present │ │ Absent  │ │Rate││
│  │Employees│ │  Today  │ │  Today  │ │85% ││
│  │   24    │ │   18    │ │    6    │ │    ││
│  └─────────┘ └─────────┘ └─────────┘ └────┘│
│                                             │
│  ┌──────────────────────┐ ┌───────────────┐ │
│  │ Quick Actions        │ │Recent Activity│ │
│  │  • Add Employee      │ │ John - Present│ │
│  │  • Mark Attendance   │ │ Jane - Absent │ │
│  └──────────────────────┘ └───────────────┘ │
└─────────────────────────────────────────────┘
```

### Employees Page

```
┌─────────────────────────────────────────────┐
│  Employees                          + Add   │
├─────────────────────────────────────────────┤
│  ┌──────────────────┐                       │
│  │ Search: ________ │ Department: [All] ▼   │
│  └──────────────────┘                       │
│                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │  John Doe   │ │ Jane Smith  │ │  Bob   │ │
│  │ Engineering │ │  Marketing  │ │ Sales  │ │
│  │   EMP001    │ │   EMP002    │ │ EMP003 │ │
│  │ [Edit][Del] │ │ [Edit][Del] │ │ [Edit] │ │
│  └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────┘
```

### Attendance Page

```
┌─────────────────────────────────────────────┐
│  Attendance                        + Mark   │
├─────────────────────────────────────────────┤
│  Filters: [Employee▼] [Date Range▼] [Status▼]│
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │ Employee      Date        Status  Notes ││
│  ├─────────────────────────────────────────┤│
│  │ John Doe    2026-03-07  Present    ✓   ││
│  │ Jane Smith  2026-03-07  Absent     ✗   ││
│  │ Bob Wilson  2026-03-06  Present    ✓   ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Summary for John Doe:                      │
│  Present: 18  Absent: 6  Rate: 75% █████   │
└─────────────────────────────────────────────┘
```

---

## Quick Start (5 Minutes)

```bash
# 1. Clone and enter frontend directory
git clone https://github.com/zaidalam29/HRMS-Lite-Frontend.git
cd HRMS-Lite/frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# 4. Make sure backend is running (open another terminal)
cd ../backend
python -m venv venv
venv\Scripts\activate
uvicorn app.main:app --reload

# 5. Start frontend
cd ../frontend
npm run dev

# 6. Open browser
# http://localhost:5173
```

---

## Backend git url
```bash
git clone https://github.com/zaidalam29/HRMS-Lite.git
```
---
## Author

**Your Name**

- GitHub: [@zaidalam29](https://github.com/zaidalam29)
- Email: zaidalam29@gmail.com

---

## License

This project is created for assignment purposes only.

---
