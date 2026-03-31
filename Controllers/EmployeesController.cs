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
    public class EmployeesController : Controller
    {
        private ApplicationDbContext _context;

        public EmployeesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: Employees
        [Route("employees")]
        public ActionResult Index()
        {
            var positions = _context.Positions.ToList();
            var departments = _context.Departments.ToList();

            var viewModel = new EmployeeViewModel()
            {
                EmployeeDto = new EmployeeDto(),
                Departments = departments,
                Positions = positions
            };

            return View(viewModel);
        }
    }
}