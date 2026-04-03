using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MtpApp.Models;
using MtpApp.ViewModels;
using System.Linq;

namespace MtpApp.Controllers
{
    [Authorize]
    public class CasesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Route("case-management")]
        public IActionResult Index()
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