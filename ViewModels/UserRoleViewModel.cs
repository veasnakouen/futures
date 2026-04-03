using System.Collections.Generic;
using MtpApp.Models;

namespace MtpApp.ViewModels
{
    public class UserRoleViewModel
    {
        public ApplicationUser User { get; set; }
        public IEnumerable<Roles> Roles { get; set; } = new List<Roles>();
    }
    
    public class Roles
    {
        public string RoleId { get; set; }

        public string RoleName { get; set; }
    }
}
