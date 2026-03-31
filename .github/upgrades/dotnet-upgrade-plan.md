# .NET 8.0 Upgrade Plan

## Execution Steps

Execute steps below sequentially one by one in the order they are listed.

1. Validate that an .NET 8.0 SDK required for this upgrade is installed on the machine and if not, help to get it installed.
2. Ensure that the SDK version specified in global.json files is compatible with the .NET 8.0 upgrade.
3. Upgrade MtpApp.csproj
4. Run unit tests to validate upgrade in the projects listed below:


## Settings

### Excluded projects

| Project name                                   | Description                 |
|:-----------------------------------------------|:---------------------------:|


### Aggregate NuGet packages modifications across all projects

| Package Name                        | Current Version | New Version | Description                                   |
|:------------------------------------|:---------------:|:-----------:|:----------------------------------------------|
| Antlr                               | 3.4.1.9004      | Antlr4 4.6.6| Replace with Antlr4 4.6.6                      |
| AutoMapper                          | 4.1.0          | 16.1.1      | Update to supported version                    |
| AspNetCore.SignalR.Client           |                | 8.0.25      | Replacement for Microsoft.AspNet.SignalR.Core  |
| bootstrap                           | 3.0.0          | 5.3.8       | Security update                                |
| EntityFramework                     | 6.4.4          | 6.5.1       | Replace with newer EF 6.x                      |
| jQuery                              | 1.10.2         | 3.7.1       | Security update                                |
| jQuery.Validation                   | 1.11.1         | 1.21.0      | Security update                                |
| Microsoft.SqlServer.Types           | 11.0.0         | 170.1000.7  | Update to supported version                    |
| Moment.js                           | 2.22.2         | 2.30.1      | Security update; move to npm if needed         |
| Newtonsoft.Json                     | 6.0.4          | 13.0.4      | Update to supported version                    |
| Microsoft.AspNet.Mvc                | 5.2.3          |             | Functionality included in framework reference  |
| Microsoft.AspNet.Razor              | 3.2.3          |             | Functionality included in framework reference  |
| Microsoft.AspNet.WebApi             | 5.2.9          |             | Functionality included in framework reference  |
| Microsoft.AspNet.WebPages           | 3.2.3          |             | Functionality included in framework reference  |
| Microsoft.Web.Infrastructure        | 1.0.0.0        |             | Functionality included in framework reference  |
| Microsoft.AspNet.Web.Optimization  | 1.1.3           | LigerShark.WebOptimizer.Core 3.0.477 | Replace with WebOptimizer Core |
| Microsoft.AspNet.SignalR.Core       | 2.4.1          | Microsoft.AspNetCore.SignalR.Client 8.0.25 | Replace with AspNetCore SignalR client |
| Microsoft.Owin.* packages           | 2.1.0          |             | Deprecated; replace with ASP.NET Core native middleware |
| Microsoft.AspNet.Identity.* packages| 2.0.0          |             | Migrate to ASP.NET Core Identity               |
| Microsoft.Report.Viewer              | 11.0.0.0       |             | No supported package; consider alternative     |
| ReportViewerForMvc                  | 1.1.1          |             | No supported package; consider alternative     |


### Project upgrade details

#### MtpApp.csproj modifications

Project properties changes:
  - Target framework should be changed from `net48` to `net8.0`
  - Convert project file to SDK-style format

NuGet packages changes:
  - Update `AutoMapper` from `4.1.0` to `16.1.1`.
  - Replace `Microsoft.AspNet.SignalR.Core` with `Microsoft.AspNetCore.SignalR.Client`.
  - Replace or update `EntityFramework` to `6.5.1`.
  - Update `Newtonsoft.Json` to `13.0.4`.
  - Update `Microsoft.SqlServer.Types` to `170.1000.7`.
  - Replace `Microsoft.AspNet.Web.Optimization` with `LigerShark.WebOptimizer.Core`.
  - Replace or remove deprecated `Microsoft.Owin.*` packages and migrate OWIN middleware to ASP.NET Core middleware.
  - Replace `Moment.js`, `bootstrap`, `jQuery`, and `jQuery.Validation` with modern versions (or move to npm/yarn).

Feature upgrades:
  - System.Web.Optimization bundling and minification -> replace with static tags or WebOptimizer Core.
  - Migrate RouteCollection routes to endpoints mapping in Program.cs.
  - Convert GlobalFilterCollection usage to middleware pipeline registrations.
  - Convert ASP.NET Identity to ASP.NET Core Identity.
  - Convert OWIN startup to Program.cs-based configuration and middleware.
  - Move Global.asax initialization logic to Program.cs and remove Global.asax.

Other changes:
  - Replace ReportViewer usage with supported reporting solution or external service.
  - Review code for usages of System.Web.* APIs and replace with ASP.NET Core equivalents.

