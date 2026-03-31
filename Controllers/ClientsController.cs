using Microsoft.Reporting.WebForms;
using MtpApp.Dtos;
using MtpApp.Models;
using MtpApp.ViewModels;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace MtpApp.Controllers
{
    [Authorize]
    public class ClientsController : Controller
    {
        private ApplicationDbContext _context;
        public ClientsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: Clients
        [Route("manage-clients")]
        public ActionResult Index()
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
        DataTable ds = new DataTable();
        //client-summary-report
        [Route("clients/client-summary-report/clientCodeSearch={clientCodeSearch}/startdate={startdate}/enddate={enddate}")]
        public ActionResult ClientSummaryReport(string clientCodeSearch, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("Client_summary_proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@clientCodeSearch", clientCodeSearch);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\ClientSummaryReport.rdlc";
            reportViewer.LocalReport.DisplayName = "Client-summary-report" + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            ReportParameter[] rptParamter = new ReportParameter[]
            {
                new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("ClientSummaryReport");
        }

        //employee-seekerlist-report
        [Route("clients/employee-seekerlist-report/postion={postion}/startdate={startdate}/enddate={enddate}")]
        public ActionResult EmploymentSeekerListReport(string postion, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("EmploymentSeekerList_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@Position", postion);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\EmployeeSeekerListreport.rdlc";
            reportViewer.LocalReport.DisplayName = "Employee-seekerlist-report" + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            if (startdate != null && enddate != null)
            {
                ReportParameter[] rptParamter = new ReportParameter[]
                {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
                };
                reportViewer.LocalReport.SetParameters(rptParamter);
            }
            else
            {
                ReportParameter[] rptParamter = new ReportParameter[]
                {
                    new ReportParameter("StartDate", "Nodata"),
                    new ReportParameter("EndDate", "Nodata")
                };
                reportViewer.LocalReport.SetParameters(rptParamter);
            };
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("EmploymentSeekerListReport");
        }


        //placement-summary-report
        [Route("clients/placement-summary-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public ActionResult PlacementSummaryReport(string gender, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("placement_Summary_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@Gender", gender);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\PlacementSummaryReport.rdlc";
            reportViewer.LocalReport.DisplayName = "Placement-summary-report" + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            if (startdate != null && enddate != null)
            {
                ReportParameter[] rptParamter = new ReportParameter[]
                {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
                };
                reportViewer.LocalReport.SetParameters(rptParamter);
            }
            else
            {
                ReportParameter[] rptParamter = new ReportParameter[]
                {
                    new ReportParameter("StartDate", "Nodata"),
                    new ReportParameter("EndDate", "Nodata")
                };
                reportViewer.LocalReport.SetParameters(rptParamter);
            };
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("PlacementSummaryReport");
        }

        //clients-remaining-in-placement-report
        [Route("clients/clients-remaining-in-placement-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public ActionResult ClientsRemainingInPlacementReport(string gender, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("clientsRemainingInPlacement_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@gender", gender);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\ClientsRemainingInPlacementReport.rdlc";
            reportViewer.LocalReport.DisplayName = "Clients-remaining-in-placement-report" + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            if (startdate != null && enddate != null)
            {
                ReportParameter[] rptParamter = new ReportParameter[]
                {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
                };
                reportViewer.LocalReport.SetParameters(rptParamter);
            }
            else
            {
                ReportParameter[] rptParamter = new ReportParameter[]
                {
                    new ReportParameter("StartDate", "Nodata"),
                    new ReportParameter("EndDate", "Nodata")
                };
                reportViewer.LocalReport.SetParameters(rptParamter);
            };
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("ClientsRemainingInPlacement");
        }


        //job-readiness-report/
        [Route("clients/job-readiness-report/ontraining={ontraining}/startdate={startdate}/enddate={enddate}")]
        public ActionResult JobReadinessReport(string ontraining, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("JobReadiness_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@OnTraining", ontraining);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\JobReadinessReport.rdlc";
            reportViewer.LocalReport.DisplayName = "Job-readiness-report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));

            string MonitorDate = "";
            if (ontraining == "Training seeker list")
            {
                MonitorDate = "Open Date";
            }
            else if (ontraining == "Ongoing")
            {
                MonitorDate = "Monitor Date";
            }
            else if (ontraining == "Completed")
            {
                MonitorDate = "Monitor Date";
            }
            else 
            {
                MonitorDate = "Date";
            }
            ReportParameter[] rptParamter = new ReportParameter[]
            {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("Ontraining", ontraining),
                    new ReportParameter("MonitorDate", MonitorDate)
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("JobReadinessReport");
        }

        //employers-report/
        [Route("clients/employers-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public ActionResult EmployersReport(string status, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
                status = "Open";
            }
            SqlConnection conx = new SqlConnection(connectionString);
            ////SqlDataAdapter adp = new SqlDataAdapter("SELECT * FROM EmployersReport where CorporateDate >= '2010-06-19'", conx);
            //SqlDataAdapter adp = new SqlDataAdapter(" SELECT * FROM dbo.EmployersReport where  [status] = '" + status + "' and CAST(CorporateDate as Date) >= '" + startdate.Value.ToString("yyyy/MM/dd") + "' and  CAST(CorporateDate as Date) <= '" + enddate.Value.ToString("yyyy/MM/dd") + "' ORDER BY id,CorporateDate,[status]", conx);
            //adp.Fill(ds);

            SqlCommand cmd = new SqlCommand("Employers_proc_report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@Employers", status);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);


            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\EmployersReport.rdlc";
            reportViewer.LocalReport.DisplayName = "Employers-report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            ReportParameter[] rptParamter = new ReportParameter[]
            {
                new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("EmployersReport");
        }

        //job-vancancy-available-report/
        [Route("clients/job-vancancy-available-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public ActionResult VancancysReport(string status, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
                status = "Active";
            }
            SqlConnection conx = new SqlConnection(connectionString);
            SqlCommand cmd = new SqlCommand("Jobvancancyavailable_proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@startdate", startdate);
            cmd.Parameters.AddWithValue("@enddate", enddate);
            cmd.Parameters.AddWithValue("@status", status);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\JobVancancyAvailable.rdlc";
            reportViewer.LocalReport.DisplayName = "Job-vancancy-available-report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            ReportParameter[] rptParamter = new ReportParameter[]
            {
                new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy")),
                new ReportParameter("Status", status)
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("JobVancancyAvailableReport");
        }

        //further-euducation-seekerList-report/
        [Route("clients/further-euducation-seekerList-report/status={status}/startdate={startdate}/enddate={enddate}")]
        public ActionResult FurtherEuducationSeekerListReport(string status, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
                status = "Active";
            }
            SqlConnection conx = new SqlConnection(connectionString);
            //SqlDataAdapter adp = new SqlDataAdapter("SELECT * FROM EmployersReport where CorporateDate >= '2010-06-19'", conx);
            //SqlDataAdapter adp = new SqlDataAdapter("SELECT * FROM dbo.FurtherEuducationseekerListReport where  CAST(ReferralDate as Date) >= '" + startdate.Value.ToString("yyyy/MM/dd") + "' and  CAST(ReferralDate as Date) <= '" + enddate.Value.ToString("yyyy/MM/dd") + "' ORDER BY id,ReferralDate", conx);
            //adp.Fill(ds);
            SqlCommand cmd = new SqlCommand("furthereuducationseekerList_proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@startdate", startdate);
            cmd.Parameters.AddWithValue("@enddate", enddate);
            cmd.Parameters.AddWithValue("@status", status);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\FurtherEuducationseekerListReport.rdlc";
            reportViewer.LocalReport.DisplayName = "further-euducation-seekerList-Report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            ReportParameter[] rptParamter = new ReportParameter[]
            {
                new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy")),
              
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("FurtherEuducationseekerListReport");
        }

        //placement-monitoring-and-dropout-report/
        [Route("clients/placement-monitoring-and-dropout-report/placement={placement}/startdate={startdate}/enddate={enddate}")]
        public ActionResult PlacementMonitoringAndDropoutReport(string placement, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("PlacementMonitoringAndDropout_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@Placement", placement);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\PlacementMonitoringAndDropoutReport.rdlc";
            reportViewer.LocalReport.DisplayName = "Placement-monitoring-Report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));

            ReportParameter[] rptParamter = new ReportParameter[]
            {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("Placement", placement),
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("PlacementMonitoringAndDropoutReport");
        }

        //beneficiaries-report/
        [Route("clients/beneficiaries-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public ActionResult beneficiariesReport(string gender, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("Beneficiaries_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@Gender", gender);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\BeneficiariesReport.rdlc";
            reportViewer.LocalReport.DisplayName = "Dependents-Report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));

            ReportParameter[] rptParamter = new ReportParameter[]
            {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
                    //new ReportParameter("Gender", gender),
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("BeneficiariesReport");
        }

        //client-Referral-From-MT-Program-report/
        [Route("clients/client-Referral-From-MT-Program-report/startdate={startdate}/enddate={enddate}")]
        public ActionResult clientReferralFromMTProgramReport( DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("clientReferralFromMTProgram_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@ClientReferralId", "");
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\ClientReferralFromMTProgramReport.rdlc";
            reportViewer.LocalReport.DisplayName = "client-Referral-Report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));

            ReportParameter[] rptParamter = new ReportParameter[]
            {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
                  
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("ClientReferralFromMTProgramReport");
        }

        //logbooks-report/
        [Route("clients/logbooks-report/startdate={startdate}/enddate={enddate}")]
        public ActionResult LogBooksReport(DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("LogBook_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\LogBookReport.rdlc";
            reportViewer.LocalReport.DisplayName = "Logbooks-report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));

            ReportParameter[] rptParamter = new ReportParameter[]
            {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("LogBooksReport");
        }

        //clients/CaseManager-report/
        [Route("clients/CaseManager-report/Report={Report}/startdate={startdate}/enddate={enddate}")]
        public ActionResult CaseManagerReport(string Report, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("CaseManager_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@Report", Report);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\SocialSupportCaseReport.rdlc";
            reportViewer.LocalReport.DisplayName = "CaseManager-report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));

            ReportParameter[] rptParamter = new ReportParameter[]
            {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("Report", Report)
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.EnableHyperlinks= true;
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("SocialSupportCaseReport");
        }

        //clients/business-setup-report/
        [Route("clients/business-setup-report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public ActionResult BusinessSetupReport(string gender, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("BusinessSetUp_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@Gender", gender);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\BusinessSetUpReport.rdlc";
            reportViewer.LocalReport.DisplayName = "business-setup-report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));

            ReportParameter[] rptParamter = new ReportParameter[]
            {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy")),
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.EnableHyperlinks = true;
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("BusinessSetupReport");
        }

        //clients/BusinessSetupMonitoiring-Report/
        [Route("clients/businesssetupmonitoiring-Report/gender={gender}/startdate={startdate}/enddate={enddate}")]
        public ActionResult BusinessSetupMonitoringReport(string gender, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("BusinessSetupMonitoiring_proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@Gender", gender);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\Businesssetupmonitoiring.rdlc";
            reportViewer.LocalReport.DisplayName = "BusinessSetupMonitoiring-Report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));

            ReportParameter[] rptParamter = new ReportParameter[]
            {
                    new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                    new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy")),
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            //reportViewer.LocalReport.EnableHyperlinks = true;
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("BusinessSetupMonitoriingReport");
        }

        //clients/curriculum-vitae-by-cliend-id-report/
        [Route("clients/curriculum-vitae-by-cliend-Id-Report/cvtype={cvtype}/clientId={clientId}/Applyfor={Applyfor}")]
        public ActionResult CurriculumvitaebycliendIdReport(string cvtype, int clientId,string Applyfor)
        {

            if (Applyfor == "yes")
            {
                Applyfor = @"Reports\CurriculumVitaeByClientReportApplyfor.rdlc";
            }else
            {
                Applyfor = @"Reports\CurriculumVitaeByClientReport.rdlc";
            }

            DataSet Dse = new DataSet();
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            ////Using store prodecure
            SqlCommand cmd = new SqlCommand("Curriculumvitaebycliend_proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Cvtype", cvtype);
            cmd.Parameters.AddWithValue("@ClientId", clientId);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(Dse);

            if (cvtype == "Image")
            {

                try
                {
                    var imagePath = Dse.Tables[0].Rows[0]["Photo"];
                    var imagePathIdCard = Dse.Tables[0].Rows[0]["IdCard"];
                    reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + Applyfor;
                    reportViewer.LocalReport.DisplayName = Dse.Tables[0].Rows[0]["lastName"] + " " + Dse.Tables[0].Rows[0]["firstName"] + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt") + " CV";
                    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", Dse.Tables[0]));
                    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Datalanguage", Dse.Tables[1]));
                    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataJobExpectation", Dse.Tables[2]));
                    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataEducatioin", Dse.Tables[3]));
                    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataComputerSkill", Dse.Tables[4]));
                    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataJobExperience", Dse.Tables[5]));
                    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataReference", Dse.Tables[6]));
                    reportViewer.LocalReport.EnableExternalImages = true;
                    string path = new Uri(Server.MapPath("~/Images/" + imagePath + "")).AbsoluteUri;
                    var parameter = new ReportParameter[1];
                    parameter[0] = new ReportParameter("Image", path);

                    string pathIdcard = new Uri(Server.MapPath("~/Images/" + imagePathIdCard + "")).AbsoluteUri;
                    var parameterIdcard = new ReportParameter[1];
                    parameterIdcard[0] = new ReportParameter("ImageIdCard", pathIdcard);
                    reportViewer.LocalReport.SetParameters(parameter);
                    reportViewer.LocalReport.SetParameters(parameterIdcard);
                    reportViewer.LocalReport.Refresh();
                    ViewBag.ReportViewer = reportViewer;
                    return View("CurriculumVitaeByClientReport");
                }
                catch
                {
                    //Exception e   var message = e;
                    return RedirectToAction("NotFoundPage", "NotFoundMT");
                }  
            }
            else
            {
                var imagePath = "";
                var imagePathIdCard = Dse.Tables[0].Rows[0]["IdCard"];
                reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + Applyfor;
                reportViewer.LocalReport.DisplayName = Dse.Tables[0].Rows[0]["lastName"] + " " + Dse.Tables[0].Rows[0]["firstName"] + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt") + " CV";
                reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", Dse.Tables[0]));
                reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Datalanguage", Dse.Tables[1]));
                reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataJobExpectation", Dse.Tables[2]));
                reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataEducatioin", Dse.Tables[3]));
                reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataComputerSkill", Dse.Tables[4]));
                reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataJobExperience", Dse.Tables[5]));
                reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataReference", Dse.Tables[6]));
                reportViewer.LocalReport.EnableExternalImages = true;
                string path = new Uri(Server.MapPath("~/Images/" + imagePath + "")).AbsoluteUri;
                var parameter = new ReportParameter[1];
                parameter[0] = new ReportParameter("Image", path);

                string pathIdcard = new Uri(Server.MapPath("~/Images/" + imagePathIdCard + "")).AbsoluteUri;
                var parameterIdcard = new ReportParameter[1];
                parameterIdcard[0] = new ReportParameter("ImageIdCard", pathIdcard);
                reportViewer.LocalReport.SetParameters(parameter);
                reportViewer.LocalReport.SetParameters(parameterIdcard);

                reportViewer.LocalReport.SetParameters(parameter);
                reportViewer.LocalReport.Refresh();
                ViewBag.ReportViewer = reportViewer;
                return View("CurriculumVitaeByClientReport");
            }

        }

        //vtc-student-report  this report is using report Client_summary
        [Route("clients/vtc-student-report/startdate={startdate}/enddate={enddate}")]
        public ActionResult VTCstudentreport(string clientCodeSearch, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("Client_summary_proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@clientCodeSearch", "VTC");
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\VtcStudentlReport.rdlc";
            reportViewer.LocalReport.DisplayName = " VTC-student-report " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            ReportParameter[] rptParamter = new ReportParameter[]
            {
                new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("VTCstudentReport");
        }

        //-Client Lookfor Setup-report  this report is using report Client_summary
        [Route("clients/Client-Lookfor-bussinesss-Setup-Report/FindbusinessSetup={FindbusinessSetup}/startdate={startdate}/enddate={enddate}")]
        public ActionResult ClientLookforbussinesssSetupReport(string FindbusinessSetup, DateTime? startdate, DateTime? enddate)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            //reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Percentage(100);
            reportViewer.Height = Unit.Percentage(100);
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            if (startdate == null && enddate == null)
            {
                startdate = DateTime.Today;
                enddate = DateTime.Today;
            }
            SqlCommand cmd = new SqlCommand("ClientLookforbussinesssSetupt_Proc_Report", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startdate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@EndDate", enddate.Value.ToString("yyyy/MM/dd"));
            cmd.Parameters.AddWithValue("@FindbusinessSetup", FindbusinessSetup);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(ds);
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\ClientLookforbussinesssSetupReport.rdlc";
            reportViewer.LocalReport.DisplayName = " ClientLookforbussinesssSetup " + startdate.Value.ToString("yyyy/MM/dd") + " to " + enddate.Value.ToString("yyyy/MM/dd") + " D: " + DateTime.Now.ToString("yyyy-MMM-dd hh:mm:ss tt");
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", ds));
            ReportParameter[] rptParamter = new ReportParameter[]
            {
                new ReportParameter("StartDate", startdate.Value.ToString("MM/dd/yyyy")),
                new ReportParameter("EndDate", enddate.Value.ToString("MM/dd/yyyy"))
            };
            reportViewer.LocalReport.SetParameters(rptParamter);
            reportViewer.LocalReport.Refresh();
            ViewBag.ReportViewer = reportViewer;
            return View("ClientLookforbussinesssSetup");
        }
    }
}