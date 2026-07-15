# MTP RBAC & Admin Control System Logic

This document outlines the core logic, algorithms, and data flows for the Role-Based Access Control (RBAC) system in the MTP Microservices Ecosystem. This knowledge base is designed to provide instructions and context for AI chatbots or developers maintaining the system.

## 1. Core Data Model & Relationships

The admin control system operates on a standard 3-tier RBAC architecture utilizing a many-to-many relationship structure in the database:

*   **`User` Entity (`AspNetUsers`)**: Represents a human or system account. It holds credentials (password hashes) and profile data.
*   **`Role` Entity (`AspNetRoles`)**: Represents a job function or authority tier (e.g., `SUPERADMIN`, `REPORTS_VIEWER`).
*   **`Permission` Entity (`AspNetPermissions`)**: Represents a granular right to perform an action on a specific resource.
    *   **Resource**: The domain area (e.g., `USERS`, `INVENTORY`, `REPORTS`).
    *   **Action**: The CRUD operation (e.g., `READ`, `CREATE`, `UPDATE`, `DELETE`).
    *   **Permission Name**: Formatted systematically as `{RESOURCE}_{ACTION}` (e.g., `USERS_CREATE`).

**Relationship Mapping:**
*   **User ↔ Role** is mapped via a join table `AspNetUserRoles`. A user can have multiple roles.
*   **Role ↔ Permission** is mapped via a join table `AspNetRolePermissions`. A role can have multiple permissions.

---

## 2. Backend Security Algorithm (`mtp-auth-service`)

The backend translates the relational database model into Spring Security context during authentication.

### The `UserPrincipal` Flattening Algorithm
When a user logs in and the JWT token is verified, the system constructs a `UserPrincipal` object. The core algorithm flattens the nested permissions into a single collection of `GrantedAuthority` strings:

1.  **Map Roles to Authorities**: It iterates through the user's `Roles` and adds them as authorities with a `ROLE_` prefix (e.g., `ROLE_SUPERADMIN`).
2.  **Flatten Permissions**: It iterates through every `Permission` attached to every `Role` the user holds, and adds the raw permission name as a string authority (e.g., `USERS_CREATE`, `INVENTORY_READ`).
3.  **Endpoint Protection**: Spring Boot API endpoints are then protected using annotations like `@PreAuthorize("hasAuthority('INVENTORY_DELETE')")`. If the user's flattened authority list contains that string, access is granted.

---

## 3. Frontend Admin Control Logic (`react-frontend`)

The frontend application (`src/features/admin/components`) contains the management UI for manipulating these entities.

### A. Role & Permission Management (`RoleManagement.tsx`)
This interface is restricted to users with `ADMIN` or `SUPERADMIN` roles.

*   **Permission Creation Algorithm**:
    1. The admin selects a `Resource` (e.g., `FINANCE`) and one or more `Actions` (e.g., `READ`, `EXPORT`).
    2. The UI loops through the selected actions and sends multiple concurrent `POST /admin/permissions` requests to the backend.
    3. The backend validates if a permission named `FINANCE_READ` already exists (throwing a 400 error if it does) or creates it.
*   **Role-Permission Assignment**:
    1. The admin edits a Role (e.g., `CASHIER`).
    2. The UI fetches all available permissions and renders them as a grid of checkboxes.
    3. Upon saving, the UI sends a `PUT /admin/roles/{roleId}/permissions` request containing an array of permission names. The backend overwrites the previous assignments with this new array.

### B. User Assignment & Settings (`UserManagement.tsx`)
This interface governs user provisioning and lifecycle management.

*   **Role Assignment Algorithm**:
    1. The admin edits a User and opens the "Security Roles" modal.
    2. The UI tracks an array of selected role names.
    3. Upon submission, it calls `PUT /admin/users/{userId}/roles`.
    4. **Backend Flow**: The `mtp-auth-service` clears all existing entries for that user in `AspNetUserRoles` and inserts new records based on the array provided.
*   **Password Resets**:
    1. Admins bypass the standard "forgot password" email flow.
    2. The UI calls `POST /admin/users/{userId}/reset-password` with a new plaintext password.
    3. The backend hashes the password using `BCryptPasswordEncoder` and overwrites the user's current hash in the database.
*   **Account Status Toggle**:
    1. Admins can suspend or activate users via `PATCH /admin/users/{id}/toggle-status`.
    2. Suspended users will fail the `isEnabled()` check in `UserPrincipal`, automatically rejecting their active JWT tokens on subsequent requests.

---

## 4. Chatbot Instructional Guide

If an AI or Chatbot needs to reason about access control, follow these logical steps:

1.  **Diagnosing "403 Forbidden" Errors**:
    *   *Check 1*: Does the user have a Role assigned?
    *   *Check 2*: Does that Role have the specific `{RESOURCE}_{ACTION}` permission mapped to it?
    *   *Check 3*: Did the user re-login? (JWT tokens bake in authorities at the time of login; if roles change, the user must re-authenticate to refresh the token).
2.  **Creating a New Access Tier**:
    *   *Step 1*: Create the necessary `Permissions` if they don't exist (e.g., `AUDIT_READ`).
    *   *Step 2*: Create a new `Role` (e.g., `AUDITOR`).
    *   *Step 3*: Map the `Permissions` to the `Role`.
    *   *Step 4*: Map the `Role` to the `User`.
3.  **UI Column Visibility**:
    *   Note that the frontend table columns in `UserManagement.tsx` conditionally render based on the viewer's role. Only `SUPERADMIN` can view the "Credentials" column.

---

## 5. Third-Party Login (OAuth2) Handling Algorithm

Currently, the MTP architecture uses localized JWT authentication (Username/Password). If you plan to implement Third-Party Sign-In (e.g., Google, Facebook, Apple), you must seamlessly integrate it into the existing RBAC data model.

### Recommended Integration Logic:

1. **Token Exchange (Frontend to Backend)**:
   * The React frontend authenticates the user with the third-party provider and receives an OAuth `ID Token`.
   * The frontend sends this token to a new backend endpoint: `POST /api/auth/oauth/google`.
2. **Backend Validation & Auto-Provisioning (`mtp-auth-service`)**:
   * The backend cryptographically validates the `ID Token` with the provider (e.g., Google).
   * It extracts the user's `email`, `firstName`, and `lastName`.
   * **Lookup**: It queries `AspNetUsers` by email.
   * **Provisioning (If New User)**: If the email doesn't exist, the backend auto-creates a new `User` record. It assigns a highly restricted default role (e.g., `ROLE_GUEST`) by creating a record in `AspNetUserRoles`. No password hash is needed (or a random secure string is used).
3. **RBAC Merging (The Handshake)**:
   * Once the user is fetched or created, the backend passes the `User` object into the exact same `UserPrincipal` algorithm described in Section 2.
   * A localized MTP JWT is generated, containing the flattened authorities (e.g., `ROLE_GUEST`, `DASHBOARD_READ`).
   * The frontend stores this MTP JWT, completely discarding the Google/Facebook token for future requests.
4. **Admin Control**:
   * These third-party users will appear normally in `UserManagement.tsx`. 
   * A `SUPERADMIN` can click "Roles" to upgrade them from `GUEST` to `ADMIN` just like standard users.
   * *Limitation*: The admin "Password Reset" function will not apply to them unless you implement a "Link Local Account" feature.
