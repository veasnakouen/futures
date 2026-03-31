using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Web;
using System.Threading.Tasks;

namespace MtpApp.Controllers.Api
{
     [Authorize]
    public class RolesController : ApiController
    {
        private ApplicationDbContext _context;
        private UserManager<ApplicationUser> _userManager;
        public RolesController()
        {
            _context = new ApplicationDbContext();
            var store = new UserStore<ApplicationUser>(_context);
            _userManager = new UserManager<ApplicationUser>(store);
        }

        [HttpDelete]
        [Route("api/users/{userId}/roles/{roleName}")]
        public async Task<IHttpActionResult> RemoveFromRole(string userId, string roleName)
        {
            try
            {
                //var roleStore = new RoleStore<IdentityRole>(new ApplicationDbContext());
                //var roleManager = new RoleManager<IdentityRole>(roleStore);
                //await _userManager.RemoveFromRoleAsync(userId, roleName);

                var role = _context.Roles.SingleOrDefault(c => c.Name == roleName);

                await _context.Database.ExecuteSqlCommandAsync("DELETE FROM AspNetUserRoles WHERE UserId='" + userId + "' AND RoleId='" + role.Id + "'");
                _context.SaveChanges();

                return Ok(new { });
            }
            catch (Exception)
            {
                return BadRequest();
                throw;
            }
        }

        [HttpPost]
        [Route("api/users/{userId}/roles/{roleName}")]
        public async Task<IHttpActionResult> AddToRole(string userId, string roleName)
        {
            //var roleStore = new RoleStore<IdentityRole>(new ApplicationDbContext());
            //var roleManager = new RoleManager<IdentityRole>(roleStore);
            await _userManager.AddToRoleAsync(userId, roleName);
            return Ok(new { });
        }
    }
}
