# Implementation Plan: CQRS Refactoring for mtp-auth-service

## Goal Description
The objective is to refactor the `mtp-auth-service` to use the Command Query Responsibility Segregation (CQRS) architectural pattern. This pattern separates operations that mutate state (Commands) from operations that return data (Queries).

**Updates based on your feedback:**
1. **SOLID Principles:** This new architecture strictly enforces all 5 SOLID principles by design (detailed below).
2. **Data Transfer Objects (DTOs):** We will strictly decouple our internal database models from the API responses.
3. **Time and Space Complexity Monitoring:** We will implement an Aspect-Oriented Programming (AOP) interceptor to track execution time and memory usage.

As part of this refactoring, we will also incorporate critical security fixes identified previously.

## User Review Required

> [!TIP]
> **Achieving SOLID Design via CQRS**
> By moving to CQRS, we naturally achieve 100% compliance with SOLID principles:
> 1. **(S) Single Responsibility Principle:** Instead of a massive 1000-line `AuthService`, each feature gets its own file (e.g., `LoginCommandHandler`). It only has one job.
> 2. **(O) Open/Closed Principle:** When you need a new feature (e.g., "Reset Password"), you simply add a new Command and Handler. You don't have to modify any existing code!
> 3. **(L) Liskov Substitution Principle:** All handlers will implement standard base interfaces.
> 4. **(I) Interface Segregation Principle:** Controllers will only depend on the specific Command/Query interfaces they need, rather than importing a massive service interface.
> 5. **(D) Dependency Inversion Principle:** Controllers will depend purely on abstractions (the `CommandHandler` and `QueryHandler` interfaces), making the system highly testable and loosely coupled.

## Proposed Changes

### 1. CQRS Core Interfaces
Create base interfaces to standardize the architecture.
#### [NEW] `src/main/java/com/mtp/auth/cqrs/Command.java`
#### [NEW] `src/main/java/com/mtp/auth/cqrs/CommandHandler.java`
#### [NEW] `src/main/java/com/mtp/auth/cqrs/Query.java`
#### [NEW] `src/main/java/com/mtp/auth/cqrs/QueryHandler.java`

### 2. Data Transfer Objects (DTOs)
Strict separation of API payloads from Database Models.
#### [NEW] `src/main/java/com/mtp/auth/dtos/requests/LoginRequestDto.java`
#### [NEW] `src/main/java/com/mtp/auth/dtos/requests/RefreshTokenRequestDto.java`
#### [NEW] `src/main/java/com/mtp/auth/dtos/responses/AuthResponseDto.java`
#### [NEW] `src/main/java/com/mtp/auth/dtos/responses/UserResponseDto.java`
- *Security Fix:* This DTO will only contain safe, non-sensitive user data.

### 3. Performance Monitoring (Time & Space Complexity)
#### [NEW] `src/main/java/com/mtp/auth/aspects/PerformanceMonitoringAspect.java`
- An AOP `@Aspect` that wraps around `*CommandHandler.handle(..)` and `*QueryHandler.handle(..)`.
- Uses `System.currentTimeMillis()` and `Runtime.getRuntime().freeMemory()` to calculate and log the exact computational cost of every request.

### 4. Commands (Mutations & Authentication)
Move the login and refresh token logic into dedicated command handlers.
#### [NEW] `src/main/java/com/mtp/auth/commands/LoginCommand.java`
#### [NEW] `src/main/java/com/mtp/auth/commands/handlers/LoginCommandHandler.java`
- *Security Fix:* Will strictly use password hashing; the legacy plain-text fallback will be removed.
#### [NEW] `src/main/java/com/mtp/auth/commands/RefreshTokenCommand.java`
#### [NEW] `src/main/java/com/mtp/auth/commands/handlers/RefreshTokenCommandHandler.java`

### 5. Queries (Data Retrieval)
Move data fetching logic into dedicated query handlers.
#### [NEW] `src/main/java/com/mtp/auth/queries/GetUsersQuery.java`
#### [NEW] `src/main/java/com/mtp/auth/queries/handlers/GetUsersQueryHandler.java`
- Returns a `List<UserResponseDto>` instead of raw entities.

### 6. Controllers
Split the monolithic `AuthController` into strictly segregated controllers.
#### [NEW] `src/main/java/com/mtp/auth/controllers/AuthCommandController.java`
- Handles `@PostMapping("/login")` and `@PostMapping("/refresh")`.
#### [NEW] `src/main/java/com/mtp/auth/controllers/AuthQueryController.java`
- Handles `@GetMapping("/users")`.
#### [DELETE] `src/main/java/com/mtp/auth/controllers/AuthController.java`

### 7. Security & Configuration Updates
#### [MODIFY] `src/main/java/com/mtp/auth/config/SecurityConfig.java`
- Apply strict security rules. `AuthCommandController` endpoints will be `permitAll()`, while `AuthQueryController` endpoints will require authentication.
#### [MODIFY] `src/main/java/com/mtp/auth/security/JwtUtils.java`
- Change JWT expiration to 1 hour instead of 30 days.

## Verification Plan

### Automated Tests
- Run Gradle `bootRun` on `mtp-auth-service` to ensure the new architecture and AOP components compile.

### Manual Verification
- Test the Login Command via REST API to ensure tokens are issued and plain-text passwords are not saved.
- Check the application console logs during login to verify the `PerformanceMonitoringAspect` correctly outputs the **Time** and **Space Complexity** metrics.
- Test the Get Users Query to ensure it returns clean `UserResponseDto` objects instead of database entities.
