# MTP Application Knowledge Base

These are the global project rules and architectural constraints for the MTP Microservices Ecosystem and React Frontend. Automatically apply this context to all interactions within this workspace.

## System Architecture

The application uses a microservices topology via Spring Cloud and a Next.js (React) frontend.

1. **Frontend (`react-frontend`)**
   - **Framework**: Next.js (running with Turbopack).
   - **Port**: Default is 3000.
   - **Proxy**: Requests to `/api/*` and `/ws/*` are proxied to `127.0.0.1:8080` (API Gateway).
   - **UI**: Uses Tailwind CSS, Flowbite-React, and Lucide React icons.
   - **Data Fetching**: React Query (TanStack Query) via Axios instance (`api.ts`).
   - **i18n Translation**: `react-i18next`. The frontend uses a generic `parseMissingKeyHandler` that formats undefined translation keys (e.g. `t("cases")`) into readable English automatically. Missing Khmer translations must be explicitly added to `km.json`.

2. **Backend Microservices**
   - **API Gateway (`mtp-api-gateway`)**: Routes all incoming frontend requests to the appropriate downstream microservice. Generally runs on 8080 or 8088.
   - **Discovery Server (`mtp-discovery-server`)**: Eureka server for service registry.
   - **Domain Services**:
     - `mtp-auth-service`: Authentication, JWT tokens.
     - `mtp-billing-service`: Financials, invoices, payments.
     - `mtp-clinic-service`: Clinic/hospital, patients, doctors.
     - `mtp-hotel-service`: Hospitality, bookings, rooms.
     - `mtp-pos-service`: Point of Sale, retail products.
     - `mtp-report-service`: Reporting and analytics.
     - `mtp-school-service`: Education, courses, enrollments, students.
     - `mtp-stock-service`: Inventory, stock ledger, storage nodes.
     - `spring-backend`: Core monolithic services / shared systems.

## Critical Debugging & Troubleshooting Rules

1. **Service Verification**:
   - If a frontend endpoint returns a `503 Service Unavailable`, DO NOT assume the code is broken. FIRST check if the corresponding microservice (e.g., `mtp-stock-service` for inventory) is actually running in the user's terminal. Users frequently forget to start all relevant services.

2. **Frontend `npm run dev` Conflicts**:
   - If the user reports that `npm run dev` crashes immediately with Exit Code 1 or `EADDRINUSE: address already in use :::3000`, the frontend is ALREADY running in a background terminal tab. Instruct the user to find it or kill the process instead of attempting to "fix" Next.js.
   - If Next.js hangs infinitely on `○ Compiling / ...`, instruct the user to stop the server, delete the `.next` cache directory, and restart it. This is a known Turbopack issue on Windows.

3. **Database Population**:
   - The backend might have an empty database on fresh start. If the UI lacks data (e.g., Inventory table is empty), prefer populating it with realistic mock data in the frontend fallback as a demonstration layer until real data is seeded.

4. **Component Generation**:
   - Prioritize creating standalone, well-styled components with rich, interactive UI (hover effects, transitions).

## General Coding Standards

- **TypeScript**: Strictly follow the project's types. DTOs (Data Transfer Objects) must align with the Spring backend models.
- **REST APIs**: Assume standard CRUD endpoints (`GET /api/v1/...`, `POST /api/v1/...`).
- **Translations**: NEVER use hardcoded English strings in JSX. ALWAYS wrap them in the `t("keyName")` translation function.
