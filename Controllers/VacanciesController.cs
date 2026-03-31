using MtpApp.Dtos;
using MtpApp.Models;
using MtpApp.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    public class VacanciesController : Controller
    {
        private ApplicationDbContext _context;
        public VacanciesController()
        {
            _context = new ApplicationDbContext();
        }
        // GET: Vacancies
        public ActionResult Index()
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