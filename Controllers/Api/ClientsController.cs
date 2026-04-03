using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public ClientsController(ApplicationDbContext context, IMapper mapper, IConfiguration configuration, IWebHostEnvironment env)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _env = env;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);
        private string GetConnectionString() => _configuration.GetConnectionString("DefaultConnection");
        private string GetImagesPath() => Path.Combine(_env.WebRootPath, "Images");

        [HttpGet("chart")]
        public IActionResult GetClientsChart([FromQuery] string Client)
        {
            DataSet dts = new DataSet();
            var connectionString = GetConnectionString();
            SqlConnection conx = new SqlConnection(connectionString);
            SqlCommand cmd = new SqlCommand("ChartDashBoard_Proc", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@ChartReport", Client);
            SqlDataAdapter adp = new SqlDataAdapter(cmd);
            adp.Fill(dts);
            return Ok(dts);
        }

        [HttpGet]
        public IActionResult GetClients()
        {
            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            var clients = _context.Clients
                .Where(c => c.Branch == user.Branch && c.Status == "Active")
                .ToList()
                .Select(c => _mapper.Map<Client, ClientDto>(c));

            return Ok(clients);
        }

        [HttpGet("{id}")]
        public IActionResult GetClient(int id)
        {
            var client = _context.Clients.SingleOrDefault(c => c.Id == id && c.Status == "Active");
            if (client == null)
                return NotFound();

            return Ok(_mapper.Map<Client, ClientDto>(client));
        }

        [HttpPost]
        public async Task<IActionResult> CreateClient()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var firstName = Request.Form["FirstName"].ToString();
            var lastName = Request.Form["LastName"].ToString();

            var clientInDb = _context.Clients
                .FirstOrDefault(c => c.FirstName == firstName && c.LastName == lastName);

            if (clientInDb != null)
                return BadRequest("Client already exists");

            string ImageName = "";
            string ImageNameIdCard = "";

            var httpPostedFile = Request.Form.Files.GetFile("UploadedFile");
            if (httpPostedFile != null)
            {
                ImageName = string.Concat(
                    Path.GetFileNameWithoutExtension(httpPostedFile.FileName),
                    DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss"),
                    Path.GetExtension(httpPostedFile.FileName));

                var fileSavePath = Path.Combine(GetImagesPath(), ImageName);
                using var stream = new FileStream(fileSavePath, FileMode.Create);
                await httpPostedFile.CopyToAsync(stream);
            }

            var httpPostedFileCardId = Request.Form.Files.GetFile("UploadedFileIdCard");
            if (httpPostedFileCardId != null)
            {
                ImageNameIdCard = string.Concat(
                    Path.GetFileNameWithoutExtension(httpPostedFileCardId.FileName),
                    DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss"),
                    Path.GetExtension(httpPostedFileCardId.FileName));

                var fileSavePath = Path.Combine(GetImagesPath(), ImageNameIdCard);
                using var stream = new FileStream(fileSavePath, FileMode.Create);
                await httpPostedFileCardId.CopyToAsync(stream);
            }

            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            var clientDto = new ClientDto()
            {
                Branch = user.Branch,
                ClientCode = Request.Form["ClientCode"],
                FirstName = Request.Form["FirstName"],
                LastName = Request.Form["LastName"],
                Gender = Request.Form["Gender"],
                DateOfBirth = DateTime.ParseExact(Request.Form["DateOfBirth"], "MM/dd/yyyy", null),
                ContactPhone = Request.Form["ContactPhone"],
                RelativePhone = Request.Form["RelativePhone"],
                MaritalStatus = Request.Form["MaritalStatus"],
                Email = Request.Form["Email"],
                Address = Request.Form["Address"],
                Province = Request.Form["Province"],
                Photo = ImageName,
                IdCard = ImageNameIdCard,
                CurrentSituation = Request.Form["CurrentSituation"],
                FurtherEducation = Boolean.Parse(Request.Form["FurtherEducation"]),
                Placement = Boolean.Parse(Request.Form["Placement"]),
                TrainingFromFutures = Boolean.Parse(Request.Form["TrainingFromFutures"]),
                SocialSupportRequired = Boolean.Parse(Request.Form["SocialSupportRequired"]),
                HearBy = Request.Form["HearBy"],
                ExpectedSupport = Request.Form["ExpectedSupport"],
                AspUserId = userId,
                EnrollDate = DateTime.Now,
                RegisterDate = DateTime.ParseExact(Request.Form["RegisterDate"], "MM/dd/yyyy", null),
                PlaceOfBirth = Request.Form["PlaceOfBirth"],
                Nationality = Request.Form["Nationality"],
                Citizenship = Request.Form["Citizenship"],
                Height = Request.Form["Height"],
                Weight = Request.Form["Weight"],
                SocialSupportProblem = Request.Form["SocialSupportProblem"],
                IdpoorStatus = Request.Form["IdpoorStatus"],
                IdpoorValiddate = DateTime.ParseExact(Request.Form["IdpoorValiddate"], "MM/dd/yyyy", null),
                IdpoorLevel = Request.Form["IdpoorLevel"],
                IdpoorAccountNumber = Request.Form["IdpoorAccountNumber"],
                Status = "Active"
            };

            var client = _mapper.Map<ClientDto, Client>(clientDto);

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            clientDto.Id = client.Id;

            return CreatedAtAction(nameof(GetClient), new { id = clientDto.Id }, clientDto);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateClient()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var id = int.Parse(Request.Form["id"]);
            var clientInDb = _context.Clients.SingleOrDefault(c => c.Id == id);

            if (clientInDb == null)
                return NotFound();

            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            string ImageName = clientInDb.Photo;
            string ImageNameIdCard = clientInDb.IdCard;

            var httpPostedFile = Request.Form.Files.GetFile("UploadedFile");
            if (httpPostedFile != null)
            {
                // Delete old image
                if (!string.IsNullOrEmpty(clientInDb.Photo))
                {
                    var oldImagePath = Path.Combine(GetImagesPath(), clientInDb.Photo);
                    if (System.IO.File.Exists(oldImagePath))
                        System.IO.File.Delete(oldImagePath);
                }

                ImageName = string.Concat(
                    Path.GetFileNameWithoutExtension(httpPostedFile.FileName),
                    DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss"),
                    Path.GetExtension(httpPostedFile.FileName));

                var fileSavePath = Path.Combine(GetImagesPath(), ImageName);
                using var stream = new FileStream(fileSavePath, FileMode.Create);
                await httpPostedFile.CopyToAsync(stream);
            }

            var httpPostedFileCardId = Request.Form.Files.GetFile("UploadedFileIdCard");
            if (httpPostedFileCardId != null)
            {
                ImageNameIdCard = string.Concat(
                    Path.GetFileNameWithoutExtension(httpPostedFileCardId.FileName),
                    DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss"),
                    Path.GetExtension(httpPostedFileCardId.FileName));

                var fileSavePath = Path.Combine(GetImagesPath(), ImageNameIdCard);
                using var stream = new FileStream(fileSavePath, FileMode.Create);
                await httpPostedFileCardId.CopyToAsync(stream);
            }

            var clientDto = new ClientDto()
            {
                Id = id,
                Branch = user.Branch,
                ClientCode = Request.Form["ClientCode"],
                FirstName = Request.Form["FirstName"],
                LastName = Request.Form["LastName"],
                Gender = Request.Form["Gender"],
                DateOfBirth = DateTime.ParseExact(Request.Form["DateOfBirth"], "MM/dd/yyyy", null),
                ContactPhone = Request.Form["ContactPhone"],
                RelativePhone = Request.Form["RelativePhone"],
                MaritalStatus = Request.Form["MaritalStatus"],
                Email = Request.Form["Email"],
                Address = Request.Form["Address"],
                Province = Request.Form["Province"],
                Photo = ImageName,
                IdCard = ImageNameIdCard,
                CurrentSituation = Request.Form["CurrentSituation"],
                FurtherEducation = Boolean.Parse(Request.Form["FurtherEducation"]),
                Placement = Boolean.Parse(Request.Form["Placement"]),
                TrainingFromFutures = Boolean.Parse(Request.Form["TrainingFromFutures"]),
                SocialSupportRequired = Boolean.Parse(Request.Form["SocialSupportRequired"]),
                HearBy = Request.Form["HearBy"],
                ExpectedSupport = Request.Form["ExpectedSupport"],
                AspUserId = clientInDb.AspUserId,
                EnrollDate = clientInDb.EnrollDate,
                RegisterDate = DateTime.ParseExact(Request.Form["RegisterDate"], "MM/dd/yyyy", null),
                RegisterDateNd = DateTime.ParseExact(Request.Form["RegisterDateNd"], "MM/dd/yyyy", null),
                RegisterDateRd = DateTime.ParseExact(Request.Form["RegisterDateRd"], "MM/dd/yyyy", null),
                UpdateDate = DateTime.Today,
                UpdateBy = userId,
                PlaceOfBirth = Request.Form["PlaceOfBirth"],
                Nationality = Request.Form["Nationality"],
                Citizenship = Request.Form["Citizenship"],
                Height = Request.Form["Height"],
                Weight = Request.Form["Weight"],
                SocialSupportProblem = Request.Form["SocialSupportProblem"],
                IdpoorStatus = Request.Form["IdpoorStatus"],
                IdpoorValiddate = DateTime.ParseExact(Request.Form["IdpoorValiddate"], "MM/dd/yyyy", null),
                IdpoorLevel = Request.Form["IdpoorLevel"],
                IdpoorAccountNumber = Request.Form["IdpoorAccountNumber"],
                Status = "Active"
            };

            _mapper.Map(clientDto, clientInDb);

            await _context.SaveChangesAsync();

            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteClients(int id)
        {
            var clientInDb = _context.Clients.SingleOrDefault(c => c.Id == id);

            if (clientInDb == null)
                return NotFound();

            _context.Clients.Remove(clientInDb);
            _context.SaveChanges();

            if (!string.IsNullOrEmpty(clientInDb.Photo))
            {
                var imagePath = Path.Combine(GetImagesPath(), clientInDb.Photo);
                if (System.IO.File.Exists(imagePath))
                    System.IO.File.Delete(imagePath);
            }

            return Ok(new { });
        }
    }
}

