# PeopleCore HR System — Full Documentation

> A full-stack HR management system built with **React + Node.js**, covering all core HR operations from employee management to compliance reporting.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [System Architecture](#2-system-architecture)
3. [Module Flow](#3-module-flow)
   - 3.1 [Dashboard](#31-dashboard)
   - 3.2 [Employee Management](#32-employee-management)
   - 3.3 [Attendance & Leave](#33-attendance--leave)
   - 3.4 [Payroll](#34-payroll)
   - 3.5 [Recruitment](#35-recruitment)
   - 3.6 [Performance Reviews](#36-performance-reviews)
   - 3.7 [Reports Center](#37-reports-center)
4. [Data Flow Diagram](#4-data-flow-diagram)
5. [Tech Stack](#5-tech-stack)
6. [Project Folder Structure](#6-project-folder-structure)
7. [Database Schema (Key Tables)](#7-database-schema-key-tables)
8. [API Endpoints](#8-api-endpoints)
9. [Setup Guide — Step by Step](#9-setup-guide--step-by-step)
10. [Environment Variables](#10-environment-variables)
11. [User Roles & Permissions](#11-user-roles--permissions)
12. [Report Types](#12-report-types)

---

## 1. System Overview

**PeopleCore** is a web-based HR Management System (HRMS) designed to manage all HR operations in one place.

| Feature | Description |
|---|---|
| Employee Management | Add, edit, search, and manage all employee records |
| Attendance & Leave | Track daily attendance, approve/reject leave requests |
| Payroll | Calculate salary, deductions, bonuses, and generate payslips |
| Recruitment | Manage job postings and candidate pipeline |
| Performance Reviews | Set goals, rate employees, flag PIPs |
| Reports Center | Workforce, payroll, attendance, turnover, and compliance reports |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                   │
│         React.js (Vite + Tailwind)          │
│  Dashboard / Employees / Payroll / Reports  │
└─────────────────┬───────────────────────────┘
                  │ HTTP / REST API (JSON)
┌─────────────────▼───────────────────────────┐
│                  Backend                    │
│           Node.js + Express.js              │
│   Auth (JWT) · Business Logic · Routes      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│                 Database                    │
│              PostgreSQL                     │
│  employees · payroll · attendance · leave   │
└─────────────────────────────────────────────┘
```

---

## 3. Module Flow

### 3.1 Dashboard

**Purpose:** Give HR managers a real-time snapshot of the entire company.

```
User logs in
    │
    ▼
Dashboard loads
    ├── Total headcount (from employees table)
    ├── Present today (from attendance table — today's date)
    ├── Payroll this month (from payroll table)
    ├── Open positions (from recruitment table)
    ├── Department headcount chart
    ├── Recent activity feed (last 10 events across all modules)
    └── Upcoming events (leave endings, contract renewals, payroll run date)
```

**Key data sources:** `employees`, `attendance`, `payroll`, `recruitment`, `events`

---

### 3.2 Employee Management

**Purpose:** Central record for every person in the company.

```
HR Manager actions:
    ├── Add new employee
    │       └── Fill form → Save → Record created in DB → Onboarding email sent
    ├── Search & filter employees
    │       └── Filter by: department / status / employment type
    ├── View employee profile
    │       └── Personal info · Contract · Leave balance · Payslips · Reviews
    └── Edit / deactivate employee
            └── Status changes: Active → On Leave → Probation → Terminated
```

**Employee statuses:**
- `Active` — working normally
- `On Leave` — currently on approved leave
- `Probation` — within probation period
- `Onboarding` — recently hired, not yet fully active
- `Terminated` — no longer with company

---

### 3.3 Attendance & Leave

**Purpose:** Track who is in, who is off, and manage leave requests.

```
Daily attendance flow:
    Employee check-in (manual or API) → Record saved with timestamp
    End of day → Attendance summary calculated
    Monthly → Absenteeism rate computed per department

Leave request flow:
    Employee submits leave request
        │
        ▼
    Manager reviews → Approve / Reject
        │
        ▼
    If approved → Leave balance deducted
                → Attendance marked as "On Leave" for those dates
                → Notification sent to employee
```

**Leave types tracked:**
- Annual leave
- Sick leave
- Maternity / Paternity leave
- Unpaid leave
- Other (personal, compassionate, etc.)

---

### 3.4 Payroll

**Purpose:** Calculate and process monthly salaries, deductions, and generate payslips.

```
Payroll run flow (runs monthly):
    1. Pull all active employees for the period
    2. Fetch base salary for each employee
    3. Add: overtime hours × hourly rate
    4. Add: bonuses / commissions
    5. Deduct: income tax (by tax bracket)
    6. Deduct: social security contributions
    7. Deduct: health insurance premiums
    8. Deduct: retirement / pension (e.g., 401k / EPF)
    9. Calculate net pay = gross − all deductions
   10. Generate payslip PDF per employee
   11. Mark payroll run as "Completed" in DB
   12. Send payslip to each employee by email
```

**Payroll components:**

| Type | Description |
|---|---|
| Base salary | Fixed monthly amount |
| Overtime | Hours × overtime rate |
| Bonus | Performance or project bonus |
| Tax | Federal + state / local tax |
| Social security | Employer + employee contribution |
| Health insurance | Monthly premium deduction |
| Pension / 401k | % of salary contribution |

---

### 3.5 Recruitment

**Purpose:** Manage job openings and track candidates through the hiring pipeline.

```
Recruitment flow:
    HR creates job posting
        │
        ▼
    Job goes live (internal / external)
        │
        ▼
    Candidate applies → Stored in applicants table
        │
        ▼
    Stages:
        Applied → Screening → Interview → Offer → Hired / Rejected
        │
        ▼
    If Hired:
        └── Create employee record → Start onboarding flow
```

**Candidate stages:**
- `Applied` — submitted application
- `Screening` — HR initial review
- `Interview` — scheduled for interview
- `Offer` — offer letter sent
- `Hired` — accepted, employee record created
- `Rejected` — not selected

---

### 3.6 Performance Reviews

**Purpose:** Evaluate employees on goals, skills, and overall contribution.

```
Review cycle flow (quarterly / annually):
    HR starts review cycle
        │
        ▼
    Managers rate each employee
        ├── Goal completion (%)
        ├── Skill rating (1–5)
        ├── Overall score (1–5)
        └── Written comments
        │
        ▼
    Results stored in DB
        │
        ├── Score ≥ 4.5  → Flag as Top Performer
        ├── Score 2.5–4.4 → Standard review saved
        └── Score < 2.5  → Flag for PIP (Performance Improvement Plan)
```

**Review status values:**
- `Pending` — not yet completed
- `Done` — review submitted
- `PIP` — performance improvement plan initiated

---

### 3.7 Reports Center

**Purpose:** Provide HR managers with data insights across all modules.

```
Reports available:
    ├── Workforce summary
    │       └── Headcount by dept · Gender & age distribution · Hire vs departure trends
    ├── Payroll analysis
    │       └── Gross/net totals · Cost by dept · Monthly trend · Cost breakdown
    ├── Attendance & leave
    │       └── Attendance % by dept · Leave type breakdown · Top absentees
    ├── Turnover & retention
    │       └── Attrition rate · Exit reasons · Retention risk list · Dept turnover
    ├── Compliance & audit
    │       └── Expiring contracts · Policy sign-offs · Mandatory training status
    └── Performance & training
            └── Avg scores by team · Goal completion · Training hours logged
```

All reports support:
- **Period filter** — monthly, quarterly, annual
- **Export to Excel / PDF**
- **Automated scheduled email delivery**

---

## 4. Data Flow Diagram

```
                    ┌──────────────┐
                    │   Employee   │◄──── Add / Edit / Deactivate
                    └──────┬───────┘
                           │
          ┌────────────────┼───────────────────┐
          │                │                   │
          ▼                ▼                   ▼
   ┌─────────────┐  ┌─────────────┐   ┌─────────────┐
   │  Attendance │  │   Payroll   │   │  Recruitment│
   │  & Leave    │  │  & Payslip  │   │  Pipeline   │
   └──────┬──────┘  └──────┬──────┘   └──────┬──────┘
          │                │                  │
          └────────────────▼──────────────────┘
                           │
                    ┌──────▼───────┐
                    │   Reports    │
                    │   Center     │
                    └──────────────┘
```

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js (Vite) | UI framework |
| Styling | Tailwind CSS | Component styling |
| UI Components | shadcn/ui | Pre-built components |
| State management | Zustand | Global app state |
| Data fetching | TanStack Query | API calls + caching |
| Backend | Node.js + Express | REST API server |
| Authentication | JWT (jsonwebtoken) | Secure login tokens |
| Database | PostgreSQL | Relational data storage |
| ORM | Prisma | Database queries |
| File generation | PDFKit | Payslip PDF generation |
| Email | Nodemailer | Send payslips, alerts |
| Hosting (optional) | Railway / Render | Deploy backend |

---

## 6. Project Folder Structure

```
hr-system/
├── client/                        ← React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Payroll.jsx
│   │   │   ├── Recruitment.jsx
│   │   │   ├── Performance.jsx
│   │   │   └── Reports.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── Charts/
│   │   ├── store/                 ← Zustand state
│   │   ├── api/                   ← TanStack Query hooks
│   │   └── App.jsx
│   └── package.json
│
├── server/                        ← Node.js backend
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── attendance.js
│   │   ├── payroll.js
│   │   ├── recruitment.js
│   │   ├── performance.js
│   │   └── reports.js
│   ├── controllers/               ← Business logic
│   ├── middleware/
│   │   ├── auth.js                ← JWT verification
│   │   └── rbac.js                ← Role-based access
│   ├── prisma/
│   │   └── schema.prisma          ← DB schema
│   ├── services/
│   │   ├── payrollCalculator.js
│   │   ├── pdfGenerator.js
│   │   └── emailService.js
│   └── index.js
│
└── README.md
```

---

## 7. Database Schema (Key Tables)

```sql
-- Employees
CREATE TABLE employees (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100),
  email       VARCHAR(100) UNIQUE,
  department  VARCHAR(50),
  role        VARCHAR(100),
  type        VARCHAR(20),   -- full-time, part-time, contractor
  status      VARCHAR(20),   -- active, on_leave, probation, terminated
  start_date  DATE,
  salary      DECIMAL(10,2),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Attendance
CREATE TABLE attendance (
  id          SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  date        DATE,
  status      VARCHAR(20),   -- present, absent, on_leave, remote
  check_in    TIME,
  check_out   TIME
);

-- Leave requests
CREATE TABLE leave_requests (
  id          SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  type        VARCHAR(30),   -- annual, sick, maternity, unpaid
  start_date  DATE,
  end_date    DATE,
  status      VARCHAR(20),   -- pending, approved, rejected
  reason      TEXT
);

-- Payroll
CREATE TABLE payroll (
  id          SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  period      VARCHAR(20),   -- e.g. 2026-04
  gross       DECIMAL(10,2),
  net         DECIMAL(10,2),
  tax         DECIMAL(10,2),
  deductions  JSONB,
  status      VARCHAR(20),   -- draft, completed
  run_date    DATE
);

-- Recruitment
CREATE TABLE job_postings (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(100),
  department  VARCHAR(50),
  status      VARCHAR(20)    -- draft, active, closed
);

CREATE TABLE applicants (
  id          SERIAL PRIMARY KEY,
  job_id      INT REFERENCES job_postings(id),
  name        VARCHAR(100),
  email       VARCHAR(100),
  stage       VARCHAR(20),   -- applied, screening, interview, offer, hired, rejected
  applied_at  TIMESTAMP DEFAULT NOW()
);

-- Performance
CREATE TABLE performance_reviews (
  id          SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  period      VARCHAR(20),
  score       DECIMAL(3,1),
  goals_met   INT,           -- percentage
  status      VARCHAR(20),   -- pending, done, pip
  notes       TEXT
);
```

---

## 8. API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT token |
| POST | `/api/auth/logout` | Invalidate session |

### Employees
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | List all employees (filterable) |
| POST | `/api/employees` | Create new employee |
| GET | `/api/employees/:id` | Get single employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Deactivate employee |

### Attendance & Leave
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/attendance` | Get attendance records |
| POST | `/api/attendance/checkin` | Record check-in |
| GET | `/api/leave` | Get all leave requests |
| POST | `/api/leave` | Submit leave request |
| PUT | `/api/leave/:id/approve` | Approve leave |
| PUT | `/api/leave/:id/reject` | Reject leave |

### Payroll
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/payroll` | Get payroll records |
| POST | `/api/payroll/run` | Run payroll for a period |
| GET | `/api/payroll/:id/payslip` | Download payslip PDF |

### Recruitment
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | List all job postings |
| POST | `/api/jobs` | Create job posting |
| GET | `/api/applicants` | List applicants |
| PUT | `/api/applicants/:id/stage` | Move candidate to next stage |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/workforce` | Workforce summary data |
| GET | `/api/reports/payroll` | Payroll analysis data |
| GET | `/api/reports/attendance` | Attendance report data |
| GET | `/api/reports/turnover` | Turnover & retention data |
| GET | `/api/reports/compliance` | Compliance & audit data |

---

## 9. Setup Guide — Step by Step

### Step 1 — Prerequisites

Make sure you have these installed on your computer:

```bash
node --version      # Need v18 or higher
npm --version       # Need v9 or higher
psql --version      # Need PostgreSQL 14+
```

Download links:
- Node.js: https://nodejs.org
- PostgreSQL: https://www.postgresql.org/download

---

### Step 2 — Clone or create the project

```bash
mkdir hr-system
cd hr-system
```

---

### Step 3 — Set up the backend (Node.js)

```bash
cd server
npm init -y
npm install express prisma @prisma/client jsonwebtoken bcryptjs cors dotenv nodemailer pdfkit
npm install --save-dev nodemon
```

---

### Step 4 — Set up the database

```bash
# Create a new PostgreSQL database
psql -U postgres
CREATE DATABASE hrdb;
\q

# Run Prisma migration
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

---

### Step 5 — Set up the frontend (React)

```bash
cd ../client
npm create vite@latest . -- --template react
npm install
npm install axios @tanstack/react-query zustand react-router-dom tailwindcss
npx tailwindcss init
```

---

### Step 6 — Start the development servers

Terminal 1 — Backend:
```bash
cd server
npm run dev        # Starts on http://localhost:5000
```

Terminal 2 — Frontend:
```bash
cd client
npm run dev        # Starts on http://localhost:5173
```

Open your browser at: **http://localhost:5173**

---

### Step 7 — Create the first admin account

```bash
# In server directory, run seed script
node prisma/seed.js

# Default login:
# Email:    admin@company.com
# Password: Admin@1234  (change after first login!)
```

---

## 10. Environment Variables

Create a `.env` file in the `/server` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/hrdb"

# JWT
JWT_SECRET="your-very-long-secret-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Email (for payslips and alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `/client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 11. User Roles & Permissions

| Permission | Super Admin | HR Manager | Manager | Employee |
|---|---|---|---|---|
| View all employees | ✅ | ✅ | ✅ (own team) | ❌ |
| Add / edit employees | ✅ | ✅ | ❌ | ❌ |
| View payroll | ✅ | ✅ | ❌ | Own only |
| Run payroll | ✅ | ✅ | ❌ | ❌ |
| Approve leave | ✅ | ✅ | ✅ (own team) | ❌ |
| Submit leave request | ✅ | ✅ | ✅ | ✅ |
| View reports | ✅ | ✅ | Partial | ❌ |
| Post jobs | ✅ | ✅ | ❌ | ❌ |
| Submit performance review | ✅ | ✅ | ✅ | ❌ |
| Manage system settings | ✅ | ❌ | ❌ | ❌ |

---

## 12. Report Types

| Report | Key Metrics | Export |
|---|---|---|
| Workforce summary | Headcount, gender, age, dept breakdown, hire/departure trend | Excel, PDF |
| Payroll analysis | Gross/net, cost by dept, monthly trend, cost breakdown | Excel, PDF |
| Attendance & leave | Attendance %, leave types, absentees, dept comparison | Excel, PDF |
| Turnover & retention | Attrition rate, exit reasons, retention risk employees | Excel, PDF |
| Compliance & audit | Expiring contracts, policy sign-offs, training completion | Excel, PDF |
| Performance & training | Review scores, goal completion %, training hours | Excel, PDF |

All reports can be:
- Filtered by period (monthly / quarterly / yearly)
- Exported to Excel or PDF
- Scheduled for automatic email delivery

---

## Quick Reference — Common Commands

```bash
# Start backend dev server
cd server && npm run dev

# Start frontend dev server
cd client && npm run dev

# Run database migration
cd server && npx prisma migrate dev

# Open Prisma database viewer
cd server && npx prisma studio

# Build frontend for production
cd client && npm run build

# Run backend in production
cd server && node index.js
```

---

*Document version: 1.0 — April 2026*
*System: PeopleCore HR Management System*
*Stack: React + Node.js + PostgreSQL*
