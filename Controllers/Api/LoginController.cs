using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MtpApp.Models;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public LoginController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [Route("Totaldata")]
        [HttpGet]
        public IActionResult GetTotaldata()
        {
            DataTable dt = new DataTable();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            SqlConnection conx = new SqlConnection(connectionString);
            SqlDataAdapter adp = new SqlDataAdapter(" SELECT  (SELECT COUNT(Id)from Clients)TotalClients  ,(SELECT COUNT(Id)from Employers)TotalEmployers ,(SELECT COUNT(Id)from LogBooks)TotalLogbooks ,(SELECT COUNT(Id)from Placements)TotalPlacements     ", conx);
            adp.Fill(dt);
            return Ok(dt);
        }

        [Route("loggedrecords")]
        [HttpGet]
        public IActionResult GetLoggedInRecords()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);
            var records = _context.LoginHistorys
                .Where(c => c.LoggedBy == user.FirstName + " " + user.LastName)
                .ToList()
                .OrderByDescending(c => c.Id)
                .Take(11);

            return Ok(records);
        }
    }
}

