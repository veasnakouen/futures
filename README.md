<!-- PROJECT SHIELDS -->
<p align="center">
</p>
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <img width="1497" alt="Screenshot 2023-01-30 at 11 32 38 PM" src="https://user-images.githubusercontent.com/31751665/215537226-6971b21f-22b8-4582-9988-13123530edf3.png">
  <h3 align="center">Future Management System (MT Internal Use)</h3>
</p>

## About The Project :zap:

Future Management System for M'Lop Tapang Organization — manages client intake, job placement,
social support case management, training programs, employer/vacancy management, and monitoring dashboards.

### Tech Stack :muscle:

- **ASP.NET Core 8.0** (MVC + Web API)
- **.NET 8.0**
- **Entity Framework Core 8.0.25** (SQL Server)
- **ASP.NET Core Identity** (Authentication & Authorization)
- **AutoMapper** (Object mapping)
- **SignalR** (Real-time notifications)
- **jQuery 3.7.1, Bootstrap 5, DataTables, Chart.js** (Frontend)
- **SQL Server** (Database)

# Upcoming Release 1.1.0
- [x] Security hardening (file upload validation, CSRF protection, input validation)
- [x] Global query filters for soft-deleted entities
- [x] Structured error handling
- [x] Migrated from System.Data.SqlClient to Microsoft.Data.SqlClient
- [x] Extracted inline JavaScript to external files
- [x] Role-based authorization policies
- [ ] Implement reporting solution for .NET 8
- [ ] Squash EF migrations into single initial migration
- [ ] Add integration tests

# Version 1.0.0
- [x] Released project in 2021
- [x] Migrated from ASP.NET MVC 5 (.NET Framework 4.8) to ASP.NET Core 8.0

## Getting Started

1. Restore NuGet packages: `dotnet restore`
2. Update database: `dotnet ef database update`
3. Run the app: `dotnet run`
4. Open `https://localhost:7140` in your browser

## Configuration

Connection string is configured in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=MtpAppDB;Integrated Security=True"
  }
}
```
