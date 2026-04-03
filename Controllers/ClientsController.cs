using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MtpApp.Models;
using MtpApp.ViewModels;
using System;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace MtpApp.Controllers
{
    [Authorize]
    public class ClientsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public ClientsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private string GetConnectionString() => _configuration.GetConnectionString("DefaultConnection");

        // GET: Clients
        [Route("manage-clients")]
        public IActionResult Index()
        {
            var EducationReferralSources = _context.EducationReferralSources.ToList();
            var jobCategories = _context.JobCategory.ToList();
            var jobPositions = _context.JobPosition.ToList();
            var businessSetUpCategories = _context.BusinessSetUpCategories.ToList();
            var clients = _context.Clients.ToList();
            var caseWorkers = _context.CaseWorkers.ToList();
            var cases = _context.Cases.ToList();

            var viewModel = new ClientViewModel()
            {
                Clients = clients,
                EducationReferralSources = EducationReferralSources,
                JobPositions = jobPositions,
                JobCategories = jobCategories,
                BusinessSetUpCategories = businessSetUpCategories,
                CaseWorkers = caseWorkers,
                Cases = cases,
                Subjects = _context.Subjects.ToList()
            };

            return View(viewModel);
        }

        // Reports: SSRS ReportViewer is not supported in .NET 8.
        // These actions return a placeholder view until a replacement reporting solution is implemented.

        [Route("clients/client-summary-report/clientCodeSearch={clientCodeSearch}/startdate={startdate}/enddate={enddate}")]
        public IActionResult ClientSummaryReport(string clientCodeSearch, DateTime? startdate, DateTime? enddate)
            => View("ClientSummaryReport");

        [Route("clients/employee-seekerlist-report/postion={postion}/startdate={startdate}/enddate={enddate}")]
        public IActionResult EmploymentSeekerListReport(string postion, DateTime? startdate, DateTime? enddate)
            => View("EmploymentSeekerListReport");

        [Route("clients/placement-summary-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult PlacementSummaryReport(string gender, DateTime? startdate, DateTime? enddate)
            => View("PlacementSummaryReport");

        [Route("clients/clients-remaining-in-placement-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult ClientsRemainingInPlacementReport(string gender, DateTime? startdate, DateTime? enddate)
            => View("ClientsRemainingInPlacement");

        [Route("clients/job-readiness-report/ontraining={ontraining}/startdate={startdate}/enddate={enddate}")]
        public IActionResult JobReadinessReport(string ontraining, DateTime? startdate, DateTime? enddate)
            => View("JobReadinessReport");

        [Route("clients/employers-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public IActionResult EmployersReport(string status, DateTime? startdate, DateTime? enddate)
            => View("EmployersReport");

        [Route("clients/job-vancancy-available-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public IActionResult VancancysReport(string status, DateTime? startdate, DateTime? enddate)
            => View("JobVancancyAvailableReport");

        [Route("clients/further-euducation-seekerList-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public IActionResult FurtherEuducationSeekerListReport(string status, DateTime? startdate, DateTime? enddate)
            => View("FurtherEuducationseekerListReport");

        [Route("clients/placement-monitoring-and-dropout-report/placement={placement}/startdate={startdate}/enddate={enddate}")]
        public IActionResult PlacementMonitoringAndDropoutReport(string placement, DateTime? startdate, DateTime? enddate)
            => View("PlacementMonitoringAndDropoutReport");

        [Route("clients/beneficiaries-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult beneficiariesReport(string gender, DateTime? startdate, DateTime? enddate)
            => View("BeneficiariesReport");

        [Route("clients/client-Referral-From-MT-Program-report/startdate={startdate}/enddate={enddate}")]
        public IActionResult clientReferralFromMTProgramReport(DateTime? startdate, DateTime? enddate)
            => View("ClientReferralFromMTProgramReport");

        [Route("clients/logbooks-report/startdate={startdate}/enddate={enddate}")]
        public IActionResult LogBooksReport(DateTime? startdate, DateTime? enddate)
            => View("LogBooksReport");

        [Route("clients/CaseManager-report/Report={Report}/startdate={startdate}/enddate={enddate}")]
        public IActionResult CaseManagerReport(string Report, DateTime? startdate, DateTime? enddate)
            => View("SocialSupportCaseReport");

        [Route("clients/business-setup-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult BusinessSetupReport(string gender, DateTime? startdate, DateTime? enddate)
            => View("BusinessSetupReport");

        [Route("clients/businesssetupmonitoiring-Report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult BusinessSetupMonitoringReport(string gender, DateTime? startdate, DateTime? enddate)
            => View("BusinessSetupMonitoriingReport");

        [Route("clients/curriculum-vitae-by-cliend-Id-Report/cvtype={cvtype}/clientId={clientId}/Applyfor={Applyfor}")]
        public IActionResult CurriculumvitaebycliendIdReport(string cvtype, int clientId, string Applyfor)
            => View("CurriculumVitaeByClientReport");

        [Route("clients/vtc-student-report/startdate={startdate}/enddate={enddate}")]
        public IActionResult VTCstudentreport(string clientCodeSearch, DateTime? startdate, DateTime? enddate)
            => View("VTCstudentReport");

        [Route("clients/Client-Lookfor-bussinesss-Setup-Report/FindbusinessSetup={FindbusinessSetup}/startdate={startdate}/enddate={enddate}")]
        public IActionResult ClientLookforbussinesssSetupReport(string FindbusinessSetup, DateTime? startdate, DateTime? enddate)
            => View("ClientLookforbussinesssSetup");
    }
}
