using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using MtpApp.ViewModels;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;

namespace MtpApp.Controllers
{
    public class UsersController : Controller
    {
        private ApplicationDbContext _context;
        public UsersController()
        {
            _context = new ApplicationDbContext();
        }
        // GET: Users
        //Check Security login

        public ActionResult Index()
        
       {
           var users = _context.Users.Where(c => c.IsDeleted == false).ToList();
           if (User.IsInRole("Security"))
           {
               return View(users);          
           }
           return RedirectToAction("NotPermission", "NotFoundMT");       
        }
        
        // GET: /users/{id}
        public ActionResult GetUser(string id)
        {
            if (User.IsInRole("Security"))
            {
                var roleStore = new RoleStore<IdentityRole>(new ApplicationDbContext());
                var roleManager = new RoleManager<IdentityRole>(roleStore);

                var user = _context.Users.Include(c => c.Roles).SingleOrDefault(c => c.Id == id);

                var roles = roleManager;

                var viewModel = new UserRoleViewModel()
                {
                    User = user,
                    Role = roles
                };

                return View("AssignRoles", viewModel);
            }
            return RedirectToAction("NotPermission", "NotFoundMT");
        }
    }
}