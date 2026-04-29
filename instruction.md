# M'Lop Tapang NGO Management System
## Full Build Checklist — ASP.NET Core C# + Angular
> Reverse-engineered from mlopdata.com · Technology: ASP.NET Core 10 Web API + Angular 17+

---

## Table of Contents
- [Phase 1 — Project Setup & Architecture](#phase-1--project-setup--architecture)
- [Phase 2 — Database & Domain Models](#phase-2--database--domain-models)
- [Phase 3 — Authentication & User Management](#phase-3--authentication--user-management)
- [Phase 4 — Beneficiary Management Module](#phase-4--beneficiary-management-module)
- [Phase 5 — Program & Enrollment Module](#phase-5--program--enrollment-module)
- [Phase 6 — Case Management Module](#phase-6--case-management-module)
- [Phase 7 — Vocational Training Module](#phase-7--vocational-training-module)
- [Phase 8 — Job Placement Module](#phase-8--job-placement-module)
- [Phase 9 — Placement Monitoring Module](#phase-9--placement-monitoring-module)
- [Phase 10 — Health & Medical Module](#phase-10--health--medical-module)
- [Phase 11 — Attendance & Activity Module](#phase-11--attendance--activity-module)
- [Phase 12 — Staff & Social Worker Module](#phase-12--staff--social-worker-module)
- [Phase 13 — Donor & Funding Module](#phase-13--donor--funding-module)
- [Phase 14 — Reports & Dashboard Module](#phase-14--reports--dashboard-module)
- [Phase 15 — Notifications & Alerts](#phase-15--notifications--alerts)
- [Phase 16 — Angular Frontend](#phase-16--angular-frontend)
- [Phase 17 — API Security & Performance](#phase-17--api-security--performance)
- [Phase 18 — Deployment & DevOps](#phase-18--deployment--devops)

---

## Phase 1 — Project Setup & Architecture

### Solution Structure
- [ ] Create solution: `dotnet new sln -n MlopTapang`
- [ ] Create API project: `dotnet new webapi -n MlopTapang.API --framework net10.0`
- [ ] Create Application layer: `dotnet new classlib -n MlopTapang.Application`
- [ ] Create Domain layer: `dotnet new classlib -n MlopTapang.Domain`
- [ ] Create Infrastructure layer: `dotnet new classlib -n MlopTapang.Infrastructure`
- [ ] Create Angular project: `ng new mlop-tapang-ui --standalone --style=scss --routing`
- [ ] Add all projects to solution file
- [ ] Set up project references (API → Application → Domain, Infrastructure → Application)

### NuGet Packages — API / Infrastructure
- [ ] `Microsoft.EntityFrameworkCore.SqlServer` — EF Core SQL Server
- [ ] `Microsoft.EntityFrameworkCore.Tools` — migrations CLI
- [ ] `Microsoft.AspNetCore.Authentication.JwtBearer` — JWT auth
- [ ] `MediatR` — CQRS pattern
- [ ] `FluentValidation.AspNetCore` — input validation
- [ ] `AutoMapper.Extensions.Microsoft.DependencyInjection` — object mapping
- [ ] `Serilog.AspNetCore` — structured logging
- [ ] `Hangfire.SqlServer` — background jobs / scheduled tasks
- [ ] `ClosedXML` — Excel export
- [ ] `ReportViewerCore.NETCore` — RDLC PDF reports
- [ ] `QuestPDF` — alternative PDF generation
- [ ] `SixLabors.ImageSharp` — photo/image processing
- [ ] `Microsoft.AspNetCore.SignalR` — real-time notifications
- [ ] `StackExchange.Redis` — distributed caching

### Angular Packages
- [ ] `@angular/cdk` — drag/drop, overlays
- [ ] `@angular/material` — UI components
- [ ] `primeng` — data tables, charts, calendar
- [ ] `chart.js` + `ng2-charts` — dashboard charts
- [ ] `@auth0/angular-jwt` — JWT interceptor
- [ ] `ngx-translate` — Khmer/English i18n
- [ ] `date-fns` — date utilities
- [ ] `file-saver` — download files from API
- [ ] `ngx-spinner` — loading indicators
- [ ] `@microsoft/signalr` — real-time notifications

### Architecture Setup
- [ ] Configure Clean Architecture folder structure
- [ ] Set up CQRS with MediatR (Commands + Queries)
- [ ] Configure AutoMapper profiles for each module
- [ ] Set up global exception handler middleware
- [ ] Configure `Result<T>` pattern for all responses
- [ ] Set up `PagedResult<T>` for all list endpoints
- [ ] Configure Swagger / OpenAPI documentation
- [ ] Set up API versioning (`v1`, `v2`)
- [ ] Configure CORS for Angular origin
- [ ] Set up Serilog with file + console sinks
- [ ] Configure health checks endpoint (`/health`)

---

## Phase 2 — Database & Domain Models

### Base Entities
- [ ] `BaseEntity` — Id (Guid), CreatedAt, UpdatedAt, CreatedById, IsDeleted
- [ ] `BaseAuditEntity` — extends BaseEntity + audit fields
- [ ] Configure global soft-delete query filter in EF Core
- [ ] Configure auto-set CreatedAt/UpdatedAt via `SaveChangesInterceptor`

### Core Lookup Tables
- [ ] `Province` — Id, Name, NameKh, Code
- [ ] `District` — Id, ProvinceId (FK), Name, NameKh
- [ ] `Commune` — Id, DistrictId (FK), Name, NameKh
- [ ] `Village` — Id, CommuneId (FK), Name, NameKh
- [ ] `Nationality` — Id, Name
- [ ] `Religion` — Id, Name
- [ ] `EducationLevel` — Id, Name (None, Primary, Secondary, High, University)
- [ ] `MaritalStatus` — Id, Name
- [ ] `ReferralSource` — Id, Name (Walk-in, Referral, Outreach, etc.)
- [ ] `ExitReason` — Id, Name (Graduated, Dropped Out, Moved, Deceased, etc.)
- [ ] `DocumentType` — Id, Name (ID Card, Birth Certificate, etc.)

### Beneficiary Domain
- [ ] `Beneficiary`
  - [ ] Id, BeneficiaryCode (auto-generated e.g. MLT-2024-00001)
  - [ ] FirstName, LastName, FirstNameKh, LastNameKh
  - [ ] DateOfBirth, Age (computed), Gender
  - [ ] NationalityId (FK), ReligionId (FK)
  - [ ] MaritalStatusId (FK)
  - [ ] PhoneNumber, AlternativePhone
  - [ ] VillageId (FK) → Commune → District → Province
  - [ ] CurrentAddress, PermanentAddress
  - [ ] PhotoPath (profile photo)
  - [ ] IntakeDate, ExitDate, ExitReasonId (FK)
  - [ ] ReferralSourceId (FK), ReferredBy
  - [ ] IsActive, IsVulnerable, VulnerabilityNotes
  - [ ] EducationLevelId (FK), SchoolName
  - [ ] FamilyBackground (text)
  - [ ] SocialWorkerAssignedId (FK to Staff)
  - [ ] CreatedAt, UpdatedAt

- [ ] `BeneficiaryDocument`
  - [ ] Id, BeneficiaryId (FK), DocumentTypeId (FK)
  - [ ] DocumentNumber, IssuedDate, ExpiryDate
  - [ ] FilePath, Notes

- [ ] `BeneficiaryFamily` (household members)
  - [ ] Id, BeneficiaryId (FK)
  - [ ] RelationshipType (Father, Mother, Sibling, Guardian)
  - [ ] FullName, Age, Occupation, Income
  - [ ] IsLivingTogether, Notes

- [ ] `BeneficiaryVulnerability`
  - [ ] Id, BeneficiaryId (FK)
  - [ ] VulnerabilityType (enum: Poverty, Abuse, Orphan, Disability, etc.)
  - [ ] Description, AssessedDate, AssessedById (FK)

### Program Domain
- [ ] `Program`
  - [ ] Id, Name, NameKh, Code
  - [ ] Description, ProgramType (Education, Health, Vocational, Livelihood)
  - [ ] StartDate, EndDate, IsActive

- [ ] `Enrollment`
  - [ ] Id, BeneficiaryId (FK), ProgramId (FK)
  - [ ] EnrollmentDate, CompletionDate, Status (Active, Completed, Dropped)
  - [ ] Notes, SocialWorkerNotes
  - [ ] Grade, Score

### Vocational Training Domain
- [ ] `TrainingCourse`
  - [ ] Id, Name, NameKh, Code
  - [ ] Duration (months), DurationUnit
  - [ ] Description, MaxStudents
  - [ ] IsActive

- [ ] `TrainingBatch`
  - [ ] Id, CourseId (FK), BatchNumber, BatchName
  - [ ] StartDate, EndDate, Location
  - [ ] TrainerId (FK to Staff), Status

- [ ] `TrainingEnrollment`
  - [ ] Id, BeneficiaryId (FK), BatchId (FK)
  - [ ] EnrollmentDate, CompletionDate
  - [ ] Status (Enrolled, Completed, Dropped, Failed)
  - [ ] FinalScore, CertificateIssued, CertificateNumber
  - [ ] Notes

### Placement Domain
- [ ] `JobPlacement`
  - [ ] Id, BeneficiaryId (FK), TrainingEnrollmentId (FK nullable)
  - [ ] PlacementCode (auto-generated PLM-2024-00001)
  - [ ] EmployerName, EmployerAddress, EmployerPhone
  - [ ] JobTitle, JobSector
  - [ ] PlacementDate, Salary, SalaryUnit (Daily/Monthly)
  - [ ] PlacedById (FK to Staff)
  - [ ] Status (Active, Changed, Resigned, Terminated)
  - [ ] Notes

- [ ] `PlacementMonitoring` ← **core module visible on mlopdata.com**
  - [ ] Id, PlacementId (FK)
  - [ ] MonitoringType (enum: 1st_1Month, 2nd_2Months, 3rd_3Months, 4th_4Months, 5th_5Months, 6th_6Months, 8th_8Months, 10th_10Months, Final)
  - [ ] NextMonitoringDate (scheduled)
  - [ ] MonitorDate (actual date conducted)
  - [ ] CompletionStatus (Pending, Completed)
  - [ ] IsStillInPlacement (bool)
  - [ ] HasChangedJob (bool)
  - [ ] CurrentSalary
  - [ ] ProgressNote (text)
  - [ ] MonitoredById (FK to Staff)
  - [ ] CreatedAt

### Case Management Domain
- [ ] `Case`
  - [ ] Id, CaseCode (auto-generated), BeneficiaryId (FK)
  - [ ] CaseType (Support, Crisis, Follow-up, Referral)
  - [ ] OpenedDate, ClosedDate, Status (Open, In Progress, Closed)
  - [ ] Priority (Low, Medium, High, Critical)
  - [ ] AssignedToId (FK to Staff)
  - [ ] Description, Resolution

- [ ] `CaseNote`
  - [ ] Id, CaseId (FK), AuthorId (FK to Staff)
  - [ ] NoteDate, Content, IsConfidential
  - [ ] AttachmentPath

- [ ] `CaseReferral`
  - [ ] Id, CaseId (FK), ReferredToOrganization
  - [ ] ReferralDate, ResponseDate, Outcome

### Health Domain
- [ ] `HealthRecord`
  - [ ] Id, BeneficiaryId (FK), VisitDate
  - [ ] VisitType (Checkup, Emergency, Dental, Mental Health)
  - [ ] Diagnosis, Treatment, Prescription
  - [ ] HealthWorkerNotes, FollowUpDate
  - [ ] RecordedById (FK to Staff)

- [ ] `Vaccination`
  - [ ] Id, BeneficiaryId (FK), VaccineName
  - [ ] DateGiven, DueDate, Completed, Notes

### Attendance Domain
- [ ] `ActivitySession`
  - [ ] Id, ProgramId (FK), SessionDate, SessionType
  - [ ] Location, FacilitatedById (FK to Staff), Notes

- [ ] `AttendanceRecord`
  - [ ] Id, SessionId (FK), BeneficiaryId (FK)
  - [ ] Status (Present, Absent, Late, Excused), Notes

### Staff Domain
- [ ] `Staff`
  - [ ] Id, UserId (FK nullable), StaffCode
  - [ ] FirstName, LastName, FirstNameKh, LastNameKh
  - [ ] Gender, DateOfBirth, PhoneNumber
  - [ ] Position, Department, StartDate, EndDate
  - [ ] IsActive, PhotoPath, EmergencyContact

### Donor Domain
- [ ] `Donor`
  - [ ] Id, DonorCode, Name, DonorType (Individual, Organization, Government)
  - [ ] ContactPerson, Email, Phone, Country
  - [ ] IsActive, Notes

- [ ] `Funding`
  - [ ] Id, DonorId (FK), ProgramId (FK nullable)
  - [ ] Amount, Currency, StartDate, EndDate
  - [ ] Purpose, Notes, Status

### EF Core Configuration
- [ ] Create `AppDbContext` with all DbSets
- [ ] Create Fluent API configuration class per entity
- [ ] Configure global soft-delete query filter
- [ ] Configure cascade delete rules per FK
- [ ] Configure JSON column for complex value objects
- [ ] Create initial migration: `dotnet ef migrations add InitialSchema`
- [ ] Create seed data: provinces, districts, communes, lookup values
- [ ] Run migration: `dotnet ef database update`

---

## Phase 3 — Authentication & User Management

### Backend — Identity & JWT
- [ ] Create `User` entity (extends BaseEntity)
  - [ ] Email, NormalizedEmail, PasswordHash, Username
  - [ ] StaffId (FK nullable — links to staff profile)
  - [ ] IsActive, IsEmailVerified, LastLoginAt
  - [ ] FailedLoginAttempts, LockoutEnd
  - [ ] RefreshToken, RefreshTokenExpiry
- [ ] Create `Role` entity — Name, Description, IsSystem
- [ ] Create `Permission` entity — Name, Module, Action
- [ ] Create `UserRole` join table
- [ ] Create `RolePermission` join table
- [ ] Define permissions constants class:
  - [ ] `Beneficiaries.View / Create / Edit / Delete`
  - [ ] `Placements.View / Create / Edit / Monitor`
  - [ ] `Cases.View / Create / Edit / Close`
  - [ ] `Health.View / Create / Edit`
  - [ ] `Reports.View / Export`
  - [ ] `Users.View / Create / Edit / Delete`
  - [ ] `Settings.View / Edit`
- [ ] Implement JWT access token generation (15-min expiry)
- [ ] Implement refresh token rotation (7-day expiry)
- [ ] Implement Argon2id password hashing
- [ ] Implement account lockout after 5 failed attempts
- [ ] Implement `ICurrentUserService` (reads from HttpContext)
- [ ] Implement `PermissionHandler` (reads claims from JWT)
- [ ] Implement `PermissionPolicyProvider` (dynamic policies)
- [ ] Add `[Authorize(Policy = "Permission:xxx")]` to controllers
- [ ] Implement role-based seeding for system roles (Admin, Manager, SocialWorker, Viewer)

### Auth Endpoints
- [ ] `POST /api/v1/auth/login` — email + password → access + refresh tokens
- [ ] `POST /api/v1/auth/refresh` — rotate refresh token
- [ ] `POST /api/v1/auth/logout` — revoke refresh token
- [ ] `POST /api/v1/auth/change-password`
- [ ] `POST /api/v1/auth/forgot-password` — send reset email
- [ ] `POST /api/v1/auth/reset-password` — confirm reset token
- [ ] `GET  /api/v1/auth/me` — current user profile + permissions

### User Management Endpoints
- [ ] `GET    /api/v1/users` — paginated list with search
- [ ] `GET    /api/v1/users/{id}`
- [ ] `POST   /api/v1/users` — create user + assign role
- [ ] `PUT    /api/v1/users/{id}`
- [ ] `DELETE /api/v1/users/{id}` — soft delete
- [ ] `POST   /api/v1/users/{id}/roles` — assign role
- [ ] `DELETE /api/v1/users/{id}/roles/{roleId}` — remove role

### Angular — Auth Module
- [ ] Create `AuthModule` with lazy loading
- [ ] Create `LoginComponent` — email/password form
- [ ] Create `ForgotPasswordComponent`
- [ ] Create `ResetPasswordComponent`
- [ ] Create `ChangePasswordComponent`
- [ ] Implement `AuthService` — login, logout, refresh, getCurrentUser
- [ ] Implement `JwtInterceptor` — attach Bearer token to all requests
- [ ] Implement `AuthGuard` — redirect unauthenticated users
- [ ] Implement `PermissionGuard` — protect routes by permission
- [ ] Implement `RoleGuard` — protect routes by role
- [ ] Store tokens in `localStorage` (access) + `sessionStorage` (remember me)
- [ ] Implement silent token refresh via refresh token
- [ ] Create `PermissionDirective` — `*hasPermission="'beneficiaries.create'"`
- [ ] Create `UserProfileComponent` in header

---

## Phase 4 — Beneficiary Management Module

### Backend
- [ ] **CQRS Commands:**
  - [ ] `CreateBeneficiaryCommand` + Handler + Validator
  - [ ] `UpdateBeneficiaryCommand` + Handler + Validator
  - [ ] `DeleteBeneficiaryCommand` + Handler (soft delete)
  - [ ] `UploadBeneficiaryPhotoCommand` + Handler
  - [ ] `AddDocumentCommand` + Handler
  - [ ] `AddFamilyMemberCommand` + Handler
  - [ ] `AssignSocialWorkerCommand` + Handler
  - [ ] `ExitBeneficiaryCommand` + Handler (sets ExitDate + ExitReason)
  - [ ] `ReactivateBeneficiaryCommand` + Handler

- [ ] **CQRS Queries:**
  - [ ] `GetBeneficiariesQuery` — paged, filter by program/status/gender/age
  - [ ] `GetBeneficiaryByIdQuery` — full profile with related data
  - [ ] `GetBeneficiaryTimelineQuery` — all activities in chronological order
  - [ ] `SearchBeneficiariesQuery` — quick search by name, code, phone
  - [ ] `GetBeneficiaryDocumentsQuery`
  - [ ] `GetBeneficiaryFamilyQuery`

- [ ] Auto-generate BeneficiaryCode: `MLT-{YYYY}-{5-digit-seq}`
- [ ] Validate uniqueness: phone number, document number
- [ ] File storage service for photos and documents (local or Azure Blob)
- [ ] Create image resizing service for profile photos (max 400x400)

- [ ] **API Endpoints:**
  - [ ] `GET    /api/v1/beneficiaries` — paged list
  - [ ] `GET    /api/v1/beneficiaries/{id}` — full profile
  - [ ] `GET    /api/v1/beneficiaries/{id}/timeline`
  - [ ] `GET    /api/v1/beneficiaries/{id}/documents`
  - [ ] `GET    /api/v1/beneficiaries/{id}/family`
  - [ ] `GET    /api/v1/beneficiaries/{id}/placements`
  - [ ] `GET    /api/v1/beneficiaries/{id}/cases`
  - [ ] `GET    /api/v1/beneficiaries/{id}/health`
  - [ ] `GET    /api/v1/beneficiaries/{id}/enrollments`
  - [ ] `GET    /api/v1/beneficiaries/{id}/attendance`
  - [ ] `POST   /api/v1/beneficiaries`
  - [ ] `PUT    /api/v1/beneficiaries/{id}`
  - [ ] `DELETE /api/v1/beneficiaries/{id}`
  - [ ] `POST   /api/v1/beneficiaries/{id}/photo`
  - [ ] `POST   /api/v1/beneficiaries/{id}/documents`
  - [ ] `POST   /api/v1/beneficiaries/{id}/family`
  - [ ] `POST   /api/v1/beneficiaries/{id}/exit`
  - [ ] `POST   /api/v1/beneficiaries/{id}/reactivate`
  - [ ] `GET    /api/v1/beneficiaries/export` — Excel export

### Angular
- [ ] Create `BeneficiaryModule` with lazy loading
- [ ] `BeneficiaryListComponent`
  - [ ] PrimeNG DataTable with server-side pagination
  - [ ] Advanced filter panel: gender, age range, program, status, social worker
  - [ ] Quick search bar (name / code / phone)
  - [ ] Export to Excel button
  - [ ] Add new button (permission-gated)
  - [ ] Click row → navigate to profile
- [ ] `BeneficiaryProfileComponent` (full detail view)
  - [ ] Header card: photo, name, code, age, status badge
  - [ ] Tab navigation: Profile | Family | Documents | Programs | Placement | Health | Cases | Attendance | Timeline
  - [ ] Edit button (permission-gated)
- [ ] `BeneficiaryFormComponent` (create / edit)
  - [ ] Multi-step form: Personal Info → Address → Family → Vulnerability
  - [ ] Step validation before proceeding
  - [ ] Photo upload with crop preview
  - [ ] Auto-suggest for address (Province → District → Commune → Village cascade)
  - [ ] Save as draft support
- [ ] `BeneficiaryTimelineComponent`
  - [ ] Vertical timeline showing all events (enrollment, placement, health, case)
  - [ ] Filter by event type
  - [ ] Sorted newest first
- [ ] `DocumentUploadComponent` — file upload with type + date fields
- [ ] `FamilyMembersComponent` — inline editable table
- [ ] `BeneficiarySearchComponent` — shared reusable autocomplete for other modules
- [ ] `BeneficiaryExitDialogComponent` — modal with exit reason + date

---

## Phase 5 — Program & Enrollment Module

### Backend
- [ ] **Commands:** CreateProgram, UpdateProgram, DeleteProgram, EnrollBeneficiary, UnenrollBeneficiary, CompleteEnrollment
- [ ] **Queries:** GetPrograms, GetProgramById, GetEnrollmentsByBeneficiary, GetEnrollmentsByProgram
- [ ] Validate: no duplicate enrollment in same active program
- [ ] API Endpoints:
  - [ ] `GET/POST/PUT/DELETE /api/v1/programs`
  - [ ] `GET /api/v1/programs/{id}/enrollments`
  - [ ] `POST /api/v1/enrollments` — enroll beneficiary
  - [ ] `PUT  /api/v1/enrollments/{id}` — update status/score
  - [ ] `POST /api/v1/enrollments/{id}/complete`

### Angular
- [ ] `ProgramListComponent` — cards view with enrollment counts
- [ ] `ProgramFormComponent`
- [ ] `EnrollmentListComponent` — per program view with status filters
- [ ] `EnrollBeneficiaryDialogComponent` — search + select beneficiary + date
- [ ] `MyEnrolledBeneficiariesComponent` — social worker dashboard view

---

## Phase 6 — Case Management Module

### Backend
- [ ] **Commands:** OpenCase, UpdateCase, CloseCase, AddCaseNote, AddReferral, AssignCase
- [ ] **Queries:** GetCases (filtered by status/type/worker), GetCaseById (with notes + referrals), GetCasesByBeneficiary
- [ ] Auto-generate CaseCode: `CASE-{YYYY}-{5-digit}`
- [ ] Implement case note confidentiality (hidden from Viewer role)
- [ ] API Endpoints:
  - [ ] `GET/POST/PUT /api/v1/cases`
  - [ ] `POST /api/v1/cases/{id}/close`
  - [ ] `GET/POST /api/v1/cases/{id}/notes`
  - [ ] `PUT/DELETE /api/v1/cases/{id}/notes/{noteId}`
  - [ ] `POST /api/v1/cases/{id}/referrals`
  - [ ] `POST /api/v1/cases/{id}/assign`

### Angular
- [ ] `CaseListComponent` — filter by open/closed/priority/worker
- [ ] `CaseDetailComponent` — case info + notes timeline + referrals
- [ ] `CaseFormComponent` — open new case, link to beneficiary
- [ ] `CaseNoteEditorComponent` — rich text editor for notes
- [ ] `CaseNoteTimelineComponent` — chronological notes
- [ ] `AssignCaseDialogComponent` — select social worker
- [ ] `CaseReferralComponent` — log referral to external org

---

## Phase 7 — Vocational Training Module

### Backend
- [ ] **Commands:** CreateCourse, UpdateCourse, CreateBatch, UpdateBatch, EnrollInBatch, CompleteBatch, IssueCertificate
- [ ] **Queries:** GetCourses, GetBatches (by course/status), GetBatchEnrollments, GetBeneficiaryTrainingHistory
- [ ] API Endpoints:
  - [ ] `GET/POST/PUT/DELETE /api/v1/training/courses`
  - [ ] `GET/POST/PUT /api/v1/training/batches`
  - [ ] `GET /api/v1/training/batches/{id}/enrollments`
  - [ ] `POST /api/v1/training/batches/{id}/enroll`
  - [ ] `POST /api/v1/training/enrollments/{id}/complete`
  - [ ] `POST /api/v1/training/enrollments/{id}/certificate`

### Angular
- [ ] `CourseListComponent` — grid of available courses
- [ ] `BatchManagementComponent` — per-course batch list with status
- [ ] `BatchEnrollmentComponent` — add beneficiaries to batch (bulk select)
- [ ] `TrainingProgressComponent` — per-beneficiary training history
- [ ] `CertificatePreviewComponent` — generate certificate with RDLC

---

## Phase 8 — Job Placement Module

### Backend
- [ ] **Commands:** CreatePlacement, UpdatePlacement, ChangePlacementStatus, RecordSalaryChange
- [ ] **Queries:** GetPlacements (filter by sector/status/date), GetPlacementByBeneficiary, GetPlacementDueForMonitoring
- [ ] Auto-generate PlacementCode: `PLM-{YYYY}-{5-digit}`
- [ ] After placement created: auto-schedule 1st monitoring (1 month later)
- [ ] Background job (Hangfire): daily check for overdue monitoring → send alert
- [ ] API Endpoints:
  - [ ] `GET/POST/PUT /api/v1/placements`
  - [ ] `GET /api/v1/placements/{id}`
  - [ ] `GET /api/v1/placements/{id}/monitoring`
  - [ ] `POST /api/v1/placements/{id}/status` — Active/Changed/Resigned
  - [ ] `GET /api/v1/placements/due-monitoring` — overdue monitoring list
  - [ ] `GET /api/v1/placements/export`

### Angular
- [ ] `PlacementListComponent`
  - [ ] Filter: status, sector, date range, social worker
  - [ ] Status badge (Active, Changed, Resigned)
  - [ ] Column: Next Monitoring Date (with red highlight if overdue)
- [ ] `PlacementFormComponent`
  - [ ] Beneficiary search autocomplete
  - [ ] Link to training course (optional)
  - [ ] Employer details section
  - [ ] Salary with currency/unit selector
- [ ] `PlacementDetailComponent`
  - [ ] Placement summary card
  - [ ] Monitoring history tab
  - [ ] Status change log
- [ ] `PlacementStatusBadgeComponent` — reusable status indicator

---

## Phase 9 — Placement Monitoring Module
> **This is the core visible module from mlopdata.com**

### Backend
- [ ] **Commands:**
  - [ ] `AddPlacementMonitoringCommand`
    - [ ] PlacementId, MonitoringType, NextMonitoringDate, MonitorDate
    - [ ] CompletionStatus (Pending/Completed), IsStillInPlacement
    - [ ] HasChangedJob, CurrentSalary, ProgressNote
  - [ ] `UpdatePlacementMonitoringCommand`
  - [ ] `DeletePlacementMonitoringCommand`
  - [ ] `MarkMonitoringCompleteCommand`

- [ ] **Queries:**
  - [ ] `GetMonitoringByPlacementQuery` — all monitoring for one placement
  - [ ] `GetPendingMonitoringQuery` — all placements pending monitoring (overdue/due-soon)
  - [ ] `GetMonitoringHistoryQuery` — filtered by date / worker / status
  - [ ] `GetMonitoringDashboardStatsQuery`

- [ ] **Business Rules:**
  - [ ] Monitoring types in strict order: 1→2→3→4→5→6→8→10→Final months
  - [ ] Cannot add monitoring out of sequence
  - [ ] Auto-calculate next monitoring date from MonitoringType
  - [ ] When `HasChangedJob = true` → auto-create new Placement record
  - [ ] When `IsStillInPlacement = false` AND not changed → update Placement status to Resigned/Left
  - [ ] Final monitoring = closes placement cycle

- [ ] **Background Jobs (Hangfire):**
  - [ ] Daily: scan for placements where NextMonitoringDate ≤ today → mark as DueSoon
  - [ ] Daily: scan for placements where NextMonitoringDate < today → mark as Overdue
  - [ ] Daily: send email/notification to assigned social worker for overdue monitoring

- [ ] **API Endpoints:**
  - [ ] `GET    /api/v1/placements/{id}/monitoring` — list all monitoring for a placement
  - [ ] `POST   /api/v1/placements/{id}/monitoring` — add new monitoring entry
  - [ ] `PUT    /api/v1/placements/{id}/monitoring/{monId}` — update entry
  - [ ] `DELETE /api/v1/placements/{id}/monitoring/{monId}`
  - [ ] `POST   /api/v1/placements/{id}/monitoring/{monId}/complete` — mark completed
  - [ ] `GET    /api/v1/monitoring/pending` — all pending across system
  - [ ] `GET    /api/v1/monitoring/overdue` — overdue monitoring list
  - [ ] `GET    /api/v1/monitoring/dashboard` — stats for dashboard

### Angular
- [ ] `PlacementMonitoringListComponent` ← **mirrors the visible table on mlopdata.com**
  - [ ] Table columns: Monitor Date | Type | Status | Still In Placement | Changed Job | Salary | Note | Action
  - [ ] Status badge: Pending (amber) / Completed (green)
  - [ ] Add monitoring button → opens dialog
  - [ ] Inline action: Edit | Complete | Delete
- [ ] `AddMonitoringDialogComponent` ← **mirrors the visible modal on mlopdata.com**
  - [ ] Next Monitoring Date picker
  - [ ] Monitoring Type dropdown: 1st (1 month) → Final
  - [ ] Completed status radio: Pending / Completed
  - [ ] Salary input field
  - [ ] Still in Placement toggle: Yes / No / Changed Job
  - [ ] Progress Note textarea
  - [ ] Save + Close buttons
- [ ] `MonitoringCalendarComponent` — calendar view of due monitoring dates
- [ ] `OverdueMonitoringDashboardComponent` — alert panel for overdue items
- [ ] `MonitoringTimelineComponent` — visual progression: 1M → 2M → 3M … Final
- [ ] `PendingMonitoringListComponent` — system-wide view for supervisors
- [ ] `MonitoringExportComponent` — export filtered monitoring records to Excel/PDF

---

## Phase 10 — Health & Medical Module

### Backend
- [ ] **Commands:** AddHealthRecord, UpdateHealthRecord, AddVaccination, UpdateVaccination
- [ ] **Queries:** GetHealthRecords (by beneficiary), GetVaccinations, GetUpcomingVaccinations
- [ ] Background job: 7-day reminder for upcoming follow-up dates
- [ ] API Endpoints:
  - [ ] `GET/POST /api/v1/beneficiaries/{id}/health`
  - [ ] `PUT/DELETE /api/v1/health/{id}`
  - [ ] `GET/POST /api/v1/beneficiaries/{id}/vaccinations`
  - [ ] `GET /api/v1/health/upcoming-followups`

### Angular
- [ ] `HealthRecordListComponent` — per-beneficiary health history
- [ ] `AddHealthRecordFormComponent`
- [ ] `VaccinationTrackerComponent` — vaccination schedule grid
- [ ] `HealthAlertsBannerComponent` — upcoming follow-up dates

---

## Phase 11 — Attendance & Activity Module

### Backend
- [ ] **Commands:** CreateSession, RecordAttendance, BulkRecordAttendance, UpdateAttendance
- [ ] **Queries:** GetSessionsByProgram, GetAttendanceBySession, GetAttendanceSummaryByBeneficiary
- [ ] API Endpoints:
  - [ ] `GET/POST /api/v1/sessions`
  - [ ] `GET /api/v1/sessions/{id}/attendance`
  - [ ] `POST /api/v1/sessions/{id}/attendance` — bulk attendance entry
  - [ ] `GET /api/v1/beneficiaries/{id}/attendance` — attendance history
  - [ ] `GET /api/v1/attendance/summary` — attendance rate report

### Angular
- [ ] `SessionListComponent` — program sessions with attendance counts
- [ ] `AttendanceSheetComponent` — roster-style bulk attendance entry (Present/Absent/Late)
- [ ] `BeneficiaryAttendanceSummaryComponent` — attendance rate chart

---

## Phase 12 — Staff & Social Worker Module

### Backend
- [ ] **Commands:** CreateStaff, UpdateStaff, DeactivateStaff, AssignStaffToProgram
- [ ] **Queries:** GetStaff (paged), GetStaffById, GetStaffWorkload, GetMyAssignedBeneficiaries
- [ ] API Endpoints:
  - [ ] `GET/POST/PUT/DELETE /api/v1/staff`
  - [ ] `GET /api/v1/staff/{id}/beneficiaries` — assigned beneficiaries
  - [ ] `GET /api/v1/staff/{id}/workload` — caseload stats
  - [ ] `GET /api/v1/staff/me/beneficiaries` — for social worker self-view

### Angular
- [ ] `StaffListComponent` — staff directory with role badges
- [ ] `StaffProfileComponent` — profile + workload stats
- [ ] `StaffFormComponent` — create/edit (Admin only)
- [ ] `WorkloadDashboardComponent` — beneficiary count per worker chart

---

## Phase 13 — Donor & Funding Module

### Backend
- [ ] **Commands:** CreateDonor, UpdateDonor, AddFunding, UpdateFunding
- [ ] **Queries:** GetDonors, GetDonorById, GetFundingByDonor, GetActiveFunding
- [ ] API Endpoints:
  - [ ] `GET/POST/PUT/DELETE /api/v1/donors`
  - [ ] `GET/POST/PUT /api/v1/funding`
  - [ ] `GET /api/v1/funding/active`

### Angular
- [ ] `DonorListComponent` — donor directory
- [ ] `DonorFormComponent`
- [ ] `FundingTrackerComponent` — active funding periods per program

---

## Phase 14 — Reports & Dashboard Module

### Backend
- [ ] **Report Queries:**
  - [ ] `GetDashboardStatsQuery` — total beneficiaries, active placements, pending monitoring, open cases
  - [ ] `GetBeneficiaryCountByProgramQuery`
  - [ ] `GetBeneficiaryCountByGenderQuery`
  - [ ] GetBeneficiaryCountByAgeGroupQuery
  - [ ] `GetPlacementSuccessRateQuery` — % still in placement at each monitoring stage
  - [ ] `GetMonitoringCompletionRateQuery` — % monitoring completed on time
  - [ ] `GetCaseResolutionStatsQuery`
  - [ ] `GetEnrollmentStatsQuery`
  - [ ] `GetAttendanceRateQuery`

- [ ] **Export Services:**
  - [ ] `BeneficiaryListExcelExport` — ClosedXML
  - [ ] `PlacementReportExcelExport`
  - [ ] `MonitoringReportExcelExport`
  - [ ] `AttendanceReportExcelExport`
  - [ ] `BeneficiaryProfilePdfReport` — RDLC / QuestPDF
  - [ ] `PlacementCertificatePdf` — RDLC
  - [ ] `TrainingCertificatePdf` — RDLC

- [ ] **RDLC Report Files:**
  - [ ] `BeneficiaryProfile.rdlc` — individual profile printout
  - [ ] `PlacementMonitoringReport.rdlc` — monitoring history per placement
  - [ ] `ProgramEnrollmentReport.rdlc`
  - [ ] `StockSummaryReport.rdlc` (if inventory needed)
  - [ ] Set all RDLC files: `Copy to Output Directory = Always`

- [ ] **API Endpoints:**
  - [ ] `GET /api/v1/reports/dashboard`
  - [ ] `GET /api/v1/reports/beneficiaries/summary`
  - [ ] `GET /api/v1/reports/placements/summary`
  - [ ] `GET /api/v1/reports/monitoring/summary`
  - [ ] `GET /api/v1/reports/cases/summary`
  - [ ] `GET /api/v1/reports/export/beneficiaries` — Excel download
  - [ ] `GET /api/v1/reports/export/placements` — Excel download
  - [ ] `GET /api/v1/reports/export/monitoring` — Excel download
  - [ ] `GET /api/v1/reports/pdf/beneficiary/{id}` — PDF profile
  - [ ] `GET /api/v1/reports/pdf/placement/{id}` — PDF placement report
  - [ ] `GET /api/v1/reports/pdf/certificate/{enrollmentId}` — PDF certificate

### Angular
- [ ] `DashboardComponent` — main landing after login
  - [ ] KPI cards: Total Beneficiaries | Active Placements | Pending Monitoring | Open Cases
  - [ ] Bar chart: Beneficiaries by Program
  - [ ] Pie chart: Gender distribution
  - [ ] Line chart: New intakes per month
  - [ ] Alert panel: Overdue monitoring + upcoming follow-ups
  - [ ] My tasks panel (for social workers): pending monitoring, open cases
- [ ] `ReportListComponent` — report catalog (Admin/Manager only)
- [ ] `BeneficiaryReportComponent` — filter + preview + download
- [ ] `PlacementReportComponent` — filter + preview + download
- [ ] `MonitoringReportComponent` — filter + download
- [ ] `ReportFilterPanelComponent` — reusable date/program/staff filter
- [ ] `ExportButtonGroupComponent` — reusable PDF | Excel | Print buttons

---

## Phase 15 — Notifications & Alerts

### Backend
- [ ] `Notification` entity: UserId, Title, Message, Type, IsRead, Link, CreatedAt
- [ ] `INotificationService` → `NotificationService` (creates DB records)
- [ ] `IEmailService` → sends SMTP emails via MailKit
- [ ] SignalR hub: `NotificationHub` — push notifications to connected users
- [ ] Hangfire background jobs:
  - [ ] `DailyOverdueMonitoringCheckJob` — 08:00 daily
  - [ ] `DailyUpcomingMonitoringReminderJob` — 08:00 daily (3 days before due)
  - [ ] `DailyHealthFollowUpReminderJob` — 08:00 daily
  - [ ] `DailyVaccinationDueReminderJob` — weekly
  - [ ] `DailyOverdueCaseReminderJob` — daily
  - [ ] `MonthlyReportGenerationJob` — 1st of each month
- [ ] Notification triggers:
  - [ ] New beneficiary assigned → notify social worker
  - [ ] Monitoring due → notify assigned social worker
  - [ ] Case assigned → notify social worker
  - [ ] Monitoring overdue → notify supervisor
- [ ] API Endpoints:
  - [ ] `GET  /api/v1/notifications` — current user's notifications (paged)
  - [ ] `POST /api/v1/notifications/{id}/read` — mark as read
  - [ ] `POST /api/v1/notifications/read-all`
  - [ ] `GET  /api/v1/notifications/unread-count`

### Angular
- [ ] Implement `NotificationService` — connects to SignalR hub
- [ ] `NotificationBellComponent` — header icon with badge (unread count)
- [ ] `NotificationDropdownComponent` — last 10 notifications with read/unread
- [ ] `NotificationListComponent` — full notification history page
- [ ] Auto-refresh unread count every 30 seconds (fallback if SignalR disconnects)
- [ ] Toast notification on new push notification received

---

## Phase 16 — Angular Frontend

### Core Setup
- [ ] Configure `app.config.ts` with all providers
- [ ] Set up `HttpClient` with base URL interceptor
- [ ] Set up JWT auth interceptor (attach Bearer token)
- [ ] Set up 401 interceptor (auto-refresh or redirect to login)
- [ ] Set up error interceptor (global error toasts)
- [ ] Set up loading interceptor (show/hide spinner)
- [ ] Configure Angular Router with lazy-loaded modules
- [ ] Configure `ngx-translate` for Khmer / English language support
- [ ] Set up Angular Material theme with brand colors
- [ ] Set up PrimeNG theme

### Routing Structure
```
/login                           → AuthModule (public)
/forgot-password                 → AuthModule (public)
/dashboard                       → DashboardModule (protected)
/beneficiaries                   → BeneficiaryModule
/beneficiaries/:id               → BeneficiaryModule (profile)
/beneficiaries/:id/placement     → PlacementModule
/programs                        → ProgramModule
/training                        → TrainingModule
/placements                      → PlacementModule
/placements/:id                  → PlacementModule (detail)
/placements/:id/monitoring       → MonitoringModule ← key route
/monitoring/pending              → MonitoringModule (system-wide)
/cases                           → CaseModule
/health                          → HealthModule
/staff                           → StaffModule
/donors                          → DonorModule
/reports                         → ReportModule
/settings/users                  → SettingsModule
/settings/roles                  → SettingsModule
/settings/lookups                → SettingsModule
```

### Shared Components
- [ ] `AppShellComponent` — top navbar + left sidebar + content area
- [ ] `SidebarComponent` — collapsible nav with role-based menu items
- [ ] `BreadcrumbComponent`
- [ ] `SearchBarComponent` — global search (beneficiary by name/code)
- [ ] `DataTableComponent` — wrapper around PrimeNG Table with standard config
- [ ] `FilterPanelComponent` — collapsible filter sidebar
- [ ] `ConfirmDialogComponent` — reusable yes/no dialog
- [ ] `FileUploadComponent` — drag-drop file upload
- [ ] `ImageCropperComponent` — for profile photos
- [ ] `AddressPickerComponent` — Province → District → Commune → Village cascade
- [ ] `StatusBadgeComponent` — colored badge per status value
- [ ] `DateRangePickerComponent`
- [ ] `ExportButtonsComponent` — PDF | Excel | Print
- [ ] `EmptyStateComponent` — friendly "no data" placeholder
- [ ] `LoadingSkeletonComponent`
- [ ] `PaginationComponent`
- [ ] `PageHeaderComponent` — title + breadcrumb + action buttons

### State Management
- [ ] Use Angular Signals for component-level state
- [ ] Use `BehaviorSubject` in services for shared state (current user, notifications)
- [ ] Cache lookup data (provinces, programs, courses) in memory service
- [ ] Implement `LookupDataService` — loads and caches all dropdown data on startup

### Forms
- [ ] Implement `FormBase` class for consistent dirty-check + validation
- [ ] Create reusable `FormFieldComponent` wrapping label + input + validation
- [ ] Khmer language validation messages support

---

## Phase 17 — API Security & Performance

### Security
- [ ] Enable HTTPS + HSTS headers
- [ ] Configure security headers middleware (X-Frame-Options, CSP, etc.)
- [ ] Implement rate limiting:
  - [ ] Login endpoint: 5 attempts per 15 minutes per IP
  - [ ] Global: 200 req/min per user
- [ ] Configure CORS: whitelist Angular dev/prod origins only
- [ ] Enable SQL Server parameterized queries (EF Core — no raw SQL from user input)
- [ ] File upload validation: allowed extensions, max size (10MB), virus scan hook
- [ ] Implement `AuditLog` for all write operations (who changed what, when)
- [ ] Run `dotnet list package --vulnerable` in CI pipeline

### Performance
- [ ] Add Redis distributed cache for:
  - [ ] Lookup data (provinces, programs, courses) — TTL 1 hour
  - [ ] Dashboard stats — TTL 5 minutes
  - [ ] User permissions per JWT — TTL = token expiry
- [ ] EF Core: use `AsNoTracking()` on all read queries
- [ ] EF Core: use `Select()` projections — never return full entity to controller
- [ ] Add database indexes:
  - [ ] `Beneficiary.BeneficiaryCode` (unique)
  - [ ] `Beneficiary.PhoneNumber`
  - [ ] `PlacementMonitoring.PlacementId + MonitoringType`
  - [ ] `PlacementMonitoring.NextMonitoringDate`
  - [ ] `Notification.UserId + IsRead`
- [ ] Implement response pagination for all list endpoints (max 100 per page)
- [ ] Enable EF Core query logging in development

---

## Phase 18 — Deployment & DevOps

### Environment Configuration
- [ ] `appsettings.Development.json` — local dev settings
- [ ] `appsettings.Production.json` — production (no sensitive values)
- [ ] Use `dotnet user-secrets` for local dev secrets
- [ ] Use environment variables for production secrets (DB connection, JWT secret)
- [ ] Configure SQL Server connection string per environment

### Docker
- [ ] Create `Dockerfile` for API (multi-stage build)
- [ ] Create `Dockerfile` for Angular (nginx)
- [ ] Create `docker-compose.yml`:
  - [ ] `api` service (ASP.NET Core)
  - [ ] `ui` service (Angular + nginx)
  - [ ] `db` service (SQL Server 2022)
  - [ ] `redis` service
  - [ ] `hangfire-dashboard` (optional)
- [ ] Create `.dockerignore`
- [ ] Configure nginx for Angular: handle deep links (fallback to index.html)

### CI/CD
- [ ] Create GitHub Actions workflow (or Azure DevOps pipeline):
  - [ ] `dotnet build` + `dotnet test`
  - [ ] `ng build --configuration production`
  - [ ] `dotnet ef database update` (or migration script)
  - [ ] Docker build + push to registry
  - [ ] Deploy to staging → run smoke tests → deploy to production

### Database
- [ ] Configure EF Core migrations for production deployment
- [ ] Create seed data script: provinces, districts, communes, lookup values, admin user
- [ ] Set up automated SQL Server backups (daily)
- [ ] Configure SQL Server Always Encrypted for sensitive fields (salary, health notes)

### Monitoring
- [ ] Configure Serilog → file sink (rolling daily logs)
- [ ] Set up Seq or Application Insights for log aggregation
- [ ] Configure health checks: database, Redis, Hangfire
- [ ] Set up uptime monitoring (ping `/health` endpoint every 5 minutes)
- [ ] Configure Hangfire dashboard (Admin-only, protected route)

---

## Testing Checklist

### Backend Tests
- [ ] Unit tests for all Command Handlers (xUnit + Moq)
- [ ] Unit tests for all Query Handlers
- [ ] Unit tests for business rules (monitoring sequence, salary validation)
- [ ] Integration tests for all API endpoints (WebApplicationFactory)
- [ ] Test JWT auth flow: login, refresh, revoke
- [ ] Test permission enforcement per role

### Angular Tests
- [ ] Unit tests for `AuthService`, `NotificationService`, `LookupDataService`
- [ ] Component tests for `LoginComponent`, `BeneficiaryFormComponent`
- [ ] E2E tests (Cypress):
  - [ ] Login flow
  - [ ] Create beneficiary → enroll → place → monitor
  - [ ] Add monitoring record → mark complete
  - [ ] Export report

---

## Settings & Configuration Module

### Backend
- [ ] Lookup management endpoints (CRUD for all lookup tables):
  - [ ] `GET/POST/PUT/DELETE /api/v1/settings/provinces`
  - [ ] `GET/POST/PUT/DELETE /api/v1/settings/programs`
  - [ ] `GET/POST/PUT/DELETE /api/v1/settings/courses`
  - [ ] `GET/POST/PUT/DELETE /api/v1/settings/exit-reasons`
  - [ ] `GET/POST/PUT/DELETE /api/v1/settings/document-types`
  - [ ] `GET/POST/PUT/DELETE /api/v1/settings/roles`
  - [ ] `GET/POST/PUT/DELETE /api/v1/settings/roles/{id}/permissions`

### Angular
- [ ] `SettingsModule` (Admin only)
  - [ ] `UserManagementComponent` — user list + create/edit/deactivate
  - [ ] `RoleManagementComponent` — role list + permission matrix
  - [ ] `LookupManagementComponent` — manage all dropdown data
  - [ ] `SystemLogsComponent` — view audit logs
  - [ ] `BackupRestoreComponent` (optional)

---

## Localization
- [ ] Store all UI labels in `en.json` and `km.json` (Khmer)
- [ ] Implement language toggle in header (EN | ខ្មែរ)
- [ ] Store user language preference in `localStorage`
- [ ] Format dates as Khmer calendar where applicable
- [ ] Support Khmer font (Hanuman or Noto Sans Khmer) in CSS

---

## Quick Start Commands

```bash
# Backend
dotnet new sln -n MlopTapang
dotnet new webapi -n MlopTapang.API --framework net10.0
dotnet new classlib -n MlopTapang.Application
dotnet new classlib -n MlopTapang.Domain
dotnet new classlib -n MlopTapang.Infrastructure

dotnet add MlopTapang.API/MlopTapang.API.csproj package ReportViewerCore.NETCore
dotnet add MlopTapang.Infrastructure/MlopTapang.Infrastructure.csproj package Microsoft.EntityFrameworkCore.SqlServer
dotnet add MlopTapang.API/MlopTapang.API.csproj package MediatR
dotnet add MlopTapang.API/MlopTapang.API.csproj package FluentValidation.AspNetCore

dotnet ef migrations add InitialSchema --project MlopTapang.Infrastructure --startup-project MlopTapang.API
dotnet ef database update --project MlopTapang.Infrastructure --startup-project MlopTapang.API

# Frontend
ng new mlop-tapang-ui --standalone --style=scss --routing
cd mlop-tapang-ui
npm install @angular/material @angular/cdk primeng chart.js ng2-charts @microsoft/signalr ngx-translate file-saver ngx-spinner

# Docker
docker-compose up -d

# Run all
dotnet run --project MlopTapang.API
ng serve --proxy-config proxy.config.json
```

---

*© M'Lop Tapang NGO Management System Blueprint*
*Stack: ASP.NET Core 10 · Angular 17+ · SQL Server · Redis · Hangfire · SignalR*