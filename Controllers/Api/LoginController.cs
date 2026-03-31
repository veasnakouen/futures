using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


namespace MtpApp.Controllers.Api
{
    public class LoginController : ApiController
    {
        private ApplicationDbContext _context;

        public LoginController()
        {
            _context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        [Route("api/Login/Totaldata")]
        [HttpGet]
        public IHttpActionResult GetTotaldata()
        {
            DataTable dt = new DataTable();
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            SqlDataAdapter adp = new SqlDataAdapter(" SELECT  (SELECT COUNT(Id)from Clients)TotalClients  ,(SELECT COUNT(Id)from Employers)TotalEmployers ,(SELECT COUNT(Id)from LogBooks)TotalLogbooks ,(SELECT COUNT(Id)from Placements)TotalPlacements     ", conx);
            adp.Fill(dt);
            return Ok(dt);
        }


        [Route("api/Login/loggedrecords")]
        [HttpGet]
        public IHttpActionResult GetLoggedInRecords()
        {
            var userId = User.Identity.GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);
            var records = _context.LoginHistorys.Where(c => c.LoggedBy == user.FirstName + " " + user.LastName).ToList().OrderByDescending(c => c.Id).Take(11);

            return Ok(records);
        }
    }
}
