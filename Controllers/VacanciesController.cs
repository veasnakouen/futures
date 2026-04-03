using Microsoft.AspNetCore.Mvc;
using MtpApp.Dtos;
using MtpApp.Models;
using MtpApp.ViewModels;
using System.Linq;

namespace MtpApp.Controllers
{
    public class VacanciesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public VacanciesController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var viewModel = new VacancyViewModel()
            {
                VacancyDto = new VacancyDto(),
                Employers = _context.Employers.ToList(),
                JobPositions = _context.JobPosition.ToList(),
                JobCategories = _context.JobCategory.ToList()
            };
            return View(viewModel);
        }
    }
}