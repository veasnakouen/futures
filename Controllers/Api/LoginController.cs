using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MtpApp.Dtos;
using MtpApp.Models;
using System.Collections.Generic;
using System.Data;
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
            var results = new List<ChartDto>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using var conx = new SqlConnection(connectionString);
            using var cmd = new SqlCommand(
                "SELECT 'Clients' AS Label, COUNT(Id) AS Value FROM Clients " +
                "UNION ALL SELECT 'Employers', COUNT(Id) FROM Employers " +
                "UNION ALL SELECT 'LogBooks', COUNT(Id) FROM LogBooks " +
                "UNION ALL SELECT 'Placements', COUNT(Id) FROM Placements",
                conx);

            try
            {
                conx.Open();
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    results.Add(new ChartDto
                    {
                        Label = reader.IsDBNull(0) ? string.Empty : reader.GetString(0),
                        Value = reader.IsDBNull(1) ? 0 : reader.GetInt32(1)
                    });
                }
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch totals.", detail = ex.Message });
            }

            return Ok(results);
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

