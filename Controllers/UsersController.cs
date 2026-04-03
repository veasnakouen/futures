using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Models;
using MtpApp.ViewModels;
using System.Linq;

namespace MtpApp.Controllers
{
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(ApplicationDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _roleManager = roleManager;
        }

        public IActionResult Index()
        {
            var users = _context.Users.Where(c => c.IsDeleted == false).ToList();
            if (User.IsInRole("Security"))
            {
                return View(users);
            }
            return RedirectToAction("NotPermission", "NotFoundMT");
        }

        public IActionResult GetUser(string id)
        {
            if (User.IsInRole("Security"))
            {
                var user = _context.Users.Include(c => c.Roles).SingleOrDefault(c => c.Id == id);

                var viewModel = new UserRoleViewModel()
                {
                    User = user,
                    Roles = _roleManager.Roles.Select(r => new Roles { RoleId = r.Id, RoleName = r.Name }).ToList()
                };

                return View("AssignRoles", viewModel);
            }
            return RedirectToAction("NotPermission", "NotFoundMT");
        }
    }
}