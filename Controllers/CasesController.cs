using MtpApp.Models;
using MtpApp.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    [Authorize]
    public class CasesController : Controller
    {
        private ApplicationDbContext _context;
        public CasesController()
        {
            _context = new ApplicationDbContext();
        }

        [Route("case-management")]
        // GET: Cases
        public ActionResult Index()
        {
            var caseWorkers = _context.CaseWorkers.ToList();

            var clients = _context.Clients.ToList();

            var viewModel = new CaseViewModel()
            {
                CaseWorkers = caseWorkers,
                Clients = clients
            };

            return View(viewModel);
        }
    }
}