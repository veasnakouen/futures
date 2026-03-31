using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using MtpApp.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;

namespace MtpApp.Controllers
{
    public class EmployersController : Controller
    {
        private ApplicationDbContext _context;
        public EmployersController()
        {
            _context = new ApplicationDbContext();
        }
        // GET: Employers
        public ActionResult Index()
        {
            var viewModel = new EmployerViewModel()
            {
                EmployerDto = new EmployerDto(),
                JobCategories = _context.JobCategory.ToList()
            };
            return View(viewModel);
        }

        [Route("employers/overview")]
        public ActionResult Dashboard()
        {
            var jobsByCategory = (from c in _context.Vacancies
                                    join o in _context.JobCategory on c.JobCategoryId equals o.Id
                                    where c.Deadline >= DateTime.Today.Date
                                    group c by c.JobCategories.Name into g
                                    orderby g.Sum(c => c.PositionAvailable) descending
                                    select new JobsByCategoryViewModel
                                    {
                                        Name = g.Key,
                                        Total = g.Sum(c => c.PositionAvailable)
                                    }).ToList();

            var jobsByEmployer = (from c in _context.Vacancies
                                  join o in _context.Employers on c.EmployerId equals o.Id
                                  where c.Deadline >= DateTime.Today.Date
                                  group c by c.Employers.Name into g
                                  orderby g.Sum(c => c.PositionAvailable) descending
                                  select new JobsByEmployerViewModel
                                  {
                                      EmployerName = g.Key,
                                      Total = g.Sum(c => c.PositionAvailable)
                                  }).ToList();

            var viewModel = new JobsViewModel()
            {
                JobsByCategory = jobsByCategory,
                JobsByEmployer = jobsByEmployer
            };

            return View("Dashboard", viewModel);
        }
    }
}