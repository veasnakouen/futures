using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MtpApp.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;

namespace MtpApp.ViewModels
{
    public class UserRoleViewModel
    {
        //var roleStore = new RoleStore<IdentityRole>(new ApplicationDbContext());
        //var roleManager = new RoleManager<IdentityRole>(roleStore);
        //await roleManager.CreateAsync(new IdentityRole("Ticket System"));
        public ApplicationUser User { get; set; }
        public RoleManager<IdentityRole> Role { get; set; }
    }
    
    public class Roles
    {
        public string RoleId { get; set; }

        public string RoleName { get; set; }
    }
}
