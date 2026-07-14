# HR Management System — Full Technical Design
**Stack:** Spring Boot 3.x (Java 21) + Angular 18 + PostgreSQL + Redis + Caffeine + Kafka (optional, for events)

---

## 1. High-Level Architecture

```
                        ┌──────────────────────┐
                        │   Angular 18 SPA      │
                        │  (Nginx served)       │
                        └──────────┬────────────┘
                                   │ HTTPS / JWT
                        ┌──────────▼────────────┐
                        │  Spring Boot API       │
                        │  (Spring Security,     │
                        │   OAuth2 Resource Srv) │
                        └───┬─────────┬─────────┘
                            │         │
                ┌───────────▼───┐ ┌───▼────────────┐
                │ Caffeine (L1)  │ │ Redis (L2)      │
                │ in-JVM cache   │ │ distributed     │
                └────────────────┘ └────────┬────────┘
                                             │
                                   ┌─────────▼─────────┐
                                   │   PostgreSQL       │
                                   │  (Flyway managed)  │
                                   └────────────────────┘
```

Core modules: **Auth/IAM**, **Employee**, **Department/OrgChart**, **Leave**, **Attendance**, **Payroll**, **Recruitment**, **Performance Review**, **Document/Files**, **Notifications**.

---

## 2. Module-by-Module API List

### 2.1 Auth / IAM
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/login` | Login, returns JWT access + refresh token |
| POST | `/api/v1/auth/refresh` | Rotate refresh token |
| POST | `/api/v1/auth/logout` | Revoke refresh token |
| GET  | `/api/v1/auth/me` | Current user profile + roles |
| POST | `/api/v1/auth/change-password` | Change password |
| GET  | `/oauth2/authorization/{provider}` | Start OAuth2 login (Google/Azure AD) |
| GET  | `/login/oauth2/code/{provider}` | OAuth2 callback |

### 2.2 Employee Management
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/employees` | List (paginated, filterable by dept/status) |
| GET | `/api/v1/employees/{id}` | Get by id |
| POST | `/api/v1/employees` | Create employee |
| PUT | `/api/v1/employees/{id}` | Update |
| DELETE | `/api/v1/employees/{id}` | Soft delete / deactivate |
| GET | `/api/v1/employees/{id}/documents` | List documents |
| POST | `/api/v1/employees/{id}/documents` | Upload document |
| GET | `/api/v1/employees/{id}/history` | Employment history (promotions, transfers) |
| GET | `/api/v1/employees/search?q=` | Full text search |

### 2.3 Department / Org Structure
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/departments` | List all |
| POST | `/api/v1/departments` | Create |
| PUT | `/api/v1/departments/{id}` | Update |
| DELETE | `/api/v1/departments/{id}` | Delete |
| GET | `/api/v1/departments/{id}/org-chart` | Hierarchical tree |
| GET | `/api/v1/positions` | List job positions/titles |
| POST | `/api/v1/positions` | Create position |

### 2.4 Leave Management
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/leave-types` | List configured leave types |
| POST | `/api/v1/leave-types` | Create leave type (admin) |
| GET | `/api/v1/leave-balances/me` | Current user's balances |
| GET | `/api/v1/leave-balances/{employeeId}` | Balance for an employee (manager/HR) |
| GET | `/api/v1/leave-requests` | List (filterable: mine / team / pending-approval) |
| GET | `/api/v1/leave-requests/{id}` | Get one |
| POST | `/api/v1/leave-requests` | Submit new request |
| PUT | `/api/v1/leave-requests/{id}` | Edit (only if PENDING) |
| DELETE | `/api/v1/leave-requests/{id}` | Cancel (only if PENDING) |
| POST | `/api/v1/leave-requests/{id}/approve` | Manager/HR approve |
| POST | `/api/v1/leave-requests/{id}/reject` | Manager/HR reject with reason |
| GET | `/api/v1/leave-requests/calendar` | Team calendar view |
| GET | `/api/v1/leave-requests/{id}/history` | Approval audit trail |

### 2.5 Attendance
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/attendance/check-in` | Clock in |
| POST | `/api/v1/attendance/check-out` | Clock out |
| GET | `/api/v1/attendance/me` | My attendance log |
| GET | `/api/v1/attendance/{employeeId}` | Attendance for an employee |
| GET | `/api/v1/attendance/summary?month=&year=` | Monthly summary/report |
| PUT | `/api/v1/attendance/{id}/correction` | Manual correction request |

### 2.6 Payroll
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/payroll/runs` | List payroll runs |
| POST | `/api/v1/payroll/runs` | Create/trigger a payroll run |
| GET | `/api/v1/payroll/runs/{id}` | Run detail |
| POST | `/api/v1/payroll/runs/{id}/approve` | Approve run |
| GET | `/api/v1/payroll/payslips/me` | My payslips |
| GET | `/api/v1/payroll/payslips/{employeeId}` | Employee payslips (HR) |
| GET | `/api/v1/payroll/payslips/{id}/pdf` | Download PDF payslip |

### 2.7 Recruitment
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/v1/job-postings` | List / create postings |
| GET/POST | `/api/v1/candidates` | List / create candidates |
| POST | `/api/v1/candidates/{id}/interview` | Schedule interview |
| PUT | `/api/v1/candidates/{id}/stage` | Move pipeline stage |
| POST | `/api/v1/candidates/{id}/hire` | Convert to employee |

### 2.8 Performance Review
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/v1/review-cycles` | List / create review cycles |
| GET | `/api/v1/reviews/me` | My reviews |
| POST | `/api/v1/reviews/{id}/self-assessment` | Submit self-review |
| POST | `/api/v1/reviews/{id}/manager-review` | Submit manager review |
| GET | `/api/v1/reviews/{id}` | Full review detail |

### 2.9 Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/notifications` | My notifications |
| PUT | `/api/v1/notifications/{id}/read` | Mark read |
| PUT | `/api/v1/notifications/read-all` | Mark all read |


---

## 3. Detailed Database Schema

```sql
-- ============ CORE / IAM ============
CREATE TABLE roles (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL UNIQUE,   -- ROLE_ADMIN, ROLE_HR, ROLE_MANAGER, ROLE_EMPLOYEE
    description     VARCHAR(255)
);

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255),                   -- nullable for OAuth2-only accounts
    oauth_provider  VARCHAR(30),                     -- GOOGLE, AZURE_AD, LOCAL
    oauth_subject   VARCHAR(255),
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    employee_id     BIGINT REFERENCES employees(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
    user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id  BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE refresh_tokens (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ ORG STRUCTURE ============
CREATE TABLE departments (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(30) UNIQUE,
    parent_id       BIGINT REFERENCES departments(id),
    manager_id      BIGINT,                          -- FK to employees, added after employees table
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE positions (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    department_id   BIGINT REFERENCES departments(id),
    grade_level     VARCHAR(20)
);

-- ============ EMPLOYEE ============
CREATE TABLE employees (
    id                  BIGSERIAL PRIMARY KEY,
    employee_code       VARCHAR(30) NOT NULL UNIQUE,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    first_name_kh       VARCHAR(100),                -- Khmer name support
    last_name_kh        VARCHAR(100),
    email               VARCHAR(150) NOT NULL UNIQUE,
    phone               VARCHAR(30),
    date_of_birth       DATE,
    gender              VARCHAR(10),
    national_id         VARCHAR(50),
    hire_date           DATE NOT NULL,
    termination_date    DATE,
    department_id       BIGINT REFERENCES departments(id),
    position_id         BIGINT REFERENCES positions(id),
    manager_id          BIGINT REFERENCES employees(id),
    employment_status    VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ON_LEAVE, TERMINATED
    employment_type      VARCHAR(20) NOT NULL DEFAULT 'FULL_TIME', -- FULL_TIME, PART_TIME, CONTRACT
    base_salary          NUMERIC(14,2),
    bank_account_number   VARCHAR(50),
    bank_name             VARCHAR(100),
    address               TEXT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE departments ADD CONSTRAINT fk_dept_manager
    FOREIGN KEY (manager_id) REFERENCES employees(id);

CREATE TABLE employee_documents (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    doc_type        VARCHAR(50) NOT NULL,           -- CONTRACT, ID_CARD, DEGREE, CV
    file_name       VARCHAR(255) NOT NULL,
    file_path       VARCHAR(500) NOT NULL,
    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE employee_history (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    event_type      VARCHAR(30) NOT NULL,           -- PROMOTION, TRANSFER, SALARY_CHANGE, TERMINATION
    old_value       VARCHAR(255),
    new_value       VARCHAR(255),
    effective_date  DATE NOT NULL,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ LEAVE MODULE ============
CREATE TABLE leave_types (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(80) NOT NULL UNIQUE,   -- Annual, Sick, Maternity, Unpaid
    default_days_per_year NUMERIC(5,2) NOT NULL DEFAULT 0,
    requires_approval    BOOLEAN NOT NULL DEFAULT TRUE,
    is_paid              BOOLEAN NOT NULL DEFAULT TRUE,
    carry_forward_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    max_carry_forward_days NUMERIC(5,2) DEFAULT 0
);

CREATE TABLE leave_balances (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id   BIGINT NOT NULL REFERENCES leave_types(id),
    year            INT NOT NULL,
    allocated_days  NUMERIC(5,2) NOT NULL DEFAULT 0,
    used_days       NUMERIC(5,2) NOT NULL DEFAULT 0,
    carried_over_days NUMERIC(5,2) NOT NULL DEFAULT 0,
    UNIQUE (employee_id, leave_type_id, year)
);

CREATE TABLE leave_requests (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id   BIGINT NOT NULL REFERENCES leave_types(id),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    total_days      NUMERIC(5,2) NOT NULL,
    reason          TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CANCELLED
    approver_id     BIGINT REFERENCES employees(id),
    approved_at     TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE leave_request_history (
    id              BIGSERIAL PRIMARY KEY,
    leave_request_id BIGINT NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    action          VARCHAR(20) NOT NULL,           -- SUBMITTED, APPROVED, REJECTED, CANCELLED, EDITED
    actor_id        BIGINT REFERENCES employees(id),
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ ATTENDANCE ============
CREATE TABLE attendance_records (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    work_date       DATE NOT NULL,
    check_in_time   TIMESTAMPTZ,
    check_out_time  TIMESTAMPTZ,
    status          VARCHAR(20) NOT NULL DEFAULT 'PRESENT', -- PRESENT, LATE, ABSENT, HALF_DAY
    is_corrected    BOOLEAN NOT NULL DEFAULT FALSE,
    correction_note TEXT,
    UNIQUE (employee_id, work_date)
);

-- ============ PAYROLL ============
CREATE TABLE payroll_runs (
    id              BIGSERIAL PRIMARY KEY,
    period_month    INT NOT NULL,
    period_year     INT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, APPROVED, PAID
    run_by          BIGINT REFERENCES users(id),
    approved_by     BIGINT REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (period_month, period_year)
);

CREATE TABLE payslips (
    id              BIGSERIAL PRIMARY KEY,
    payroll_run_id  BIGINT NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id     BIGINT NOT NULL REFERENCES employees(id),
    base_salary     NUMERIC(14,2) NOT NULL,
    allowances      NUMERIC(14,2) NOT NULL DEFAULT 0,
    deductions      NUMERIC(14,2) NOT NULL DEFAULT 0,
    net_pay         NUMERIC(14,2) NOT NULL,
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ RECRUITMENT ============
CREATE TABLE job_postings (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    department_id   BIGINT REFERENCES departments(id),
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, CLOSED
    posted_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE candidates (
    id              BIGSERIAL PRIMARY KEY,
    job_posting_id  BIGINT NOT NULL REFERENCES job_postings(id),
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150),
    phone           VARCHAR(30),
    resume_path     VARCHAR(500),
    stage           VARCHAR(30) NOT NULL DEFAULT 'APPLIED', -- APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ PERFORMANCE ============
CREATE TABLE review_cycles (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,          -- "2026 Mid-Year Review"
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE performance_reviews (
    id              BIGSERIAL PRIMARY KEY,
    review_cycle_id BIGINT NOT NULL REFERENCES review_cycles(id),
    employee_id     BIGINT NOT NULL REFERENCES employees(id),
    reviewer_id     BIGINT REFERENCES employees(id),
    self_score      NUMERIC(4,2),
    self_comments   TEXT,
    manager_score   NUMERIC(4,2),
    manager_comments TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    UNIQUE (review_cycle_id, employee_id)
);

-- ============ NOTIFICATIONS ============
CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    body            TEXT,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ INDEXES ============
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, work_date);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
```


---

## 4. Folder Structure

### 4.1 Spring Boot Backend

```
hr-system-backend/
├── pom.xml
├── docker-compose.yml
├── Dockerfile
├── src/main/java/com/ngo/hrsystem/
│   ├── HrSystemApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── OAuth2ResourceServerConfig.java
│   │   ├── RedisConfig.java
│   │   ├── CacheConfig.java              (multi-level Caffeine+Redis)
│   │   ├── OpenApiConfig.java
│   │   └── WebConfig.java                (CORS etc)
│   ├── common/
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   └── BusinessRuleException.java
│   │   ├── dto/ApiResponse.java
│   │   └── util/DateUtils.java
│   ├── security/
│   │   ├── JwtService.java
│   │   ├── JwtAuthFilter.java
│   │   ├── CustomUserDetailsService.java
│   │   └── OAuth2SuccessHandler.java
│   ├── auth/
│   │   ├── AuthController.java
│   │   ├── AuthService.java
│   │   └── dto/ (LoginRequest, TokenResponse...)
│   ├── employee/
│   │   ├── Employee.java
│   │   ├── EmployeeRepository.java
│   │   ├── EmployeeService.java
│   │   ├── EmployeeController.java
│   │   └── dto/ (EmployeeRequest, EmployeeResponse)
│   ├── department/
│   │   ├── Department.java / Position.java
│   │   ├── DepartmentRepository.java
│   │   ├── DepartmentService.java
│   │   └── DepartmentController.java
│   ├── leave/
│   │   ├── entity/ (LeaveType, LeaveBalance, LeaveRequest, LeaveRequestHistory)
│   │   ├── repository/
│   │   ├── service/ (LeaveService, LeaveBalanceService)
│   │   ├── controller/ (LeaveController, LeaveTypeController)
│   │   ├── dto/ (LeaveRequestDto, LeaveBalanceDto, ApproveLeaveDto)
│   │   └── mapper/LeaveMapper.java
│   ├── attendance/
│   ├── payroll/
│   ├── recruitment/
│   ├── performance/
│   ├── notification/
│   └── cache/
│       ├── CacheWarmingComponent.java
│       └── CacheNames.java
└── src/main/resources/
    ├── application.yml
    ├── application-dev.yml
    ├── application-prod.yml
    └── db/migration/          (Flyway scripts, V1__*.sql ...)
```

### 4.2 Angular Frontend

```
hr-system-frontend/
├── angular.json
├── package.json
├── Dockerfile
├── nginx.conf
├── src/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── app/
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── core/
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       └── token-storage.service.ts
│   │   ├── shared/
│   │   │   ├── components/ (loading-spinner, confirm-dialog, page-header)
│   │   │   ├── pipes/
│   │   │   └── models/ (Employee, PagedResponse, ApiResponse)
│   │   ├── layout/
│   │   │   ├── main-layout/
│   │   │   ├── sidebar/
│   │   │   └── topbar/
│   │   └── features/
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   └── login.component.ts
│   │       ├── employees/
│   │       │   ├── employee-list/
│   │       │   ├── employee-detail/
│   │       │   ├── employee-form/
│   │       │   └── employee.service.ts
│   │       ├── departments/
│   │       ├── leave/
│   │       │   ├── leave-request-list/
│   │       │   ├── leave-request-form/
│   │       │   ├── leave-approval/
│   │       │   ├── leave-balance-widget/
│   │       │   ├── leave-calendar/
│   │       │   └── leave.service.ts
│   │       ├── attendance/
│   │       ├── payroll/
│   │       ├── recruitment/
│   │       └── performance/
│   └── styles.scss
```


---

## 5. Flyway Migrations

`src/main/resources/db/migration/V1__init_core_and_org.sql`
```sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) UNIQUE,
    parent_id BIGINT REFERENCES departments(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE positions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    department_id BIGINT REFERENCES departments(id),
    grade_level VARCHAR(20)
);

INSERT INTO roles (name, description) VALUES
 ('ROLE_ADMIN', 'System administrator'),
 ('ROLE_HR', 'HR staff'),
 ('ROLE_MANAGER', 'Department / team manager'),
 ('ROLE_EMPLOYEE', 'Standard employee');
```

`V2__employees_and_users.sql`
```sql
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    employee_code VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_kh VARCHAR(100),
    last_name_kh VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    date_of_birth DATE,
    gender VARCHAR(10),
    national_id VARCHAR(50),
    hire_date DATE NOT NULL,
    termination_date DATE,
    department_id BIGINT REFERENCES departments(id),
    position_id BIGINT REFERENCES positions(id),
    manager_id BIGINT REFERENCES employees(id),
    employment_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    employment_type VARCHAR(20) NOT NULL DEFAULT 'FULL_TIME',
    base_salary NUMERIC(14,2),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE departments ADD CONSTRAINT fk_dept_manager
    FOREIGN KEY (manager_id) REFERENCES employees(id);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    oauth_provider VARCHAR(30),
    oauth_subject VARCHAR(255),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    employee_id BIGINT REFERENCES employees(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
```

`V3__leave_module.sql`
```sql
CREATE TABLE leave_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    default_days_per_year NUMERIC(5,2) NOT NULL DEFAULT 0,
    requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    carry_forward_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    max_carry_forward_days NUMERIC(5,2) DEFAULT 0
);

CREATE TABLE leave_balances (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id BIGINT NOT NULL REFERENCES leave_types(id),
    year INT NOT NULL,
    allocated_days NUMERIC(5,2) NOT NULL DEFAULT 0,
    used_days NUMERIC(5,2) NOT NULL DEFAULT 0,
    carried_over_days NUMERIC(5,2) NOT NULL DEFAULT 0,
    UNIQUE (employee_id, leave_type_id, year)
);

CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id BIGINT NOT NULL REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(5,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    approver_id BIGINT REFERENCES employees(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE leave_request_history (
    id BIGSERIAL PRIMARY KEY,
    leave_request_id BIGINT NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL,
    actor_id BIGINT REFERENCES employees(id),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);

INSERT INTO leave_types (name, default_days_per_year, requires_approval, is_paid, carry_forward_allowed, max_carry_forward_days) VALUES
 ('Annual Leave', 18, true, true, true, 5),
 ('Sick Leave', 7, false, true, false, 0),
 ('Maternity Leave', 90, true, true, false, 0),
 ('Unpaid Leave', 0, true, false, false, 0);
```

`V4__attendance_payroll.sql`
```sql
CREATE TABLE attendance_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    is_corrected BOOLEAN NOT NULL DEFAULT FALSE,
    correction_note TEXT,
    UNIQUE (employee_id, work_date)
);

CREATE TABLE payroll_runs (
    id BIGSERIAL PRIMARY KEY,
    period_month INT NOT NULL,
    period_year INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    run_by BIGINT REFERENCES users(id),
    approved_by BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (period_month, period_year)
);

CREATE TABLE payslips (
    id BIGSERIAL PRIMARY KEY,
    payroll_run_id BIGINT NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    base_salary NUMERIC(14,2) NOT NULL,
    allowances NUMERIC(14,2) NOT NULL DEFAULT 0,
    deductions NUMERIC(14,2) NOT NULL DEFAULT 0,
    net_pay NUMERIC(14,2) NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, work_date);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
```

> Naming convention: `V{n}__description.sql`. Flyway config in `application.yml`:
```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
```


---

## 6. Sample Entity + Service + Controller (Employee module)

`Employee.java`
```java
package com.ngo.hrsystem.employee;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "employees")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", nullable = false, unique = true)
    private String employeeCode;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "first_name_kh")
    private String firstNameKh;

    @Column(name = "last_name_kh")
    private String lastNameKh;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status", nullable = false)
    private EmploymentStatus employmentStatus;

    @Column(name = "base_salary")
    private BigDecimal baseSalary;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (employmentStatus == null) employmentStatus = EmploymentStatus.ACTIVE;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public enum EmploymentStatus { ACTIVE, ON_LEAVE, TERMINATED }
}
```

`EmployeeRepository.java`
```java
package com.ngo.hrsystem.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Page<Employee> findByDepartmentIdAndEmploymentStatus(
            Long departmentId, Employee.EmploymentStatus status, Pageable pageable);

    @Query("""
        SELECT e FROM Employee e
        WHERE lower(e.firstName) LIKE lower(concat('%', :q, '%'))
           OR lower(e.lastName)  LIKE lower(concat('%', :q, '%'))
           OR lower(e.email)     LIKE lower(concat('%', :q, '%'))
        """)
    Page<Employee> search(String q, Pageable pageable);
}
```

`EmployeeService.java`
```java
package com.ngo.hrsystem.employee;

import com.ngo.hrsystem.common.exception.ResourceNotFoundException;
import com.ngo.hrsystem.employee.dto.EmployeeRequest;
import com.ngo.hrsystem.employee.dto.EmployeeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper mapper;

    @Cacheable(value = "employee", key = "#id")
    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        return mapper.toResponse(employee);
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> list(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(mapper::toResponse);
    }

    @CacheEvict(value = "employee", key = "#result.id")
    public EmployeeResponse create(EmployeeRequest request) {
        Employee employee = mapper.toEntity(request);
        employee.setDepartment(departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found")));
        Employee saved = employeeRepository.save(employee);
        return mapper.toResponse(saved);
    }

    @CacheEvict(value = "employee", key = "#id")
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        mapper.updateEntity(employee, request);
        return mapper.toResponse(employeeRepository.save(employee));
    }

    @CacheEvict(value = "employee", key = "#id")
    public void deactivate(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        employee.setEmploymentStatus(Employee.EmploymentStatus.TERMINATED);
        employeeRepository.save(employee);
    }
}
```

`EmployeeController.java`
```java
package com.ngo.hrsystem.employee;

import com.ngo.hrsystem.common.dto.ApiResponse;
import com.ngo.hrsystem.employee.dto.EmployeeRequest;
import com.ngo.hrsystem.employee.dto.EmployeeResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    public ApiResponse<Page<EmployeeResponse>> list(Pageable pageable) {
        return ApiResponse.ok(employeeService.list(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER') or #id == authentication.principal.employeeId")
    public ApiResponse<EmployeeResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(employeeService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return ApiResponse.ok(employeeService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ApiResponse<EmployeeResponse> update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return ApiResponse.ok(employeeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deactivate(@PathVariable Long id) {
        employeeService.deactivate(id);
        return ApiResponse.ok(null);
    }
}
```


---

## 7. Leave Module — Angular Service + Component Skeleton

`features/leave/leave.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeaveRequest {
  id?: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface LeaveBalance {
  leaveTypeId: number;
  leaveTypeName: string;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
}

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private baseUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  getMyBalances(): Observable<LeaveBalance[]> {
    return this.http.get<LeaveBalance[]>(`${this.baseUrl}/leave-balances/me`);
  }

  getRequests(filter: 'mine' | 'team' | 'pending-approval'): Observable<LeaveRequest[]> {
    const params = new HttpParams().set('filter', filter);
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/leave-requests`, { params });
  }

  getRequest(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.baseUrl}/leave-requests/${id}`);
  }

  submit(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/leave-requests`, request);
  }

  update(id: number, request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.baseUrl}/leave-requests/${id}`, request);
  }

  cancel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/leave-requests/${id}`);
  }

  approve(id: number): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/leave-requests/${id}/approve`, {});
  }

  reject(id: number, reason: string): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/leave-requests/${id}/reject`, { reason });
  }

  getTeamCalendar(month: number, year: number): Observable<any[]> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<any[]>(`${this.baseUrl}/leave-requests/calendar`, { params });
  }
}
```

`features/leave/leave-request-list/leave-request-list.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeaveService, LeaveRequest } from '../leave.service';

@Component({
  selector: 'app-leave-request-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leave-request-list.component.html',
})
export class LeaveRequestListComponent implements OnInit {
  requests: LeaveRequest[] = [];
  loading = false;

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.leaveService.getRequests('mine').subscribe({
      next: (data) => { this.requests = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  cancel(id: number): void {
    this.leaveService.cancel(id).subscribe(() => this.load());
  }
}
```

`features/leave/leave-request-form/leave-request-form.component.ts`
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-request-form.component.html',
})
export class LeaveRequestFormComponent {
  form = this.fb.group({
    leaveTypeId: [null, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: [''],
  });
  submitting = false;

  constructor(private fb: FormBuilder, private leaveService: LeaveService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const value = this.form.value as any;
    const totalDays = this.calculateDays(value.startDate, value.endDate);
    this.leaveService.submit({ ...value, totalDays }).subscribe({
      next: () => this.router.navigate(['/leave']),
      error: () => { this.submitting = false; },
    });
  }

  private calculateDays(start: string, end: string): number {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return Math.floor(ms / 86400000) + 1;
  }
}
```

`features/leave/leave-approval/leave-approval.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService, LeaveRequest } from '../leave.service';

@Component({
  selector: 'app-leave-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-approval.component.html',
})
export class LeaveApprovalComponent implements OnInit {
  pending: LeaveRequest[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveService.getRequests('pending-approval').subscribe((r) => (this.pending = r));
  }

  approve(id: number): void {
    this.leaveService.approve(id).subscribe(() => this.reload());
  }

  reject(id: number, reason: string): void {
    this.leaveService.reject(id, reason).subscribe(() => this.reload());
  }

  private reload(): void {
    this.leaveService.getRequests('pending-approval').subscribe((r) => (this.pending = r));
  }
}
```

`features/leave/leave-balance-widget/leave-balance-widget.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService, LeaveBalance } from '../leave.service';

@Component({
  selector: 'app-leave-balance-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-balance-widget.component.html',
})
export class LeaveBalanceWidgetComponent implements OnInit {
  balances: LeaveBalance[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveService.getMyBalances().subscribe((b) => (this.balances = b));
  }
}
```


---

## 8. Spring Security OAuth2 — Exploration & Setup

Two common OAuth2 roles in Spring Security matter here:
1. **OAuth2 Client** — the app delegates login to Google/Azure AD ("Login with Google").
2. **OAuth2 Resource Server** — the app validates incoming JWT access tokens (issued either by itself or by an external Identity Provider like Keycloak/Azure AD) on every API call.

For an internal HR system, a pragmatic combo is: **self-issued JWTs** (via `JwtService`) for the primary username/password login, plus **optional OAuth2 login** for staff who prefer SSO with Google Workspace (common for NGOs).

`pom.xml` additions:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
```

`application.yml` (OAuth2 client — Google):
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: [openid, profile, email]
        provider:
          google:
            authorization-uri: https://accounts.google.com/o/oauth2/v2/auth
            token-uri: https://oauth2.googleapis.com/token
```

`SecurityConfig.java` — combining stateless JWT auth (for the API) with an OAuth2-login flow (for SSO), and a **custom resource-server JWT decoder** for self-issued tokens:
```java
package com.ngo.hrsystem.config;

import com.ngo.hrsystem.security.JwtAuthFilter;
import com.ngo.hrsystem.security.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/oauth2/**", "/login/**", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .anyRequest().authenticated())
            .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2SuccessHandler))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

`JwtService.java` (issue + validate self-signed JWTs):
```java
package com.ngo.hrsystem.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expiration-ms}")
    private long accessExpirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateAccessToken(String username, List<String> roles, Long employeeId) {
        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .claim("employeeId", employeeId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessExpirationMs))
                .signWith(key())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, claims -> claims.getSubject());
    }

    public boolean isValid(String token, String username) {
        return extractUsername(token).equals(username) && !isExpired(token);
    }

    private boolean isExpired(String token) {
        return extractClaim(token, claims -> claims.getExpiration()).before(new Date());
    }

    private <T> T extractClaim(String token, Function<io.jsonwebtoken.Claims, T> resolver) {
        var claims = Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload();
        return resolver.apply(claims);
    }
}
```

**Role-based authorization** is enforced via `@PreAuthorize` (see `EmployeeController` above) plus method-level checks like `#id == authentication.principal.employeeId` for "only view your own record" rules — critical for a Leave/Attendance module where employees must not read each other's data.

For production with multiple client apps (web + future mobile), consider swapping the self-issued JWT approach for a dedicated IdP (Keycloak is a good free option, integrates cleanly as an OAuth2 Resource Server via `issuer-uri`).

---

## 9. Redis Caching Strategy — Investigation

Three caching needs for this HR system, each with a different best-fit strategy:

| Data | Access pattern | Recommended strategy |
|---|---|---|
| Employee profile lookups | High read, low write, read-mostly reference data | Cache-aside, TTL ~30 min, L1 (Caffeine) + L2 (Redis) |
| Leave balances | Read-heavy, but must invalidate immediately on approval | Cache-aside with explicit `@CacheEvict` on write, short TTL (5 min) as safety net |
| Department org chart / leave types | Rarely changes, used everywhere (dropdowns) | Cache-aside, long TTL (hours), warm on startup |
| Dashboards / aggregate reports | Expensive to compute, tolerant of slight staleness | Cache with TTL + scheduled refresh (cache warming) |
| Refresh tokens / rate limiting | Must be exact, low latency | Redis directly (not `@Cacheable`), since Spring Cache abstraction isn't a fit for token stores |

**Key decisions:**
- **Cache-aside (lazy loading)** is the default pattern: check cache → miss → load from DB → populate cache. Matches Spring's `@Cacheable` semantics well.
- **Write-through** isn't used broadly here; instead writes go through `@CacheEvict`/`@CachePut` to keep it simple and avoid dual-write bugs.
- **Multi-level cache (Caffeine L1 + Redis L2)** is worth the complexity for employee/department lookups since they're read on nearly every request (auth, org chart, leave approval flows) — Caffeine avoids a network hop for the hottest keys, Redis keeps cache consistent across multiple app instances.
- **Cache warming** is used for leave types and department tree (small, stable datasets, expensive-ish joins) so the first request after deployment isn't slow.
- **Serialization**: use `GenericJackson2JsonRedisSerializer` for Redis values (not JDK serialization) — readable in `redis-cli`, cross-language safe, avoids `Serializable` coupling on entities.
- **Namespacing / key prefixes**: `hr:employee:{id}`, `hr:leave-balance:{employeeId}:{year}` — makes bulk eviction and monitoring easier.


---

## 10. Actual Leave Module — Full Backend Code

`leave/entity/LeaveType.java`
```java
package com.ngo.hrsystem.leave.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "leave_types")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "default_days_per_year", nullable = false)
    private BigDecimal defaultDaysPerYear;

    @Column(name = "requires_approval", nullable = false)
    private boolean requiresApproval;

    @Column(name = "is_paid", nullable = false)
    private boolean paid;

    @Column(name = "carry_forward_allowed", nullable = false)
    private boolean carryForwardAllowed;

    @Column(name = "max_carry_forward_days")
    private BigDecimal maxCarryForwardDays;
}
```

`leave/entity/LeaveBalance.java`
```java
package com.ngo.hrsystem.leave.entity;

import com.ngo.hrsystem.employee.Employee;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "leave_balances", uniqueConstraints =
    @UniqueConstraint(columnNames = {"employee_id", "leave_type_id", "year"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveBalance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "leave_type_id")
    private LeaveType leaveType;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "allocated_days", nullable = false)
    private BigDecimal allocatedDays;

    @Column(name = "used_days", nullable = false)
    private BigDecimal usedDays;

    @Column(name = "carried_over_days", nullable = false)
    private BigDecimal carriedOverDays;

    public BigDecimal remainingDays() {
        return allocatedDays.add(carriedOverDays).subtract(usedDays);
    }
}
```

`leave/entity/LeaveRequest.java`
```java
package com.ngo.hrsystem.leave.entity;

import com.ngo.hrsystem.employee.Employee;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "leave_type_id")
    private LeaveType leaveType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "total_days", nullable = false)
    private BigDecimal totalDays;

    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "approver_id")
    private Employee approver;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (status == null) status = Status.PENDING;
    }

    @PreUpdate
    void onUpdate() { updatedAt = Instant.now(); }

    public enum Status { PENDING, APPROVED, REJECTED, CANCELLED }
}
```

`leave/repository/LeaveRequestRepository.java`
```java
package com.ngo.hrsystem.leave.repository;

import com.ngo.hrsystem.leave.entity.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    Page<LeaveRequest> findByEmployeeId(Long employeeId, Pageable pageable);
    Page<LeaveRequest> findByEmployeeManagerIdAndStatus(Long managerId, LeaveRequest.Status status, Pageable pageable);
    boolean existsByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long employeeId, LeaveRequest.Status status, java.time.LocalDate end, java.time.LocalDate start);
}
```

`leave/repository/LeaveBalanceRepository.java`
```java
package com.ngo.hrsystem.leave.repository;

import com.ngo.hrsystem.leave.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    List<LeaveBalance> findByEmployeeIdAndYear(Long employeeId, int year);
    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeIdAndYear(Long employeeId, Long leaveTypeId, int year);
}
```

`leave/dto/LeaveRequestDto.java`
```java
package com.ngo.hrsystem.leave.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record LeaveRequestDto(
        @NotNull Long leaveTypeId,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        String reason
) {}
```

`leave/dto/LeaveBalanceDto.java`
```java
package com.ngo.hrsystem.leave.dto;

import java.math.BigDecimal;

public record LeaveBalanceDto(
        Long leaveTypeId,
        String leaveTypeName,
        BigDecimal allocatedDays,
        BigDecimal usedDays,
        BigDecimal remainingDays
) {}
```

`leave/service/LeaveBalanceService.java`
```java
package com.ngo.hrsystem.leave.service;

import com.ngo.hrsystem.common.exception.ResourceNotFoundException;
import com.ngo.hrsystem.leave.dto.LeaveBalanceDto;
import com.ngo.hrsystem.leave.entity.LeaveBalance;
import com.ngo.hrsystem.leave.repository.LeaveBalanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;

    @Cacheable(value = "leaveBalance", key = "#employeeId + ':' + #year")
    @Transactional(readOnly = true)
    public List<LeaveBalanceDto> getBalances(Long employeeId, int year) {
        return leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year).stream()
                .map(b -> new LeaveBalanceDto(
                        b.getLeaveType().getId(),
                        b.getLeaveType().getName(),
                        b.getAllocatedDays(),
                        b.getUsedDays(),
                        b.remainingDays()))
                .toList();
    }

    @CacheEvict(value = "leaveBalance", key = "#employeeId + ':' + #year")
    public void deductDays(Long employeeId, Long leaveTypeId, int year, BigDecimal days) {
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(employeeId, leaveTypeId, year)
                .orElseThrow(() -> new ResourceNotFoundException("No leave balance found for this employee/type/year"));

        BigDecimal remaining = balance.remainingDays();
        if (remaining.compareTo(days) < 0) {
            throw new IllegalStateException("Insufficient leave balance: remaining=" + remaining + ", requested=" + days);
        }
        balance.setUsedDays(balance.getUsedDays().add(days));
        leaveBalanceRepository.save(balance);
    }

    @CacheEvict(value = "leaveBalance", key = "#employeeId + ':' + #year")
    public void restoreDays(Long employeeId, Long leaveTypeId, int year, BigDecimal days) {
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(employeeId, leaveTypeId, year)
                .orElseThrow(() -> new ResourceNotFoundException("No leave balance found"));
        balance.setUsedDays(balance.getUsedDays().subtract(days));
        leaveBalanceRepository.save(balance);
    }

    public int currentYear() { return LocalDate.now().getYear(); }
}
```

`leave/service/LeaveService.java`
```java
package com.ngo.hrsystem.leave.service;

import com.ngo.hrsystem.common.exception.BusinessRuleException;
import com.ngo.hrsystem.common.exception.ResourceNotFoundException;
import com.ngo.hrsystem.employee.Employee;
import com.ngo.hrsystem.employee.EmployeeRepository;
import com.ngo.hrsystem.leave.dto.LeaveRequestDto;
import com.ngo.hrsystem.leave.entity.LeaveRequest;
import com.ngo.hrsystem.leave.entity.LeaveType;
import com.ngo.hrsystem.leave.repository.LeaveRequestRepository;
import com.ngo.hrsystem.leave.repository.LeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveBalanceService leaveBalanceService;
    private final LeaveNotificationService notificationService;

    public LeaveRequest submit(Long employeeId, LeaveRequestDto dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        LeaveType leaveType = leaveTypeRepository.findById(dto.leaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found"));

        if (dto.endDate().isBefore(dto.startDate())) {
            throw new BusinessRuleException("End date cannot be before start date");
        }

        boolean overlapping = leaveRequestRepository
                .existsByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        employeeId, LeaveRequest.Status.APPROVED, dto.endDate(), dto.startDate());
        if (overlapping) {
            throw new BusinessRuleException("Overlapping approved leave already exists for this period");
        }

        long days = ChronoUnit.DAYS.between(dto.startDate(), dto.endDate()) + 1;

        LeaveRequest request = LeaveRequest.builder()
                .employee(employee)
                .leaveType(leaveType)
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .totalDays(BigDecimal.valueOf(days))
                .reason(dto.reason())
                .status(LeaveRequest.Status.PENDING)
                .build();

        LeaveRequest saved = leaveRequestRepository.save(request);
        notificationService.notifyManagerOfNewRequest(saved);
        return saved;
    }

    public LeaveRequest approve(Long requestId, Long approverId) {
        LeaveRequest request = getPendingOrThrow(requestId);
        Employee approver = employeeRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found"));

        request.setStatus(LeaveRequest.Status.APPROVED);
        request.setApprover(approver);
        request.setApprovedAt(java.time.Instant.now());
        leaveRequestRepository.save(request);

        leaveBalanceService.deductDays(
                request.getEmployee().getId(),
                request.getLeaveType().getId(),
                request.getStartDate().getYear(),
                request.getTotalDays());

        notificationService.notifyEmployeeOfDecision(request, true, null);
        return request;
    }

    public LeaveRequest reject(Long requestId, Long approverId, String reason) {
        LeaveRequest request = getPendingOrThrow(requestId);
        Employee approver = employeeRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found"));

        request.setStatus(LeaveRequest.Status.REJECTED);
        request.setApprover(approver);
        request.setRejectionReason(reason);
        leaveRequestRepository.save(request);

        notificationService.notifyEmployeeOfDecision(request, false, reason);
        return request;
    }

    public void cancel(Long requestId, Long requesterId) {
        LeaveRequest request = getPendingOrThrow(requestId);
        if (!request.getEmployee().getId().equals(requesterId)) {
            throw new BusinessRuleException("Only the requester can cancel this leave request");
        }
        request.setStatus(LeaveRequest.Status.CANCELLED);
        leaveRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public Page<LeaveRequest> myRequests(Long employeeId, Pageable pageable) {
        return leaveRequestRepository.findByEmployeeId(employeeId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<LeaveRequest> pendingForManager(Long managerId, Pageable pageable) {
        return leaveRequestRepository.findByEmployeeManagerIdAndStatus(
                managerId, LeaveRequest.Status.PENDING, pageable);
    }

    private LeaveRequest getPendingOrThrow(Long requestId) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
        if (request.getStatus() != LeaveRequest.Status.PENDING) {
            throw new BusinessRuleException("Only pending requests can be modified");
        }
        return request;
    }
}
```

`leave/controller/LeaveController.java`
```java
package com.ngo.hrsystem.leave.controller;

import com.ngo.hrsystem.common.dto.ApiResponse;
import com.ngo.hrsystem.leave.dto.LeaveRequestDto;
import com.ngo.hrsystem.leave.entity.LeaveRequest;
import com.ngo.hrsystem.leave.service.LeaveBalanceService;
import com.ngo.hrsystem.leave.service.LeaveService;
import com.ngo.hrsystem.security.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/leave-requests")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;
    private final LeaveBalanceService leaveBalanceService;

    @PostMapping
    public ApiResponse<LeaveRequest> submit(@Valid @RequestBody LeaveRequestDto dto, @CurrentUser Long employeeId) {
        return ApiResponse.ok(leaveService.submit(employeeId, dto));
    }

    @GetMapping
    public ApiResponse<Page<LeaveRequest>> list(
            @RequestParam(defaultValue = "mine") String filter,
            @CurrentUser Long employeeId,
            Pageable pageable) {
        Page<LeaveRequest> result = "pending-approval".equals(filter)
                ? leaveService.pendingForManager(employeeId, pageable)
                : leaveService.myRequests(employeeId, pageable);
        return ApiResponse.ok(result);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER','HR','ADMIN')")
    public ApiResponse<LeaveRequest> approve(@PathVariable Long id, @CurrentUser Long approverId) {
        return ApiResponse.ok(leaveService.approve(id, approverId));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER','HR','ADMIN')")
    public ApiResponse<LeaveRequest> reject(@PathVariable Long id, @RequestBody java.util.Map<String, String> body,
                                             @CurrentUser Long approverId) {
        return ApiResponse.ok(leaveService.reject(id, approverId, body.get("reason")));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> cancel(@PathVariable Long id, @CurrentUser Long employeeId) {
        leaveService.cancel(id, employeeId);
        return ApiResponse.ok(null);
    }
}
```

`leave/controller/LeaveBalanceController.java`
```java
package com.ngo.hrsystem.leave.controller;

import com.ngo.hrsystem.common.dto.ApiResponse;
import com.ngo.hrsystem.leave.dto.LeaveBalanceDto;
import com.ngo.hrsystem.leave.service.LeaveBalanceService;
import com.ngo.hrsystem.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leave-balances")
@RequiredArgsConstructor
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;

    @GetMapping("/me")
    public ApiResponse<List<LeaveBalanceDto>> myBalances(@CurrentUser Long employeeId) {
        return ApiResponse.ok(leaveBalanceService.getBalances(employeeId, leaveBalanceService.currentYear()));
    }

    @GetMapping("/{employeeId}")
    @PreAuthorize("hasAnyRole('MANAGER','HR','ADMIN')")
    public ApiResponse<List<LeaveBalanceDto>> forEmployee(@PathVariable Long employeeId) {
        return ApiResponse.ok(leaveBalanceService.getBalances(employeeId, leaveBalanceService.currentYear()));
    }
}
```

> `@CurrentUser` is a small custom parameter annotation + `HandlerMethodArgumentResolver` that pulls `employeeId` out of the authenticated `Principal` (populated by `JwtAuthFilter`) — keeps controllers free of manual `SecurityContextHolder` calls.


---

## 11. Complete RedisConfig + Multi-Level (Caffeine + Redis) Caching

`pom.xml` additions:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

`application.yml`:
```yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 16
          max-idle: 8
          min-idle: 2

hr:
  cache:
    l1-expire-after-write-seconds: 60
    l1-max-size: 2000
    l2-ttl-minutes: 30
```

`config/RedisConfig.java`
```java
package com.ngo.hrsystem.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public ObjectMapper redisObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        mapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL);
        return mapper;
    }

    @Bean
    public GenericJackson2JsonRedisSerializer redisSerializer(ObjectMapper redisObjectMapper) {
        return new GenericJackson2JsonRedisSerializer(redisObjectMapper);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory connectionFactory,
            GenericJackson2JsonRedisSerializer redisSerializer) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(redisSerializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(redisSerializer);
        template.afterPropertiesSet();
        return template;
    }
}
```

`config/CacheConfig.java` — this is the actual **two-level (L1 Caffeine, L2 Redis) `CacheManager`**. Spring's cache abstraction only supports one `CacheManager` easily, so we implement a small composite manager that checks Caffeine first, falls through to Redis, and populates Caffeine on a Redis hit.

```java
package com.ngo.hrsystem.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.support.SimpleValueWrapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    @Value("${hr.cache.l1-expire-after-write-seconds:60}")
    private long l1ExpireSeconds;

    @Value("${hr.cache.l1-max-size:2000}")
    private long l1MaxSize;

    @Value("${hr.cache.l2-ttl-minutes:30}")
    private long l2TtlMinutes;

    @Bean
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(l1ExpireSeconds, TimeUnit.SECONDS)
                .maximumSize(l1MaxSize)
                .recordStats());
        manager.setAllowNullValues(false);
        return manager;
    }

    @Bean
    public CacheManager redisCacheManager(
            RedisConnectionFactory connectionFactory,
            GenericJackson2JsonRedisSerializer redisSerializer) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(l2TtlMinutes))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(redisSerializer))
                .prefixCacheNameWith("hr:");

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }

    /** Primary CacheManager used by @Cacheable — composite L1 (Caffeine) + L2 (Redis). */
    @Bean
    @org.springframework.context.annotation.Primary
    public CacheManager multiLevelCacheManager(
            CacheManager caffeineCacheManager,
            CacheManager redisCacheManager) {
        return new MultiLevelCacheManager(caffeineCacheManager, redisCacheManager);
    }

    /** Composite CacheManager: reads L1 -> L2 -> miss; writes to both; evicts from both. */
    static class MultiLevelCacheManager implements CacheManager {
        private final CacheManager l1;
        private final CacheManager l2;

        MultiLevelCacheManager(CacheManager l1, CacheManager l2) {
            this.l1 = l1;
            this.l2 = l2;
        }

        @Override
        public Cache getCache(String name) {
            Cache l1Cache = l1.getCache(name);
            Cache l2Cache = l2.getCache(name);
            return new MultiLevelCache(name, l1Cache, l2Cache);
        }

        @Override
        public List<String> getCacheNames() {
            return List.copyOf(l2.getCacheNames());
        }
    }

    /** A single named cache backed by Caffeine (L1) + Redis (L2). */
    static class MultiLevelCache implements Cache {
        private final String name;
        private final Cache l1;
        private final Cache l2;

        MultiLevelCache(String name, Cache l1, Cache l2) {
            this.name = name;
            this.l1 = l1;
            this.l2 = l2;
        }

        @Override public String getName() { return name; }
        @Override public Object getNativeCache() { return this; }

        @Override
        public ValueWrapper get(Object key) {
            ValueWrapper value = l1.get(key);
            if (value != null) return value;

            value = l2.get(key);
            if (value != null) {
                // promote to L1 so subsequent hits skip the Redis round-trip
                l1.put(key, value.get());
            }
            return value;
        }

        @Override
        @SuppressWarnings("unchecked")
        public <T> T get(Object key, Class<T> type) {
            ValueWrapper wrapper = get(key);
            return wrapper == null ? null : (T) wrapper.get();
        }

        @Override
        public <T> T get(Object key, java.util.concurrent.Callable<T> valueLoader) {
            ValueWrapper wrapper = get(key);
            if (wrapper != null) return (T) wrapper.get();
            try {
                T value = valueLoader.call();
                put(key, value);
                return value;
            } catch (Exception e) {
                throw new Cache.ValueRetrievalException(key, valueLoader, e);
            }
        }

        @Override
        public void put(Object key, Object value) {
            l1.put(key, value);
            l2.put(key, value);
        }

        @Override
        public void evict(Object key) {
            l1.evict(key);
            l2.evict(key);
        }

        @Override
        public void clear() {
            l1.clear();
            l2.clear();
        }
    }
}
```

**Why this shape:**
- `@Cacheable("employee")` transparently gets L1 speed for hot keys and L2 (Redis) consistency across pods — no changes needed in service code.
- On a Redis miss but Caffeine hit, we skip Redis entirely (fast path). On a Redis hit but Caffeine miss (e.g. after JVM restart, or key evicted from L1), we promote into L1.
- `@CacheEvict`/`@CachePut` naturally cascade to both levels since they go through the same `Cache` interface.
- A known trade-off: **L1 across multiple app instances is only eventually consistent** (each pod has its own Caffeine). For strictly consistent data (e.g. leave balance right after approval), rely on the `@CacheEvict` call evicting Redis + local L1 for the pod that made the write — other pods' stale L1 entries expire within `l1-expire-after-write-seconds` (kept short, 60s, for this reason).


---

## 12. Cache Warming Component

Warms small, stable, high-traffic datasets (leave types, department tree) right after startup so the first real request isn't slow, and periodically refreshes them to avoid a "cold L1 after restart" penalty across pods.

`cache/CacheNames.java`
```java
package com.ngo.hrsystem.cache;

public final class CacheNames {
    public static final String EMPLOYEE = "employee";
    public static final String LEAVE_BALANCE = "leaveBalance";
    public static final String LEAVE_TYPES = "leaveTypes";
    public static final String DEPARTMENT_TREE = "departmentTree";

    private CacheNames() {}
}
```

`cache/CacheWarmingComponent.java`
```java
package com.ngo.hrsystem.cache;

import com.ngo.hrsystem.department.DepartmentService;
import com.ngo.hrsystem.leave.repository.LeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.CacheManager;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CacheWarmingComponent {

    private final CacheManager cacheManager;
    private final LeaveTypeRepository leaveTypeRepository;
    private final DepartmentService departmentService;

    @EventListener(ApplicationReadyEvent.class)
    public void warmOnStartup() {
        log.info("Cache warming started...");
        warmLeaveTypes();
        warmDepartmentTree();
        log.info("Cache warming complete.");
    }

    /** Refresh stable reference caches every 30 minutes so they never fully expire under load. */
    @Scheduled(fixedRate = 30, timeUnit = java.util.concurrent.TimeUnit.MINUTES)
    public void refresh() {
        log.debug("Scheduled cache refresh running");
        warmLeaveTypes();
        warmDepartmentTree();
    }

    private void warmLeaveTypes() {
        var cache = cacheManager.getCache(CacheNames.LEAVE_TYPES);
        if (cache == null) return;
        var allTypes = leaveTypeRepository.findAll();
        cache.put("all", allTypes);
        log.info("Warmed {} cache with {} entries", CacheNames.LEAVE_TYPES, allTypes.size());
    }

    private void warmDepartmentTree() {
        var cache = cacheManager.getCache(CacheNames.DEPARTMENT_TREE);
        if (cache == null) return;
        var tree = departmentService.buildOrgTreeUncached();
        cache.put("root", tree);
        log.info("Warmed {} cache", CacheNames.DEPARTMENT_TREE);
    }
}
```

`config` — enable scheduling:
```java
package com.ngo.hrsystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulingConfig {}
```

> `buildOrgTreeUncached()` is a plain (non-`@Cacheable`) method the warmer calls directly, so warming doesn't accidentally short-circuit through the same annotation-driven cache it's trying to populate.

---

## 13. Full `docker-compose.yml`

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: hr-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: hr_system
      POSTGRES_USER: hr_admin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hr_admin -d hr_system"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - hr-network

  redis:
    image: redis:7-alpine
    container_name: hr-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD:-changeme} --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-changeme}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - hr-network

  backend:
    build:
      context: ./hr-system-backend
      dockerfile: Dockerfile
    container_name: hr-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/hr_system
      SPRING_DATASOURCE_USERNAME: hr_admin
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-changeme}
      JWT_SECRET: ${JWT_SECRET:-change-this-to-a-long-random-secret}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:-}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:-}
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 15s
      timeout: 5s
      retries: 5
    networks:
      - hr-network

  frontend:
    build:
      context: ./hr-system-frontend
      dockerfile: Dockerfile
    container_name: hr-frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "4200:80"
    networks:
      - hr-network

  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: hr-redis-commander
    restart: unless-stopped
    environment:
      REDIS_HOSTS: local:redis:6379:0:${REDIS_PASSWORD:-changeme}
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - hr-network

volumes:
  pg_data:
  redis_data:

networks:
  hr-network:
    driver: bridge
```

`hr-system-backend/Dockerfile`:
```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -B
COPY src ./src
RUN ./mvnw package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

`hr-system-frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/hr-system-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

`hr-system-frontend/nginx.conf`:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Run it:
```bash
docker compose up -d --build
docker compose logs -f backend
```


---

## 14. Suggested Build Order

1. `V1`–`V4` Flyway migrations + core entities (Employee, Department, User/Auth) → get JWT login working end-to-end.
2. Employee CRUD module (as sample above) — confirms security + pagination + caching wiring.
3. Leave module (entities → repos → services → controllers → Angular skeleton) — the most business-logic-heavy module, good to nail early.
4. Wire in `RedisConfig` + `CacheConfig` (multi-level) once you have at least 2 real `@Cacheable` methods to validate against (Employee lookup + Leave balances fit well).
5. Add `CacheWarmingComponent` once leave types / department tree are stable enough to be worth pre-loading.
6. Attendance → Payroll → Recruitment → Performance, in that order (each is progressively less coupled to the others).
7. `docker-compose.yml` last, once backend + frontend build cleanly standalone — makes debugging container-network issues much easier than debugging app code and Docker networking at the same time.