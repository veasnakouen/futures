using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Data.Entity;
using System.Web;
using System.IO;
using System.Data;
using System.Configuration;
using System.Data.SqlClient;
using System.Web.Helpers;
using System.Drawing;
using System.Threading.Tasks;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class ClientsController : ApiController
    {
        private ApplicationDbContext _context;
        public ClientsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/clients?Client={Client}
        [HttpGet]
        public IHttpActionResult GetClientsChart(string Client)
        {
            DataSet dts = new DataSet();
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conx = new SqlConnection(connectionString);
            SqlCommand cmd = new SqlCommand("ChartDashBoard_Proc", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@ChartReport", Client);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(dts);
            return Ok(dts);
        }


        //GET: /api/clients
        [HttpGet]
        public IHttpActionResult GetClients()
        {
            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            var clients = _context.Clients.Select(Mapper.Map<Client, ClientDto>).Where(c => c.Branch == user.Branch && c.Status == "Active").ToList();

            return Ok(clients);
        }

        // GET: /api/clients/{id}
        [HttpGet]
        public IHttpActionResult GetClient(int id)
        {
            var client = _context.Clients.SingleOrDefault(c => c.Id == id && c.Status == "Active");
            if (client == null)
                return NotFound();

            return Ok(Mapper.Map<Client, ClientDto>(client));
        }

        // POST: /api/clients
        [HttpPost]
        public async Task<IHttpActionResult> CreateClient()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var firstName = System.Web.HttpContext.Current.Request.Form["FirstName"];
            var lastName = System.Web.HttpContext.Current.Request.Form["LastName"];

            //check if client exists in database
            var clientInDb = _context.Clients
                .FirstOrDefault(c => c.FirstName == firstName && c.LastName == lastName);

            if (clientInDb != null)
                return BadRequest();

            string ImageName = "";
            string ImageNameIdCard = "";

            var httpPostedFile = System.Web.HttpContext.Current.Request.Files["UploadedFile"];

            if (httpPostedFile != null)
            {
                ImageName = Path.Combine(Path.GetDirectoryName(httpPostedFile.FileName)
                                       , string.Concat(Path.GetFileNameWithoutExtension(httpPostedFile.FileName)
                                       , DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss")
                                       , Path.GetExtension(httpPostedFile.FileName)
                                       ));

                var fileSavePath = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Images"), ImageName);
                httpPostedFile.SaveAs(fileSavePath);
            }

            var httpPostedFileCardId = System.Web.HttpContext.Current.Request.Files["UploadedFileIdCard"];

            if (httpPostedFileCardId != null)
            {
                ImageNameIdCard = Path.Combine(Path.GetDirectoryName(httpPostedFileCardId.FileName)
                                       , string.Concat(Path.GetFileNameWithoutExtension(httpPostedFileCardId.FileName)
                                       , DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss")
                                       , Path.GetExtension(httpPostedFileCardId.FileName)
                                       ));

                var fileSavePath = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Images"), ImageNameIdCard);
                httpPostedFileCardId.SaveAs(fileSavePath);
            }

            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            var clientDto = new ClientDto()
            {
                Branch = user.Branch,
                ClientCode = System.Web.HttpContext.Current.Request.Form["ClientCode"],
                FirstName = System.Web.HttpContext.Current.Request.Form["FirstName"],
                LastName = System.Web.HttpContext.Current.Request.Form["LastName"],
                Gender = System.Web.HttpContext.Current.Request.Form["Gender"],
                DateOfBirth = DateTime.ParseExact(System.Web.HttpContext.Current.Request.Form["DateOfBirth"], "MM/dd/yyyy", null),
                ContactPhone = System.Web.HttpContext.Current.Request.Form["ContactPhone"],
                RelativePhone = System.Web.HttpContext.Current.Request.Form["RelativePhone"],
                MaritalStatus = System.Web.HttpContext.Current.Request.Form["MaritalStatus"],
                Email = System.Web.HttpContext.Current.Request.Form["Email"],
                Address = System.Web.HttpContext.Current.Request.Form["Address"],
                Province = System.Web.HttpContext.Current.Request.Form["Province"],
                Photo = ImageName,
                IdCard = ImageNameIdCard,
                CurrentSituation = System.Web.HttpContext.Current.Request.Form["CurrentSituation"],
                FurtherEducation = Boolean.Parse(HttpContext.Current.Request.Form["FurtherEducation"]),
                Placement = Boolean.Parse(HttpContext.Current.Request.Form["Placement"]),
                TrainingFromFutures = Boolean.Parse(HttpContext.Current.Request.Form["TrainingFromFutures"]),
                SocialSupportRequired = Boolean.Parse(HttpContext.Current.Request.Form["SocialSupportRequired"]),
                HearBy = System.Web.HttpContext.Current.Request.Form["HearBy"],
                ExpectedSupport = System.Web.HttpContext.Current.Request.Form["ExpectedSupport"],
                AspUserId = userId,
                EnrollDate = DateTime.Now,

                RegisterDate = DateTime.ParseExact(System.Web.HttpContext.Current.Request.Form["RegisterDate"], "MM/dd/yyyy", null),

                //RegisterDateNd = DateTime.ParseExact(HttpContext.Current.Request.Form["RegisterDateNd"], "MM/dd/yyyy", null),
                //RegisterDateRd = DateTime.ParseExact(HttpContext.Current.Request.Form["RegisterDateRd"], "MM/dd/yyyy", null),

                PlaceOfBirth = System.Web.HttpContext.Current.Request.Form["PlaceOfBirth"],
                Nationality = System.Web.HttpContext.Current.Request.Form["Nationality"],
                Citizenship = System.Web.HttpContext.Current.Request.Form["Citizenship"],
                Height = System.Web.HttpContext.Current.Request.Form["Height"],
                Weight = System.Web.HttpContext.Current.Request.Form["Weight"],
                SocialSupportProblem = System.Web.HttpContext.Current.Request.Form["SocialSupportProblem"],
                IdpoorStatus = System.Web.HttpContext.Current.Request.Form["IdpoorStatus"],
                IdpoorValiddate = DateTime.ParseExact(System.Web.HttpContext.Current.Request.Form["IdpoorValiddate"], "MM/dd/yyyy", null),
                IdpoorLevel = System.Web.HttpContext.Current.Request.Form["IdpoorLevel"],
                IdpoorAccountNumber = System.Web.HttpContext.Current.Request.Form["IdpoorAccountNumber"],
                Status = "Active"
            };

            var client = Mapper.Map<ClientDto, Client>(clientDto);

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            clientDto.Id = client.Id;

            return Created(new Uri(Request.RequestUri + "/" + clientDto.Id), clientDto);
        }

        // PUT: /api/clients/{id}
        [HttpPut]
        public async Task<IHttpActionResult> UpdateClient()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            string ImageName = "";
            string ImageNameIdCard = "";


            var httpPostedFile = HttpContext.Current.Request.Files["UploadedFile"];

            if (httpPostedFile != null)
            {

                ImageName = Path.Combine(Path.GetDirectoryName(httpPostedFile.FileName)
                                       , string.Concat(Path.GetFileNameWithoutExtension(httpPostedFile.FileName)
                                       , DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss")
                                       , Path.GetExtension(httpPostedFile.FileName)
                                       ));

                var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), ImageName);


                httpPostedFile.SaveAs(fileSavePath);

                var id = int.Parse(HttpContext.Current.Request.Form["id"]);

                var clientInDb = _context.Clients.SingleOrDefault(c => c.Id == id);

                if (clientInDb == null)
                    return NotFound();

                //Delete Old Image
                var oldImagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), clientInDb.Photo);

                if (File.Exists(oldImagePath))
                {
                    File.Delete(oldImagePath);
                }

                var userId = User.Identity.GetUserId();

                var user = _context.Users.SingleOrDefault(c => c.Id == userId);


                var httpPostedFileCardId = HttpContext.Current.Request.Files["UploadedFileIdCard"];

                if (httpPostedFileCardId != null)
                {
                    ImageNameIdCard = Path.Combine(Path.GetDirectoryName(httpPostedFileCardId.FileName)
                                           , string.Concat(Path.GetFileNameWithoutExtension(httpPostedFileCardId.FileName)
                                           , DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss")
                                           , Path.GetExtension(httpPostedFileCardId.FileName)
                                           ));

                    var fileSavePathIdCard = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), ImageNameIdCard);
                    httpPostedFileCardId.SaveAs(fileSavePathIdCard);
                }

                var imageCIdCard = "";
                if (httpPostedFileCardId != null)
                {
                    imageCIdCard = ImageNameIdCard;
                }
                else
                {
                    imageCIdCard = clientInDb.IdCard;
                }

                var clientDto = new ClientDto()
                {
                    Id = id,
                    Branch = user.Branch,
                    ClientCode = HttpContext.Current.Request.Form["ClientCode"],
                    FirstName = HttpContext.Current.Request.Form["FirstName"],
                    LastName = HttpContext.Current.Request.Form["LastName"],
                    Gender = HttpContext.Current.Request.Form["Gender"],
                    DateOfBirth = DateTime.ParseExact(HttpContext.Current.Request.Form["DateOfBirth"], "MM/dd/yyyy", null),
                    ContactPhone = HttpContext.Current.Request.Form["ContactPhone"],
                    RelativePhone = HttpContext.Current.Request.Form["RelativePhone"],
                    MaritalStatus = HttpContext.Current.Request.Form["MaritalStatus"],
                    Email = HttpContext.Current.Request.Form["Email"],
                    Address = HttpContext.Current.Request.Form["Address"],
                    Province = HttpContext.Current.Request.Form["Province"],
                    Photo = ImageName,
                    IdCard = imageCIdCard,
                    CurrentSituation = HttpContext.Current.Request.Form["CurrentSituation"],
                    FurtherEducation = Boolean.Parse(HttpContext.Current.Request.Form["FurtherEducation"]),
                    Placement = Boolean.Parse(HttpContext.Current.Request.Form["Placement"]),
                    TrainingFromFutures = Boolean.Parse(HttpContext.Current.Request.Form["TrainingFromFutures"]),
                    SocialSupportRequired = Boolean.Parse(HttpContext.Current.Request.Form["SocialSupportRequired"]),
                    HearBy = HttpContext.Current.Request.Form["HearBy"],
                    ExpectedSupport = HttpContext.Current.Request.Form["ExpectedSupport"],
                    AspUserId = clientInDb.AspUserId,
                    EnrollDate = clientInDb.EnrollDate,
                    RegisterDate = DateTime.ParseExact(HttpContext.Current.Request.Form["RegisterDate"], "MM/dd/yyyy", null),
                    
                    RegisterDateNd = DateTime.ParseExact(HttpContext.Current.Request.Form["RegisterDateNd"], "MM/dd/yyyy", null),
                    RegisterDateRd = DateTime.ParseExact(HttpContext.Current.Request.Form["RegisterDateRd"], "MM/dd/yyyy", null),
                    
                    UpdateDate = DateTime.Today,
                    UpdateBy = userId,
                    PlaceOfBirth = HttpContext.Current.Request.Form["PlaceOfBirth"],
                    Nationality = HttpContext.Current.Request.Form["Nationality"],
                    Citizenship = HttpContext.Current.Request.Form["Citizenship"],
                    Height = HttpContext.Current.Request.Form["Height"],
                    Weight = HttpContext.Current.Request.Form["Weight"],
                    SocialSupportProblem = HttpContext.Current.Request.Form["SocialSupportProblem"],
                    IdpoorStatus = HttpContext.Current.Request.Form["IdpoorStatus"],
                    IdpoorValiddate = DateTime.ParseExact(HttpContext.Current.Request.Form["IdpoorValiddate"], "MM/dd/yyyy", null),
                    IdpoorLevel = HttpContext.Current.Request.Form["IdpoorLevel"],
                    IdpoorAccountNumber = HttpContext.Current.Request.Form["IdpoorAccountNumber"],
                    Status = "Active"
                };

                Mapper.Map(clientDto, clientInDb);

                await _context.SaveChangesAsync();
            }
            else
            {
                var id = int.Parse(HttpContext.Current.Request.Form["id"]);

                var clientInDb = _context.Clients.SingleOrDefault(c => c.Id == id);

                if (clientInDb == null)
                    return NotFound();

                var userId = User.Identity.GetUserId();

                var user = _context.Users.SingleOrDefault(c => c.Id == userId);

                var httpPostedFileCardId = HttpContext.Current.Request.Files["UploadedFileIdCard"];

                if (httpPostedFileCardId != null)
                {
                    ImageNameIdCard = Path.Combine(Path.GetDirectoryName(httpPostedFileCardId.FileName)
                                           , string.Concat(Path.GetFileNameWithoutExtension(httpPostedFileCardId.FileName)
                                           , DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss")
                                           , Path.GetExtension(httpPostedFileCardId.FileName)
                                           ));

                    var fileSavePathIdCard = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), ImageNameIdCard);
                    httpPostedFileCardId.SaveAs(fileSavePathIdCard);
                }

                var imageCIdCard = "";
                if (httpPostedFileCardId != null)
                {
                    imageCIdCard = ImageNameIdCard;
                }
                else
                {
                    imageCIdCard = clientInDb.IdCard;
                }

                var clientDto = new ClientDto()
                {
                    Id = id,
                    Branch = user.Branch,
                    ClientCode = HttpContext.Current.Request.Form["ClientCode"],
                    FirstName = HttpContext.Current.Request.Form["FirstName"],
                    LastName = HttpContext.Current.Request.Form["LastName"],
                    Gender = HttpContext.Current.Request.Form["Gender"],
                    DateOfBirth = DateTime.ParseExact(HttpContext.Current.Request.Form["DateOfBirth"], "MM/dd/yyyy", null),
                    ContactPhone = HttpContext.Current.Request.Form["ContactPhone"],
                    RelativePhone = HttpContext.Current.Request.Form["RelativePhone"],
                    MaritalStatus = HttpContext.Current.Request.Form["MaritalStatus"],
                    Email = HttpContext.Current.Request.Form["Email"],
                    Address = HttpContext.Current.Request.Form["Address"],
                    Province = HttpContext.Current.Request.Form["Province"],
                    Photo = clientInDb.Photo,
                    IdCard = imageCIdCard,
                    CurrentSituation = HttpContext.Current.Request.Form["CurrentSituation"],
                    FurtherEducation = Boolean.Parse(HttpContext.Current.Request.Form["FurtherEducation"]),
                    Placement = Boolean.Parse(HttpContext.Current.Request.Form["Placement"]),
                    TrainingFromFutures = Boolean.Parse(HttpContext.Current.Request.Form["TrainingFromFutures"]),
                    SocialSupportRequired = Boolean.Parse(HttpContext.Current.Request.Form["SocialSupportRequired"]),
                    HearBy = HttpContext.Current.Request.Form["HearBy"],
                    ExpectedSupport = HttpContext.Current.Request.Form["ExpectedSupport"],
                    AspUserId = clientInDb.AspUserId,
                    EnrollDate = clientInDb.EnrollDate,
                    RegisterDate = DateTime.ParseExact(HttpContext.Current.Request.Form["RegisterDate"], "MM/dd/yyyy", null),

                    RegisterDateNd = DateTime.ParseExact(HttpContext.Current.Request.Form["RegisterDateNd"], "MM/dd/yyyy", null),
                    RegisterDateRd = DateTime.ParseExact(HttpContext.Current.Request.Form["RegisterDateRd"], "MM/dd/yyyy", null),

                    UpdateDate = DateTime.Today,
                    UpdateBy = userId,
                    PlaceOfBirth = HttpContext.Current.Request.Form["PlaceOfBirth"],
                    Nationality = HttpContext.Current.Request.Form["Nationality"],
                    Citizenship = HttpContext.Current.Request.Form["Citizenship"],
                    Height = HttpContext.Current.Request.Form["Height"],
                    Weight = HttpContext.Current.Request.Form["Weight"],
                    SocialSupportProblem = HttpContext.Current.Request.Form["SocialSupportProblem"],
                    IdpoorStatus = HttpContext.Current.Request.Form["IdpoorStatus"],
                    IdpoorValiddate = DateTime.ParseExact(HttpContext.Current.Request.Form["IdpoorValiddate"], "MM/dd/yyyy", null),
                    IdpoorLevel = HttpContext.Current.Request.Form["IdpoorLevel"],
                    IdpoorAccountNumber = HttpContext.Current.Request.Form["IdpoorAccountNumber"],
                    Status = "Active"
                };

                if (clientInDb == null)
                    return NotFound();

                Mapper.Map(clientDto, clientInDb);

                await _context.SaveChangesAsync();
            }

            return Ok(new { });
        }

        [HttpDelete]
        public IHttpActionResult DeleteClients(int id)
        {
            var clientInDb = _context.Clients.SingleOrDefault(c => c.Id == id);

            if (clientInDb == null)
                return NotFound();

            _context.Clients.Remove(clientInDb);
            _context.SaveChanges();

            var imagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), clientInDb.Photo);

            if (File.Exists(imagePath))
            {
                File.Delete(imagePath);
            }

            return Ok(new { });
        }
    }
}
