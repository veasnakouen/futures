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

        // Legacy report views render through a shared HTML report helper in ASP.NET Core.

        [Route("clients/client-summary-report/clientCodeSearch={clientCodeSearch}/startdate={startdate}/enddate={enddate}")]
        public IActionResult ClientSummaryReport(string clientCodeSearch, string startdate, string enddate)
            => View("ClientSummaryReport");

        [Route("clients/employee-seekerlist-report/postion={postion}/startdate={startdate}/enddate={enddate}")]
        public IActionResult EmploymentSeekerListReport(string postion, string startdate, string enddate)
            => View("EmploymentSeekerListReport");

        [Route("clients/placement-summary-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult PlacementSummaryReport(string gender, string startdate, string enddate)
            => View("PlacementSummaryReport");

        [Route("clients/clients-remaining-in-placement-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult ClientsRemainingInPlacementReport(string gender, string startdate, string enddate)
            => View("ClientsRemainingInPlacement");

        [Route("clients/job-readiness-report/ontraining={ontraining}/startdate={startdate}/enddate={enddate}")]
        public IActionResult JobReadinessReport(string ontraining, string startdate, string enddate)
            => View("JobReadinessReport");

        [Route("clients/employers-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public IActionResult EmployersReport(string status, string startdate, string enddate)
            => View("EmployersReport");

        [Route("clients/job-vancancy-available-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public IActionResult VancancysReport(string status, string startdate, string enddate)
            => View("JobVancancyAvailableReport");

        [Route("clients/further-euducation-seekerList-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public IActionResult FurtherEuducationSeekerListReport(string status, string startdate, string enddate)
            => View("FurtherEuducationseekerListReport");

        [Route("clients/placement-monitoring-and-dropout-report/placement={placement}/startdate={startdate}/enddate={enddate}")]
        public IActionResult PlacementMonitoringAndDropoutReport(string placement, string startdate, string enddate)
            => View("PlacementMonitoringAndDropoutReport");

        [Route("clients/beneficiaries-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult beneficiariesReport(string gender, string startdate, string enddate)
            => View("BeneficiariesReport");

        [Route("clients/client-Referral-From-MT-Program-report/startdate={startdate}/enddate={enddate}")]
        public IActionResult clientReferralFromMTProgramReport(string startdate, string enddate)
            => View("ClientReferralFromMTProgramReport");

        [Route("clients/logbooks-report/startdate={startdate}/enddate={enddate}")]
        public IActionResult LogBooksReport(string startdate, string enddate)
            => View("LogBooksReport");

        [Route("clients/CaseManager-report/Report={Report}/startdate={startdate}/enddate={enddate}")]
        public IActionResult CaseManagerReport(string Report, string startdate, string enddate)
            => View("CaseManagerReport");

        [Route("clients/business-setup-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult BusinessSetupReport(string gender, string startdate, string enddate)
            => View("BusinessSetupReport");

        [Route("clients/businesssetupmonitoiring-Report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public IActionResult BusinessSetupMonitoringReport(string gender, string startdate, string enddate)
            => View("BusinessSetupMonitoringReport");

        [Route("clients/curriculum-vitae-by-cliend-Id-Report/cvtype={cvtype}/clientId={clientId}/Applyfor={Applyfor}")]
        public IActionResult CurriculumvitaebycliendIdReport(string cvtype, int clientId, string Applyfor)
            => View("CurriculumVitaeByClientReport");

        [Route("clients/vtc-student-report/startdate={startdate}/enddate={enddate}")]
        public IActionResult VTCstudentreport(string startdate, string enddate)
            => View("VTCstudentReport");

        [Route("clients/Client-Lookfor-bussinesss-Setup-Report/FindbusinessSetup={FindbusinessSetup}/startdate={startdate}/enddate={enddate}")]
        public IActionResult ClientLookforbussinesssSetupReport(string FindbusinessSetup, string startdate, string enddate)
            => View("ClientLookforbussinesssSetup");
    }
}
