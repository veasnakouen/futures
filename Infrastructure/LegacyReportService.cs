using Microsoft.EntityFrameworkCore;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;

namespace MtpApp.Infrastructure
{
    public sealed class LegacyReportService
    {
        private readonly ApplicationDbContext _context;

        private static readonly CultureInfo InvariantCulture = CultureInfo.InvariantCulture;
        private static readonly string[] SupportedDateFormats =
        {
            "MM-dd-yyyy",
            "MM/dd/yyyy",
            "M/d/yyyy",
            "yyyy-MM-dd"
        };

        private static readonly IReadOnlyDictionary<string, LegacyReportDefinition> ReportDefinitions =
            new Dictionary<string, LegacyReportDefinition>(StringComparer.OrdinalIgnoreCase)
            {
                ["ClientSummaryReport"] = new LegacyReportDefinition("Client Summary Report", "ClientSummaryReport", LegacyReportKind.Table, "RegisterDate", "EnrollDate"),
                ["EmploymentSeekerListReport"] = new LegacyReportDefinition("Employment Seeker List Report", "EmploymentSeekerListReport", LegacyReportKind.Table, "RegisterDate", "EnrollDate"),
                ["PlacementSummaryReport"] = new LegacyReportDefinition("Placement Summary Report", "PlacementSummaryReport", LegacyReportKind.Table, "PlacementDate", "RegisterDate", "EnrollDate"),
                ["ClientsRemainingInPlacementReport"] = new LegacyReportDefinition("Clients Remaining In Placement Report", "ClientsRemainingInPlacementReport", LegacyReportKind.Table, "PlacementDate", "RegisterDate", "EnrollDate"),
                ["JobReadinessReport"] = new LegacyReportDefinition("Job Readiness Report", "JobReadinessReport", LegacyReportKind.Table, "OpenDate", "EnrollDate", "RegisterDate"),
                ["EmployersReport"] = new LegacyReportDefinition("Employers Report", "EmployersReport", LegacyReportKind.Table, "CorporateDate", "RegisterDate", "EnrollDate"),
                ["VancancysReport"] = new LegacyReportDefinition("Job Vacancy Available Report", "JobVancancyAvailableReport", LegacyReportKind.Table, "PostingDate", "Deadline", "RegisterDate", "EnrollDate"),
                ["FurtherEuducationSeekerListReport"] = new LegacyReportDefinition("Further Education Seeker List Report", "FurtherEuducationseekerListReport", LegacyReportKind.Table, "RegisterDate", "EnrollDate"),
                ["PlacementMonitoringAndDropoutReport"] = new LegacyReportDefinition("Placement Monitoring And Dropout Report", "PlacementMonitoringAndDropoutReport", LegacyReportKind.Table, "MonitoringDate", "NextMonitoringDate", "PlacementDate"),
                ["beneficiariesReport"] = new LegacyReportDefinition("Beneficiaries Report", "BeneficiariesReport", LegacyReportKind.Table, "RegisterDate", "EnrollDate"),
                ["clientReferralFromMTProgramReport"] = new LegacyReportDefinition("Client Referral From MT Program Report", "ClientReferralFromMTProgramReport", LegacyReportKind.Table, "ReferralDate", "RegisterDate", "EnrollDate"),
                ["LogBooksReport"] = new LegacyReportDefinition("Log Books Report", "LogBooks", LegacyReportKind.Table, "EnrollDate", "Date"),
                ["CaseManagerReport"] = new LegacyReportDefinition("Case Manager Report", "CaseManagerReport", LegacyReportKind.Table, "OpenDate", "AccessDate", "CloseDateSocialSupportCase"),
                ["SocialSupportCaseReport"] = new LegacyReportDefinition("Social Support Case Report", "CaseManagerReport", LegacyReportKind.Table, "OpenDate", "AccessDate", "CloseDateSocialSupportCase"),
                ["BusinessSetupReport"] = new LegacyReportDefinition("Business Setup Report", "BusinessSetUpReport", LegacyReportKind.Table, "StartBusinessSetUpDate", "RegisterDate", "EnrollDate"),
                ["BusinessSetupMonitoringReport"] = new LegacyReportDefinition("Business Setup Monitoring Report", "BusinessSetupMonitoiringReport", LegacyReportKind.Table, "MonitoringDate", "NextMonitoringDate", "EnrollDate"),
                ["BusinessSetupMonitoriingReport"] = new LegacyReportDefinition("Business Setup Monitoring Report", "BusinessSetupMonitoiringReport", LegacyReportKind.Table, "MonitoringDate", "NextMonitoringDate", "EnrollDate"),
                ["CurriculumvitaebycliendIdReport"] = new LegacyReportDefinition("Curriculum Vitae", null, LegacyReportKind.ClientProfile),
                ["CurriculumVitaeByClientReport"] = new LegacyReportDefinition("Curriculum Vitae", null, LegacyReportKind.ClientProfile),
                ["CurriculumvitaeEmbed"] = new LegacyReportDefinition("Curriculum Vitae", null, LegacyReportKind.ClientProfile),
                ["VTCstudentreport"] = new LegacyReportDefinition("VTC Student Report", "ClientSummaryReport", LegacyReportKind.Table, "RegisterDate", "EnrollDate"),
                ["ClientLookforbussinesssSetupReport"] = new LegacyReportDefinition("Client Look For Business Setup Report", "ClientLookforbussinesssSetup", LegacyReportKind.Table, "EnrollDate", "RegisterDate")
            };

        public LegacyReportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public string RenderReport(string actionName, IReadOnlyDictionary<string, string?> routeValues)
        {
            if (!ReportDefinitions.TryGetValue(actionName ?? string.Empty, out var definition))
            {
                return RenderUnknownReport(actionName);
            }

            try
            {
                return definition.Kind == LegacyReportKind.ClientProfile
                    ? RenderClientProfileReport(definition, routeValues)
                    : RenderTableReport(definition, routeValues);
            }
            catch (Exception ex)
            {
                return RenderError(definition.Title, ex.Message);
            }
        }

        public DataTable? GetReportDataTable(string actionName, IReadOnlyDictionary<string, string?> routeValues)
        {
            if (!ReportDefinitions.TryGetValue(actionName ?? string.Empty, out var definition))
            {
                return null;
            }

            if (definition.Kind != LegacyReportKind.Table)
            {
                return null;
            }

            var dataTable = LoadDataTable(definition.SourceObject!);
            var filteredRows = ApplyFilters(dataTable, definition, routeValues).ToList();

            if (filteredRows.Count == 0)
            {
                return dataTable.Clone();
            }

            return filteredRows.CopyToDataTable();
        }

        private string RenderTableReport(LegacyReportDefinition definition, IReadOnlyDictionary<string, string?> routeValues)
        {
            var dataTable = LoadDataTable(definition.SourceObject!);
            var filteredRows = ApplyFilters(dataTable, definition, routeValues).ToList();
            var filterBadges = BuildFilterBadges(routeValues, filteredRows.Count);

            var body = new StringBuilder();

            if (filteredRows.Count == 0)
            {
                body.Append("<div class=\"alert alert-info mb-0\">No records matched the current filters.</div>");
                return WrapReport(definition.Title, definition.SourceObject!, filterBadges, body.ToString());
            }

            body.Append("<div class=\"table-responsive\">");
            body.Append("<table class=\"table table-sm table-striped table-bordered align-middle mb-0\">");
            body.Append("<thead class=\"table-light\"><tr>");
            body.Append("<th scope=\"col\" class=\"text-center\" style=\"width: 56px\">#</th>");

            foreach (DataColumn column in dataTable.Columns)
            {
                body.Append("<th scope=\"col\">" + Encode(FormatHeader(column.ColumnName)) + "</th>");
            }

            body.Append("</tr></thead><tbody>");

            for (var index = 0; index < filteredRows.Count; index++)
            {
                var row = filteredRows[index];
                body.Append("<tr>");
                body.Append("<td class=\"text-center text-muted\">" + (index + 1).ToString(CultureInfo.InvariantCulture) + "</td>");

                foreach (DataColumn column in dataTable.Columns)
                {
                    body.Append("<td style=\"white-space: pre-wrap; word-break: break-word;\">" + Encode(FormatCellValue(row[column])) + "</td>");
                }

                body.Append("</tr>");
            }

            body.Append("</tbody></table></div>");
            return WrapReport(definition.Title, definition.SourceObject!, filterBadges, body.ToString());
        }

        private string RenderClientProfileReport(LegacyReportDefinition definition, IReadOnlyDictionary<string, string?> routeValues)
        {
            if (!TryGetInt(routeValues, "clientId", out var clientId))
            {
                return RenderError(definition.Title, "A valid clientId route value is required for this report.");
            }

            var client = _context.Clients.AsNoTracking().IgnoreQueryFilters().FirstOrDefault(item => item.Id == clientId);
            if (client == null)
            {
                return RenderError(definition.Title, $"Client #{clientId} was not found.");
            }

            var jobPositions = _context.JobPosition.AsNoTracking().IgnoreQueryFilters().ToDictionary(item => item.Id, item => item.Name);
            var jobCategories = _context.JobCategory.AsNoTracking().ToDictionary(item => item.Id, item => item.Name);
            var businessCategories = _context.BusinessSetUpCategories.AsNoTracking().ToDictionary(item => item.Id, item => item.BusCategoryName);

            var trainings = _context.FuturesTrainings.AsNoTracking()
                .Include(item => item.Subject)
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.OpenDate)
                .ToList();

            var educations = _context.Educations.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var placements = _context.Placements.AsNoTracking()
                .Include(item => item.JobPosition)
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.PlacementDate)
                .ToList();

            var languages = _context.Languages.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var skills = _context.ComputerSkills.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var expectations = _context.JobExpectations.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var references = _context.CvReferenceS.AsNoTracking()
                .Include(item => item.JobPositions)
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var furtherEducations = _context.FurtherEducations.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var jobExperiences = _context.JobExperiences.AsNoTracking()
                .Include(item => item.JobPositions)
                .Where(item => item.ClientId == clientId)
                .OrderByDescending(item => item.Id)
                .ToList();

            var personality = _context.Personalities.AsNoTracking()
                .Where(item => item.ClientId == clientId)
                .FirstOrDefault();

            return RenderCvDocument(client, routeValues, jobExperiences, educations, languages, skills, expectations, references, personality);
        }

        private string RenderCvDocument(
            Client client,
            IReadOnlyDictionary<string, string?> routeValues,
            List<JobExperience> jobExperiences,
            List<Education> educations,
            List<Language> languages,
            List<ComputerSkill> skills,
            List<JobExpectation> expectations,
            List<CvReference> references,
            Personality? personality = null)
        {
            routeValues.TryGetValue("cvtype", out var cvType);
            routeValues.TryGetValue("Applyfor", out var applyFor);
            var showImage   = string.Equals(cvType,   "Image", StringComparison.OrdinalIgnoreCase);
            var showApplyFor = string.Equals(applyFor, "yes",  StringComparison.OrdinalIgnoreCase);

            // Pre-resolve job position names for "Apply for" line (TypeOfEmployment1 in original view).
            var jobPositions = _context.JobPosition.AsNoTracking().ToDictionary(p => p.Id, p => p.Name);

            var sb = new StringBuilder();
            sb.Append("<style>\n");
            sb.Append("*{box-sizing:border-box;}\n");
            sb.Append("body{margin:0;padding:16px;background:#e8ebef;}\n");
            // Document card
            sb.Append(".cv-page{font-family:'Times New Roman',Georgia,serif;font-size:12.5pt;color:#1a1a1a;background:#fff;max-width:720px;margin:0 auto;padding:40px 52px 48px;box-shadow:0 4px 24px rgba(0,0,0,.14);border-radius:3px;line-height:1.6;}\n");
            // Title
            sb.Append(".cv-title{text-align:center;font-size:17pt;font-weight:bold;letter-spacing:3px;margin:0 0 4px;padding-bottom:12px;border-bottom:2.5px solid #1e3a6e;}\n");
            // Header info block (Name / Address / Tel / Apply for)
            sb.Append(".cv-header-tbl{width:100%;border-collapse:collapse;margin-top:10px;}\n");
            sb.Append(".cv-header-tbl td{padding:2px 4px;vertical-align:top;font-size:12pt;}\n");
            sb.Append(".cv-hlbl{width:110px;color:#555;}\n");
            sb.Append(".cv-hcolon{width:14px;color:#555;}\n");
            // Section heading — bold + coloured left bar
            sb.Append(".cv-section{display:block;font-weight:bold;font-size:11.5pt;letter-spacing:.5px;color:#1e3a6e;border-left:4px solid #1e3a6e;padding:2px 0 2px 9px;margin:16px 0 6px;}\n");
            // Data rows inside sections
            sb.Append(".cv-tbl{width:100%;border-collapse:collapse;}\n");
            sb.Append(".cv-tbl tr{border-bottom:1px solid #f0f0f0;}\n");
            sb.Append(".cv-tbl tr:last-child{border-bottom:none;}\n");
            sb.Append(".cv-tbl td{padding:3.5px 4px;vertical-align:top;font-size:12pt;}\n");
            sb.Append(".cv-lbl{width:150px;color:#4a4a4a;}\n");
            sb.Append(".cv-colon{width:14px;color:#888;}\n");
            sb.Append(".cv-sect-tbl{margin-left:13px;width:calc(100% - 13px);}\n");
            // Separator
            sb.Append(".cv-sep{border:none;border-top:1px solid #e0e0e0;margin:12px 0;}\n");
            // Photo
            sb.Append(".cv-photo{width:94px;height:118px;object-fit:cover;border-radius:4px;border:1px solid #ccc;box-shadow:0 3px 10px rgba(0,0,0,.18);display:block;}\n");
            // ID card
            sb.Append(".cv-idcard-wrap{margin-top:12px;text-align:center;}\n");
            sb.Append(".cv-idcard{max-width:360px;max-height:220px;border-radius:6px;border:1px solid #ccc;box-shadow:0 3px 12px rgba(0,0,0,.15);}\n");
            // Hobby
            sb.Append(".cv-hobby{margin:4px 0 4px 13px;font-style:italic;color:#333;}\n");
            // Print overrides
            sb.Append("@media print{body{background:#fff;padding:0;}  .cv-page{box-shadow:none;border-radius:0;padding:20px 32px;} .cv-sep{border-top-color:#bbb;} .cv-section{border-left-color:#000;color:#000;}}\n");
            sb.Append("</style>\n");

            sb.Append("<div class=\"cv-page\">");

            // ── Title + optional photo ─────────────────────────────────────
            sb.Append("<div style=\"position:relative;" + (showImage ? "min-height:126px;" : "") + "\">");
            sb.Append("<h2 class=\"cv-title\">CURRICULUM VITAE</h2>");

            if (showImage)
            {
                var photoSrc = !string.IsNullOrWhiteSpace(client.Photo)
                    ? "/Images/" + Encode(client.Photo)
                    : "/Images/blank_profile.png";
                sb.Append("<img class=\"cv-photo\" src=\"" + photoSrc + "\" alt=\"Photo\" style=\"position:absolute;top:0;right:0;\" />");
            }

            var headerWidth = showImage ? "calc(100% - 112px)" : "100%";
            sb.Append("<table class=\"cv-header-tbl\" style=\"width:" + headerWidth + ";\">");
            sb.Append(HRow("Name",    BuildClientName(client.FirstName, client.LastName)));
            sb.Append(HRow("Address", client.Address));
            sb.Append(HRow("Tel",     client.ContactPhone));
            if (showApplyFor)
            {
                // Matches RDLC: TypeOfEmployment1 (first job position name) + " " + Candidate
                var exp = expectations.FirstOrDefault();
                var typeOfEmployment1 = exp?.JobPositionIdOne.HasValue == true && jobPositions.TryGetValue(exp.JobPositionIdOne!.Value, out var posName)
                    ? posName : string.Empty;
                var candidate = exp?.Candidate ?? string.Empty;
                string applyValue;
                if (!string.IsNullOrWhiteSpace(typeOfEmployment1) && !string.IsNullOrWhiteSpace(candidate))
                    applyValue = typeOfEmployment1 + " ( " + candidate + " )";
                else
                    applyValue = typeOfEmployment1 ?? candidate ?? string.Empty;
                sb.Append(HRow("Apply for", applyValue));
            }
            sb.Append("</table>");
            sb.Append("</div>"); // position:relative
            CvSep();

            // ── PERSONAL DATA ──────────────────────────────────────────────
            sb.Append("<span class=\"cv-section\">PERSONAL DATA</span>");
            sb.Append("<table class=\"cv-tbl cv-sect-tbl\">");
            sb.Append(CvRow("Sex",            client.Gender));
            sb.Append(CvRow("Marital",        client.MaritalStatus));
            sb.Append(CvRow("Date of birth",  FormatCvDate(client.DateOfBirth)));
            sb.Append(CvRow("Place of birth", client.PlaceOfBirth));
            sb.Append(CvRow("Nationality",    client.Nationality));
            sb.Append(CvRow("Citizenship",    client.Citizenship));
            sb.Append("</table>");
            CvSep();

            // ── EDUCATION BACKGROUND ───────────────────────────────────────
            sb.Append("<span class=\"cv-section\">EDUCATION BACKGROUND</span>");
            sb.Append("<table class=\"cv-tbl cv-sect-tbl\">");
            if (educations.Count > 0)
            {
                foreach (var edu in educations)
                {
                    var eduLabel = !string.IsNullOrWhiteSpace(edu.Level) ? edu.Level : "N/A";
                    var eduParts = new System.Collections.Generic.List<string>();
                    if (!string.IsNullOrWhiteSpace(edu.SchoolName)) eduParts.Add(edu.SchoolName);
                    if (!string.IsNullOrWhiteSpace(edu.Year))        eduParts.Add("(" + edu.Year + ")");
                    if (!string.IsNullOrWhiteSpace(edu.Grade))       eduParts.Add("Grade: " + edu.Grade);
                    if (!string.IsNullOrWhiteSpace(edu.Subject))     eduParts.Add("Major: " + edu.Subject);
                    sb.Append(CvRow(eduLabel, string.Join("  ", eduParts)));
                }
            }
            else
                sb.Append(CvRow("N/A", "N/A"));
            sb.Append("</table>");
            CvSep();

            // ── SHORT COURSE ───────────────────────────────────────────────
            sb.Append("<span class=\"cv-section\">SHORT COURSE</span>");
            sb.Append("<table class=\"cv-tbl cv-sect-tbl\">");
            if (skills.Count > 0)
            {
                foreach (var skill in skills)
                {
                    var skillLabel = !string.IsNullOrWhiteSpace(skill.Skill) ? skill.Skill : "N/A";
                    var skillParts = new System.Collections.Generic.List<string>();
                    if (!string.IsNullOrWhiteSpace(skill.Level))     skillParts.Add(skill.Level);
                    if (!string.IsNullOrWhiteSpace(skill.During))    skillParts.Add("Duration: " + skill.During);
                    if (!string.IsNullOrWhiteSpace(skill.Certified)) skillParts.Add("Cert: " + skill.Certified);
                    sb.Append(CvRow(skillLabel, string.Join("  /  ", skillParts)));
                }
            }
            else
                sb.Append(CvRow("N/A", "N/A"));
            sb.Append("</table>");
            CvSep();

            // ── WORKING EXPERIENCE ─────────────────────────────────────────
            sb.Append("<span class=\"cv-section\">WORKING EXPERIENCE</span>");
            sb.Append("<table class=\"cv-tbl cv-sect-tbl\">");
            if (jobExperiences.Count > 0)
            {
                foreach (var jexp in jobExperiences)
                {
                    jobPositions.TryGetValue(jexp.JobPositionId, out var jposName);
                    var jexpLabel = !string.IsNullOrWhiteSpace(jposName)   ? jposName
                                 : !string.IsNullOrWhiteSpace(jexp.Employer) ? jexp.Employer
                                 : "N/A";
                    var jexpParts = new System.Collections.Generic.List<string>();
                    if (!string.IsNullOrWhiteSpace(jexp.Employer)     && jexp.Employer != jexpLabel) jexpParts.Add(jexp.Employer);
                    if (!string.IsNullOrWhiteSpace(jexp.Duration))    jexpParts.Add(jexp.Duration);
                    if (!string.IsNullOrWhiteSpace(jexp.Salary))      jexpParts.Add("Salary: " + jexp.Salary);
                    if (!string.IsNullOrWhiteSpace(jexp.Description)) jexpParts.Add(jexp.Description);
                    sb.Append(CvRow(jexpLabel, string.Join("  /  ", jexpParts)));
                }
            }
            else
                sb.Append(CvRow("N/A", "N/A"));
            sb.Append("</table>");
            CvSep();

            // ── LANGUAGE ──────────────────────────────────────────────────
            // RDLC: Name : Level  (Datalanguage dataset)
            sb.Append("<span class=\"cv-section\">LANGUAGE</span>");
            sb.Append("<table class=\"cv-tbl cv-sect-tbl\">");
            if (languages.Count > 0)
                foreach (var lang in languages)
                    sb.Append(CvRow(lang.Name, lang.Level));
            else
                sb.Append(CvRow("N/A", "N/A"));
            sb.Append("</table>");
            CvSep();

            // ── HOBBY ─────────────────────────────────────────────────────
            sb.Append("<span class=\"cv-section\">HOBBY</span>");
            var hobbyText = !string.IsNullOrWhiteSpace(personality?.Strength)
                ? personality!.Strength
                : expectations.FirstOrDefault()?.Hobby;
            sb.Append("<p class=\"cv-hobby\">" + Encode(!string.IsNullOrWhiteSpace(hobbyText) ? hobbyText : "N/A") + "</p>");
            CvSep();

            // ── REFERENCE ─────────────────────────────────────────────────
            sb.Append("<span class=\"cv-section\">REFERENCE</span>");
            var hasRefContent = false;

            if (references.Count > 0)
            {
                hasRefContent = true;
                sb.Append("<table class=\"cv-tbl cv-sect-tbl\" style=\"margin-bottom:8px;\">");
                foreach (var cvRef in references)
                {
                    var refParts = new System.Collections.Generic.List<string>();
                    if (!string.IsNullOrWhiteSpace(cvRef.Organization)) refParts.Add(cvRef.Organization);
                    if (!string.IsNullOrWhiteSpace(cvRef.Phone))        refParts.Add("Tel: " + cvRef.Phone);
                    if (!string.IsNullOrWhiteSpace(cvRef.Email))        refParts.Add("Email: " + cvRef.Email);
                    if (!string.IsNullOrWhiteSpace(cvRef.Description))  refParts.Add(cvRef.Description);
                    sb.Append(CvRow(cvRef.Name, string.Join("  /  ", refParts)));
                }
                sb.Append("</table>");
            }

            if (showImage && !string.IsNullOrWhiteSpace(client.IdCard))
            {
                hasRefContent = true;
                sb.Append("<div class=\"cv-idcard-wrap\"><img class=\"cv-idcard\" src=\"/Images/" + Encode(client.IdCard) + "\" alt=\"ID Card\" /></div>");
            }

            if (!hasRefContent)
                sb.Append("<p class=\"cv-hobby\">N/A</p>");

            sb.Append("</div>"); // cv-page
            return sb.ToString();

            // Section data row — label / colon / value
            string CvRow(string? lbl, string? val) =>
                "<tr>"
                + "<td class=\"cv-lbl\">" + Encode(lbl ?? string.Empty) + "</td>"
                + "<td class=\"cv-colon\">:</td>"
                + "<td>" + Encode(val ?? string.Empty) + "</td>"
                + "</tr>";
            // Header block row (Name / Address / Tel) — slightly different muted label
            string HRow(string? lbl, string? val) =>
                "<tr>"
                + "<td class=\"cv-hlbl\">" + Encode(lbl ?? string.Empty) + "</td>"
                + "<td class=\"cv-hcolon\">:</td>"
                + "<td>" + Encode(val ?? string.Empty) + "</td>"
                + "</tr>";
            void CvSep() => sb.Append("<hr class=\"cv-sep\" />");
        }

        private static string FormatCvDate(DateTime? value)
        {
            return value.HasValue ? value.Value.ToString("dd MMMM yyyy", InvariantCulture) : string.Empty;
        }

        private DataTable LoadDataTable(string sourceObject)
        {
            var connection = _context.Database.GetDbConnection();
            var shouldClose = connection.State != ConnectionState.Open;

            if (shouldClose)
            {
                connection.Open();
            }

            try
            {
                using var command = connection.CreateCommand();
                command.CommandText = $"SELECT * FROM [dbo].[{sourceObject}]";
                command.CommandTimeout = 120;

                using var reader = command.ExecuteReader();
                var table = new DataTable();
                table.Load(reader);
                return table;
            }
            finally
            {
                if (shouldClose)
                {
                    connection.Close();
                }
            }
        }

        private IEnumerable<DataRow> ApplyFilters(DataTable table, LegacyReportDefinition definition, IReadOnlyDictionary<string, string?> routeValues)
        {
            IEnumerable<DataRow> rows = table.AsEnumerable();

            rows = ApplyTextFilter(rows, table, routeValues, "clientCodeSearch", true, "ClientCode");
            rows = ApplyTextFilter(rows, table, routeValues, "gender", false, "Gender");
            rows = ApplyTextFilter(rows, table, routeValues, "status", false, "Status");
            rows = ApplyTextFilter(rows, table, routeValues, "postion", false, "JobPosition", "JobPositions", "Position", "Title");
            rows = ApplyTextFilter(rows, table, routeValues, "ontraining", false, "TrainingFromFutures", "OnTraining", "Status");
            rows = ApplyTextFilter(rows, table, routeValues, "placement", false, "Placement", "PlacementType", "Status");
            rows = ApplyTextFilter(rows, table, routeValues, "Report", false, "Status", "HaveCaseManager", "HaveProblem", "Name");
            rows = ApplyBusinessCategoryFilter(rows, table, routeValues);
            rows = ApplyDateRangeFilter(rows, table, definition.DateColumns, routeValues);

            return rows;
        }

        private IEnumerable<DataRow> ApplyTextFilter(IEnumerable<DataRow> rows, DataTable table, IReadOnlyDictionary<string, string?> routeValues, string parameterName, bool startsWith, params string[] columnCandidates)
        {
            if (!TryGetRouteValue(routeValues, parameterName, out var rawValue) || IsIgnoredFilterValue(rawValue))
            {
                return rows;
            }

            var columnName = FindColumn(table, columnCandidates);
            if (columnName == null)
            {
                return rows;
            }

            var comparisonValue = rawValue!.Trim();
            return rows.Where(row => MatchesText(GetRowValue(row, columnName), comparisonValue, startsWith));
        }

        private IEnumerable<DataRow> ApplyBusinessCategoryFilter(IEnumerable<DataRow> rows, DataTable table, IReadOnlyDictionary<string, string?> routeValues)
        {
            if (!TryGetRouteValue(routeValues, "FindbusinessSetup", out var rawValue) || IsIgnoredFilterValue(rawValue))
            {
                return rows;
            }

            var numericCategoryId = TryParseInt(rawValue!, out var categoryId) ? categoryId : (int?)null;
            var categoryName = numericCategoryId.HasValue
                ? _context.BusinessSetUpCategories.AsNoTracking()
                    .Where(item => item.Id == numericCategoryId.Value)
                    .Select(item => item.BusCategoryName)
                    .FirstOrDefault()
                : null;

            var stringColumn = FindColumn(table, "BusCategoryName", "BusinessCategoryName", "BusinessSetUpCategory", "CategoryName");
            if (!string.IsNullOrWhiteSpace(categoryName) && stringColumn != null)
            {
                return rows.Where(row => MatchesText(GetRowValue(row, stringColumn), categoryName, false));
            }

            if (numericCategoryId.HasValue)
            {
                var numericColumn = FindColumn(table, "BusinessSetUpCategoryId", "BusinessCategoryId", "BusCategoryId");
                if (numericColumn != null)
                {
                    return rows.Where(row => TryParseInt(GetRowValue(row, numericColumn), out var value) && value == numericCategoryId.Value);
                }
            }

            if (stringColumn != null)
            {
                return rows.Where(row => MatchesText(GetRowValue(row, stringColumn), rawValue!, false));
            }

            return rows;
        }

        private IEnumerable<DataRow> ApplyDateRangeFilter(IEnumerable<DataRow> rows, DataTable table, string[] preferredColumns, IReadOnlyDictionary<string, string?> routeValues)
        {
            if (!TryParseDate(routeValues, "startdate", out var startDate) || !TryParseDate(routeValues, "enddate", out var endDate))
            {
                return rows;
            }

            if (startDate > endDate)
            {
                var swap = startDate;
                startDate = endDate;
                endDate = swap;
            }

            var dateColumn = FindDateColumn(table, preferredColumns);
            if (dateColumn == null)
            {
                return rows;
            }

            var start = startDate.Date;
            var end = endDate.Date;
            return rows.Where(row => TryGetDate(GetRowValue(row, dateColumn), out var rowDate) && rowDate.Date >= start && rowDate.Date <= end);
        }

        private static string? FindDateColumn(DataTable table, IReadOnlyCollection<string> preferredColumns)
        {
            foreach (var candidate in preferredColumns)
            {
                var columnName = FindColumn(table, candidate);
                if (columnName != null)
                {
                    return columnName;
                }
            }

            foreach (DataColumn column in table.Columns)
            {
                if (column.ColumnName.Contains("date", StringComparison.OrdinalIgnoreCase))
                {
                    return column.ColumnName;
                }
            }

            return null;
        }

        private static string? FindColumn(DataTable table, params string[] candidates)
        {
            foreach (var candidate in candidates)
            {
                var column = table.Columns
                    .Cast<DataColumn>()
                    .FirstOrDefault(item => item.ColumnName.Equals(candidate, StringComparison.OrdinalIgnoreCase));

                if (column != null)
                {
                    return column.ColumnName;
                }
            }

            return null;
        }

        private static object? GetRowValue(DataRow row, string columnName)
        {
            if (!row.Table.Columns.Contains(columnName))
            {
                return null;
            }

            var value = row[columnName];
            return value == DBNull.Value ? null : value;
        }

        private static bool MatchesText(object? value, string filterValue, bool startsWith)
        {
            var text = ConvertToComparableText(value);
            if (string.IsNullOrWhiteSpace(text))
            {
                return false;
            }

            return startsWith
                ? text.StartsWith(filterValue, StringComparison.OrdinalIgnoreCase)
                : string.Equals(text, filterValue, StringComparison.OrdinalIgnoreCase);
        }

        private static string ConvertToComparableText(object? value)
        {
            if (value == null)
            {
                return string.Empty;
            }

            if (value is bool boolValue)
            {
                return boolValue ? "True" : "False";
            }

            if (value is DateTime dateTime)
            {
                return dateTime.ToString("yyyy-MM-dd", InvariantCulture);
            }

            if (value is DateTimeOffset dateTimeOffset)
            {
                return dateTimeOffset.ToString("yyyy-MM-dd", InvariantCulture);
            }

            return Convert.ToString(value, InvariantCulture) ?? string.Empty;
        }

        private static bool TryParseDate(IReadOnlyDictionary<string, string?> routeValues, string key, out DateTime dateTime)
        {
            dateTime = default;

            if (!TryGetRouteValue(routeValues, key, out var rawValue) || string.IsNullOrWhiteSpace(rawValue))
            {
                return false;
            }

            return DateTime.TryParseExact(rawValue.Trim(), SupportedDateFormats, InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out dateTime)
                || DateTime.TryParse(rawValue.Trim(), InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out dateTime);
        }

        private static bool TryGetInt(IReadOnlyDictionary<string, string?> routeValues, string key, out int value)
        {
            value = default;

            if (!TryGetRouteValue(routeValues, key, out var rawValue) || string.IsNullOrWhiteSpace(rawValue))
            {
                return false;
            }

            return TryParseInt(rawValue, out value);
        }

        private static bool TryParseInt(object? value, out int result)
        {
            result = default;
            if (value == null)
            {
                return false;
            }

            if (value is int intValue)
            {
                result = intValue;
                return true;
            }

            return int.TryParse(Convert.ToString(value, InvariantCulture), NumberStyles.Integer, InvariantCulture, out result);
        }

        private static bool TryParseInt(string value, out int result)
        {
            return int.TryParse(value, NumberStyles.Integer, InvariantCulture, out result);
        }

        private static bool TryGetDate(object? value, out DateTime dateTime)
        {
            dateTime = default;

            if (value == null)
            {
                return false;
            }

            if (value is DateTime directDate)
            {
                dateTime = directDate;
                return true;
            }

            if (value is DateTimeOffset dateTimeOffset)
            {
                dateTime = dateTimeOffset.DateTime;
                return true;
            }

            var text = Convert.ToString(value, InvariantCulture);
            if (string.IsNullOrWhiteSpace(text))
            {
                return false;
            }

            return DateTime.TryParseExact(text.Trim(), SupportedDateFormats, InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out dateTime)
                || DateTime.TryParse(text.Trim(), InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out dateTime);
        }

        private static bool TryGetRouteValue(IReadOnlyDictionary<string, string?> routeValues, string key, out string? value)
        {
            if (routeValues.TryGetValue(key, out value))
            {
                return true;
            }

            value = null;
            return false;
        }

        private static bool IsIgnoredFilterValue(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return true;
            }

            var normalized = value.Trim();
            return normalized.Equals("0", StringComparison.OrdinalIgnoreCase)
                || normalized.StartsWith("all", StringComparison.OrdinalIgnoreCase);
        }

        private static string RenderUnknownReport(string actionName)
        {
            return WrapSimpleMessage(
                "Report not configured",
                $"The report action <strong>{Encode(actionName)}</strong> does not have a registered data source yet.");
        }

        private static string RenderError(string title, string message)
        {
            return WrapSimpleMessage(title, Encode(message), "danger");
        }

        private static string WrapSimpleMessage(string title, string message, string alertType = "warning")
        {
            var body = $"<div class=\"alert alert-{alertType} mb-0\">{message}</div>";
            return WrapReport(title, string.Empty, Array.Empty<KeyValuePair<string, string?>>(), body);
        }

        private static string WrapReport(string title, string subtitle, IReadOnlyCollection<KeyValuePair<string, string?>> badges, string bodyHtml)
        {
            var builder = new StringBuilder();
            builder.Append("<div class=\"legacy-report\">\n");
            builder.Append("<div class=\"card border-0 shadow-sm\">\n");
            builder.Append("<div class=\"card-header bg-dark text-white\">\n");
            builder.Append("<div class=\"d-flex flex-column flex-lg-row justify-content-between gap-3\">\n");
            builder.Append("<div>\n");
            builder.Append("<div class=\"text-uppercase small opacity-75\">Legacy Report</div>\n");
            builder.Append("<h4 class=\"mb-1\">" + Encode(title) + "</h4>\n");
            if (!string.IsNullOrWhiteSpace(subtitle))
            {
                builder.Append("<div class=\"small opacity-75\">" + Encode(subtitle) + "</div>\n");
            }
            builder.Append("</div>\n");

            if (badges.Count > 0)
            {
                builder.Append("<div class=\"d-flex flex-wrap justify-content-lg-end gap-2 align-items-start\">\n");
                foreach (var badge in badges)
                {
                    builder.Append("<span class=\"badge rounded-3 bg-light text-dark border border-secondary-subtle px-2 py-1 text-wrap\">" + Encode(badge.Key) + ": " + Encode(badge.Value ?? string.Empty) + "</span>");
                }
                builder.Append("</div>\n");
            }

            builder.Append("</div>\n");
            builder.Append("</div>\n");
            builder.Append("<div class=\"card-body\">\n");
            builder.Append(bodyHtml);
            builder.Append("</div>\n");
            builder.Append("</div>\n");
            builder.Append("</div>");
            return builder.ToString();
        }

        private static string RenderFieldGrid(string title, IEnumerable<KeyValuePair<string, string?>> fields)
        {
            var builder = new StringBuilder();
            builder.Append("<section class=\"mb-4\">\n");
            builder.Append("<div class=\"d-flex align-items-center justify-content-between mb-3\">\n");
            builder.Append("<h5 class=\"mb-0\">" + Encode(title) + "</h5>\n");
            builder.Append("</div>\n");
            builder.Append("<div class=\"row g-3\">\n");

            foreach (var field in fields)
            {
                builder.Append("<div class=\"col-12 col-md-6 col-xl-4\">\n");
                builder.Append("<div class=\"border rounded-3 p-3 h-100 bg-body-tertiary\">\n");
                builder.Append("<div class=\"text-uppercase small text-body-secondary mb-1\">" + Encode(field.Key) + "</div>\n");
                builder.Append("<div class=\"fw-semibold\" style=\"white-space: pre-wrap; word-break: break-word;\">" + Encode(field.Value ?? "-") + "</div>\n");
                builder.Append("</div>\n");
                builder.Append("</div>\n");
            }

            builder.Append("</div>\n");
            builder.Append("</section>\n");
            return builder.ToString();
        }

        private static string RenderTableSection(string title, IReadOnlyList<string> headers, IEnumerable<string?[]> rows)
        {
            var body = new StringBuilder();
            body.Append("<section class=\"mb-4\">\n");
            body.Append("<div class=\"card border-0 shadow-sm\">\n");
            body.Append("<div class=\"card-header bg-body-tertiary\">\n");
            body.Append("<h5 class=\"mb-0\">" + Encode(title) + "</h5>\n");
            body.Append("</div>\n");
            body.Append("<div class=\"table-responsive\">\n");
            body.Append("<table class=\"table table-sm table-striped table-bordered align-middle mb-0\">\n");
            body.Append("<thead class=\"table-light\"><tr>");

            foreach (var header in headers)
            {
                body.Append("<th scope=\"col\">" + Encode(header) + "</th>");
            }

            body.Append("</tr></thead><tbody>\n");

            foreach (var row in rows)
            {
                body.Append("<tr>");
                foreach (var cell in row)
                {
                    body.Append("<td style=\"white-space: pre-wrap; word-break: break-word;\">" + Encode(cell ?? "-") + "</td>");
                }
                body.Append("</tr>\n");
            }

            body.Append("</tbody></table>\n");
            body.Append("</div>\n");
            body.Append("</div>\n");
            body.Append("</section>\n");
            return body.ToString();
        }

        private List<KeyValuePair<string, string?>> BuildFilterBadges(IReadOnlyDictionary<string, string?> routeValues, int rowCount)
        {
            var badges = new List<KeyValuePair<string, string?>>
            {
                new KeyValuePair<string, string?>("Rows", rowCount.ToString(CultureInfo.InvariantCulture))
            };

            AddIfPresent(badges, routeValues, "clientCodeSearch", "Client Code Search", value => value);
            AddIfPresent(badges, routeValues, "gender", "Gender", value => value);
            AddIfPresent(badges, routeValues, "status", "Status", value => value);
            AddIfPresent(badges, routeValues, "postion", "Position", value => value);
            AddIfPresent(badges, routeValues, "ontraining", "On Training", value => value);
            AddIfPresent(badges, routeValues, "placement", "Placement", value => value);
            AddIfPresent(badges, routeValues, "Report", "Report", value => value);

            if (TryGetRouteValue(routeValues, "FindbusinessSetup", out var businessValue) && !IsIgnoredFilterValue(businessValue))
            {
                var displayValue = businessValue;
                if (TryParseInt(businessValue!, out var categoryId))
                {
                    var categoryName = _context.BusinessSetUpCategories.AsNoTracking()
                        .Where(item => item.Id == categoryId)
                        .Select(item => item.BusCategoryName)
                        .FirstOrDefault();

                    if (!string.IsNullOrWhiteSpace(categoryName))
                    {
                        displayValue = $"{categoryName} ({categoryId})";
                    }
                }

                badges.Add(new KeyValuePair<string, string?>("Business Category", displayValue));
            }

            AddIfPresent(badges, routeValues, "startdate", "Start Date", value => value);
            AddIfPresent(badges, routeValues, "enddate", "End Date", value => value);
            AddIfPresent(badges, routeValues, "clientId", "Client ID", value => value);
            AddIfPresent(badges, routeValues, "cvtype", "CV Type", value => value);
            AddIfPresent(badges, routeValues, "Applyfor", "Apply For", value => value);

            return badges;
        }

        private static List<KeyValuePair<string, string?>> BuildProfileBadges(IReadOnlyDictionary<string, string?> routeValues, Client client)
        {
            var badges = new List<KeyValuePair<string, string?>>
            {
                new KeyValuePair<string, string?>("Client", client.ClientCode),
                new KeyValuePair<string, string?>("ID", client.Id.ToString(CultureInfo.InvariantCulture))
            };

            if (routeValues.TryGetValue("cvtype", out var cvType) && !IsIgnoredFilterValue(cvType))
            {
                badges.Add(new KeyValuePair<string, string?>("CV Type", cvType));
            }

            if (routeValues.TryGetValue("Applyfor", out var applyFor) && !IsIgnoredFilterValue(applyFor))
            {
                badges.Add(new KeyValuePair<string, string?>("Apply For", applyFor));
            }

            return badges;
        }

        private static void AddIfPresent(List<KeyValuePair<string, string?>> badges, IReadOnlyDictionary<string, string?> routeValues, string routeKey, string badgeKey, Func<string, string> transform)
        {
            if (routeValues.TryGetValue(routeKey, out var value) && !IsIgnoredFilterValue(value))
            {
                badges.Add(new KeyValuePair<string, string?>(badgeKey, transform(value ?? string.Empty)));
            }
        }

        private static string ResolveBusinessType(JobExpectation expectation, IReadOnlyDictionary<int, string> businessCategories)
        {
            if (expectation.BusinessSetUpCategoryId.HasValue && businessCategories.TryGetValue(expectation.BusinessSetUpCategoryId.Value, out var categoryName))
            {
                return categoryName;
            }

            return expectation.BusinessType;
        }

        private static string JoinLookupNames(int? firstId, int? secondId, int? thirdId, IReadOnlyDictionary<int, string> lookup)
        {
            var names = new List<string>();

            if (firstId.HasValue && lookup.TryGetValue(firstId.Value, out var firstName))
            {
                names.Add(firstName);
            }

            if (secondId.HasValue && lookup.TryGetValue(secondId.Value, out var secondName) && !names.Any(item => string.Equals(item, secondName, StringComparison.OrdinalIgnoreCase)))
            {
                names.Add(secondName);
            }

            if (thirdId.HasValue && lookup.TryGetValue(thirdId.Value, out var thirdName) && !names.Any(item => string.Equals(item, thirdName, StringComparison.OrdinalIgnoreCase)))
            {
                names.Add(thirdName);
            }

            return names.Count == 0 ? "-" : string.Join(", ", names);
        }

        private static KeyValuePair<string, string?> Field(string name, string? value)
        {
            return new KeyValuePair<string, string?>(name, string.IsNullOrWhiteSpace(value) ? "-" : value);
        }

        private static string Encode(string? value)
        {
            return HtmlEncoder.Default.Encode(value ?? string.Empty);
        }

        private static string FormatHeader(string columnName)
        {
            if (string.IsNullOrWhiteSpace(columnName))
            {
                return columnName;
            }

            if (columnName.Equals(columnName.ToUpperInvariant(), StringComparison.Ordinal))
            {
                return columnName;
            }

            var builder = new StringBuilder(columnName.Length + 8);
            for (var index = 0; index < columnName.Length; index++)
            {
                var current = columnName[index];
                if (index > 0 && char.IsUpper(current) && !char.IsUpper(columnName[index - 1]) && columnName[index - 1] != ' ' && columnName[index - 1] != '_')
                {
                    builder.Append(' ');
                }

                if (current == '_')
                {
                    builder.Append(' ');
                }
                else
                {
                    builder.Append(current);
                }
            }

            return builder.ToString();
        }

        private static string FormatCellValue(object? value)
        {
            if (value == null || value == DBNull.Value)
            {
                return "-";
            }

            if (value is bool boolValue)
            {
                return boolValue ? "Yes" : "No";
            }

            if (value is DateTime dateTime)
            {
                return dateTime.ToString("yyyy-MM-dd", InvariantCulture);
            }

            if (value is DateTimeOffset dateTimeOffset)
            {
                return dateTimeOffset.ToString("yyyy-MM-dd", InvariantCulture);
            }

            if (value is byte[] bytes)
            {
                return $"{bytes.Length} bytes";
            }

            return Convert.ToString(value, InvariantCulture) ?? "-";
        }

        private static string BuildClientName(string? firstName, string? lastName)
        {
            var parts = new[] { firstName, lastName }.Where(part => !string.IsNullOrWhiteSpace(part)).ToArray();
            return parts.Length == 0 ? "-" : string.Join(" ", parts);
        }

        private static string FormatDate(DateTime? value)
        {
            return value.HasValue ? value.Value.ToString("yyyy-MM-dd", InvariantCulture) : "-";
        }

        private static string FormatAge(DateTime? dateOfBirth)
        {
            if (!dateOfBirth.HasValue)
            {
                return "-";
            }

            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Value.Year;
            if (dateOfBirth.Value.Date > today.AddYears(-age))
            {
                age--;
            }

            return age < 0 ? "-" : age.ToString(CultureInfo.InvariantCulture);
        }

        private static string YesNo(bool value)
        {
            return value ? "Yes" : "No";
        }

        private sealed class LegacyReportDefinition
        {
            public LegacyReportDefinition(string title, string? sourceObject, LegacyReportKind kind, params string[] dateColumns)
            {
                Title = title;
                SourceObject = sourceObject;
                Kind = kind;
                DateColumns = dateColumns ?? Array.Empty<string>();
            }

            public string Title { get; }

            public string? SourceObject { get; }

            public LegacyReportKind Kind { get; }

            public string[] DateColumns { get; }
        }

        private enum LegacyReportKind
        {
            Table = 0,
            ClientProfile = 1
        }
    }
}