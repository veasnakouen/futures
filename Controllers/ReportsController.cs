using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;
using MtpApp.Infrastructure;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace MtpApp.Controllers
{
    [AllowAnonymous]
    public class ReportsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly LegacyReportService _legacyReportService;

        private static readonly Dictionary<string, string> RdlcMapping = new(StringComparer.OrdinalIgnoreCase)
        {
            ["ClientSummaryReport"] = "ClientSummaryReport.rdlc",
            ["EmploymentSeekerListReport"] = "EmployeeSeekerListreport.rdlc",
            ["PlacementSummaryReport"] = "PlacementSummaryReport.rdlc",
            ["ClientsRemainingInPlacementReport"] = "ClientsRemainingInPlacementReport.rdlc",
            ["JobReadinessReport"] = "JobReadinessReport.rdlc",
            ["EmployersReport"] = "EmployersReport.rdlc",
            ["VancancysReport"] = "JobVancancyAvailable.rdlc",
            ["FurtherEuducationSeekerListReport"] = "FurtherEuducationseekerListReport.rdlc",
            ["PlacementMonitoringAndDropoutReport"] = "PlacementMonitoringAndDropoutReport.rdlc",
            ["beneficiariesReport"] = "BeneficiariesReport.rdlc",
            ["clientReferralFromMTProgramReport"] = "ClientReferralFromMTProgramReport.rdlc",
            ["LogBooksReport"] = "LogBookReport.rdlc",
            ["CaseManagerReport"] = "SocialSupportCaseReport.rdlc",
            ["SocialSupportCaseReport"] = "SocialSupportCaseReport.rdlc",
            ["BusinessSetupReport"] = "BusinessSetUpReport.rdlc",
            ["BusinessSetupMonitoringReport"] = "Businesssetupmonitoiring.rdlc",
            ["BusinessSetupMonitoriingReport"] = "Businesssetupmonitoiring.rdlc",
            ["VTCstudentreport"] = "VtcStudentlReport.rdlc",
            ["ClientLookforbussinesssSetupReport"] = "ClientLookforbussinesssSetupReport.rdlc"
        };

        public ReportsController(ApplicationDbContext context, LegacyReportService legacyReportService)
        {
            _context = context;
            _legacyReportService = legacyReportService;
        }

        // Serve the React Viewer embedded in the main layout
        [HttpGet]
        public IActionResult Viewer()
        {
            return View();
        }

        // 1. Endpoint for all standard Table Reports
        public IActionResult DownloadReport(string reportName, string format = "pdf")
        {
            if (string.IsNullOrWhiteSpace(reportName))
            {
                return BadRequest("Report name is required.");
            }

            if (!RdlcMapping.TryGetValue(reportName, out var rdlcFile))
            {
                return NotFound($"No RDLC mapping found for report: {reportName}");
            }

            var routeValues = Request.Query.ToDictionary(k => k.Key, v => (string?)v.Value.ToString());

            var dataTable = _legacyReportService.GetReportDataTable(reportName, routeValues);
            if (dataTable == null)
            {
                return NotFound($"Could not load data for report: {reportName}");
            }

            // Custom CSV Generator (Bypassing RDLC)
            if (format.Equals("csv", StringComparison.OrdinalIgnoreCase))
            {
                var sb = new StringBuilder();
                
                // Headers
                var columnNames = dataTable.Columns.Cast<System.Data.DataColumn>().Select(c => c.ColumnName);
                sb.AppendLine(string.Join(",", columnNames.Select(EscapeCsv)));

                // Rows
                foreach (System.Data.DataRow row in dataTable.Rows)
                {
                    var fields = row.ItemArray.Select(field => EscapeCsv(field?.ToString() ?? ""));
                    sb.AppendLine(string.Join(",", fields));
                }

                var csvBytes = Encoding.UTF8.GetBytes(sb.ToString());
                // Add BOM for Excel compatibility
                var bom = Encoding.UTF8.GetPreamble();
                var resultBytes = new byte[bom.Length + csvBytes.Length];
                Buffer.BlockCopy(bom, 0, resultBytes, 0, bom.Length);
                Buffer.BlockCopy(csvBytes, 0, resultBytes, bom.Length, csvBytes.Length);

                return File(resultBytes, "text/csv", $"{reportName}.csv");
            }

            var assembly = Assembly.GetExecutingAssembly();
            using var reportStream = assembly.GetManifestResourceStream($"MtpApp.Reports.{rdlcFile}");
            
            if (reportStream == null)
            {
                return NotFound($"Report definition not found: {rdlcFile}");
            }

            using var localReport = new LocalReport();
            localReport.LoadReportDefinition(reportStream);
            
            localReport.DataSources.Add(new ReportDataSource("DataSet1", dataTable));

            var startDate = routeValues.GetValueOrDefault("startdate") ?? "N/A";
            var endDate = routeValues.GetValueOrDefault("enddate") ?? "N/A";
            
            try
            {
                localReport.SetParameters(new[] { 
                    new ReportParameter("StartDate", startDate),
                    new ReportParameter("EndDate", endDate)
                });
            }
            catch { }

            string renderFormat = "PDF";
            string mimeType = "application/pdf";
            string extension = "pdf";

            if (format.Equals("excel", StringComparison.OrdinalIgnoreCase))
            {
                renderFormat = "EXCELOPENXML";
                mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                extension = "xlsx";
            }
            else if (format.Equals("word", StringComparison.OrdinalIgnoreCase))
            {
                renderFormat = "WORDOPENXML";
                mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                extension = "docx";
            }

            byte[] fileBytes = localReport.Render(renderFormat);
            return File(fileBytes, mimeType, $"{reportName}.{extension}");
        }

        private static string EscapeCsv(string field)
        {
            if (field.Contains(",") || field.Contains("\"") || field.Contains("\n") || field.Contains("\r"))
            {
                return $"\"{field.Replace("\"", "\"\"")}\"";
            }
            return field;
        }

        [HttpGet]
        public IActionResult GetReportPage(string reportName, int page = 1, int recordsPerPage = 0, string paperSize = "A4")
        {
            if (string.IsNullOrWhiteSpace(reportName))
                return BadRequest("Report name is required.");

            if (!RdlcMapping.TryGetValue(reportName, out var rdlcFile))
                return NotFound($"No RDLC mapping found for report: {reportName}");

            var routeValues = Request.Query.ToDictionary(k => k.Key, v => (string?)v.Value.ToString());

            var dataTable = _legacyReportService.GetReportDataTable(reportName, routeValues);
            if (dataTable == null)
                return NotFound($"Could not load data for report: {reportName}");

            int totalDataPages = 1;
            int currentPage = page;

            if (recordsPerPage > 0)
            {
                totalDataPages = (int)Math.Ceiling(dataTable.Rows.Count / (double)recordsPerPage);
                if (totalDataPages == 0) totalDataPages = 1;
                if (currentPage > totalDataPages) currentPage = totalDataPages;

                var pagedTable = dataTable.Clone();
                int skip = (currentPage - 1) * recordsPerPage;
                for (int i = skip; i < skip + recordsPerPage && i < dataTable.Rows.Count; i++)
                {
                    pagedTable.ImportRow(dataTable.Rows[i]);
                }
                dataTable = pagedTable;
            }

            var assembly = Assembly.GetExecutingAssembly();
            using var reportStream = assembly.GetManifestResourceStream($"MtpApp.Reports.{rdlcFile}");
            
            if (reportStream == null)
                return NotFound($"Report definition not found: {rdlcFile}");

            using var localReport = new LocalReport();
            localReport.LoadReportDefinition(reportStream);
            localReport.DataSources.Add(new ReportDataSource("DataSet1", dataTable));

            var startDate = routeValues.GetValueOrDefault("startdate") ?? "N/A";
            var endDate = routeValues.GetValueOrDefault("enddate") ?? "N/A";
            
            try
            {
                localReport.SetParameters(new[] { 
                    new ReportParameter("StartDate", startDate),
                    new ReportParameter("EndDate", endDate)
                });
            }
            catch { }

            string pageWidth = "8.27in";
            string pageHeight = "11.69in";
            
            if (paperSize.Equals("Letter", StringComparison.OrdinalIgnoreCase))
            {
                pageWidth = "8.5in";
                pageHeight = "11in";
            }
            else if (paperSize.Equals("Legal", StringComparison.OrdinalIgnoreCase))
            {
                pageWidth = "8.5in";
                pageHeight = "14in";
            }
            else if (paperSize.Equals("A3", StringComparison.OrdinalIgnoreCase))
            {
                pageWidth = "11.69in";
                pageHeight = "16.54in";
            }

            int totalPhysicalPages = 1;
            try
            {
                string infoForTotal = $"<DeviceInfo><OutputFormat>PNG</OutputFormat></DeviceInfo>";
                localReport.Render("IMAGE", infoForTotal);
                totalPhysicalPages = Math.Max(1, localReport.GetTotalPages());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            var imagesBase64 = new List<string>();

            int startPhysical = (recordsPerPage > 0) ? 1 : 1;
            int endPhysical = (recordsPerPage > 0) ? totalPhysicalPages : totalPhysicalPages;

            if (recordsPerPage > 0)
            {
                startPhysical = 1; // For paged data, we render the current data page's physical pages (usually 1)
                endPhysical = totalPhysicalPages;
            }

            for (int i = startPhysical; i <= endPhysical; i++)
            {
                string deviceInfo = $"<DeviceInfo><OutputFormat>PNG</OutputFormat><StartPage>{i}</StartPage><EndPage>{i}</EndPage><PageWidth>{pageWidth}</PageWidth><PageHeight>{pageHeight}</PageHeight></DeviceInfo>";
                byte[] imageBytes = localReport.Render("IMAGE", deviceInfo);
                imagesBase64.Add(Convert.ToBase64String(imageBytes));
            }
            
            return Json(new
            {
                CurrentPage = currentPage,
                TotalPages  = totalDataPages,
                ImagesBase64 = imagesBase64,
            });
        }

        // 2. Endpoint for Curriculum Vitae
        public IActionResult DownloadCurriculumVitae(int clientId, string reportName = "CurriculumVitaeByClientReport")
        {
            var client = _context.Clients.AsNoTracking().IgnoreQueryFilters().FirstOrDefault(item => item.Id == clientId);
            if (client == null)
            {
                return NotFound($"Client #{clientId} was not found.");
            }

            // We need a list containing exactly the one client for DataSet1
            var clientList = new List<Client> { client };

            var educations = _context.Educations.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var languages = _context.Languages.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var skills = _context.ComputerSkills.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            // Needs JobPositions include
            var jobExperiences = _context.JobExperiences.AsNoTracking()
                .Include(item => item.JobPositions)
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();
            
            // For Reference, include JobPositions
            var references = _context.CvReferenceS.AsNoTracking()
                .Include(item => item.JobPositions)
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            // Choose the correct RDLC (there's also CurriculumVitaeByClientReportApplyfor.rdlc)
            var rdlcFile = "CurriculumVitaeByClientReport.rdlc";
            if (reportName.Contains("ApplyFor", StringComparison.OrdinalIgnoreCase))
            {
                rdlcFile = "CurriculumVitaeByClientReportApplyfor.rdlc";
            }

            var assembly = Assembly.GetExecutingAssembly();
            using var reportStream = assembly.GetManifestResourceStream($"MtpApp.Reports.{rdlcFile}");
            
            if (reportStream == null)
            {
                return NotFound($"Report definition not found: {rdlcFile}");
            }

            using var localReport = new LocalReport();
            localReport.LoadReportDefinition(reportStream);

            // Bind the Datasets
            localReport.DataSources.Add(new ReportDataSource("DataSet1", clientList));
            localReport.DataSources.Add(new ReportDataSource("Datalanguage", languages));
            localReport.DataSources.Add(new ReportDataSource("DataEducatioin", educations));
            localReport.DataSources.Add(new ReportDataSource("DataComputerSkill", skills));
            localReport.DataSources.Add(new ReportDataSource("DataJobExperience", jobExperiences));
            localReport.DataSources.Add(new ReportDataSource("DataReference", references));

            byte[] pdfBytes = localReport.Render("PDF");
            return File(pdfBytes, "application/pdf", $"CurriculumVitae_{client.FirstName}_{client.LastName}.pdf");
        }
    }
}
