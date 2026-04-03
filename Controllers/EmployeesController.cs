using Microsoft.AspNetCore.Mvc;
using MtpApp.Dtos;
using MtpApp.Models;
using MtpApp.ViewModels;
using System.Linq;

namespace MtpApp.Controllers
{
    public class EmployeesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public EmployeesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Route("employees")]
        public IActionResult Index()
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