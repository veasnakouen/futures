using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MtpApp.Dtos;
using MtpApp.Infrastructure;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
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
            var results = new List<ChartDto>();
            var connectionString = GetConnectionString();

            using var conx = new SqlConnection(connectionString);
            using var cmd = new SqlCommand("ChartDashBoard_Proc", conx);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@ChartReport", SqlDbType.NVarChar, 255).Value = Client ?? (object)DBNull.Value;

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
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch chart data.", detail = ex.Message });
            }

            return Ok(results);
        }

        [HttpGet]
        public IActionResult GetClients()
        {
            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);
            if (user == null)
                return Unauthorized();

            var clients = _context.Clients
                .Where(c => c.Branch == user.Branch)
                .ToList()
                .Select(c => _mapper.Map<Client, ClientDto>(c));

            return Ok(clients);
        }

        [HttpGet("{id}")]
        public IActionResult GetClient(int id)
        {
            var client = _context.Clients.SingleOrDefault(c => c.Id == id);
            if (client == null)
                return NotFound();

            return Ok(_mapper.Map<Client, ClientDto>(client));
        }

        [HttpPost]
        public async Task<IActionResult> CreateClient()
        {
            var form = Request.Form;
            var errors = new List<string>();

            // Validate required fields
            var firstName = FormHelpers.GetFormValue(form, "FirstName");
            var lastName = FormHelpers.GetFormValue(form, "LastName");
            if (string.IsNullOrWhiteSpace(firstName))
                errors.Add("FirstName is required.");
            if (string.IsNullOrWhiteSpace(lastName))
                errors.Add("LastName is required.");

            // Validate dates
            var dobError = FormHelpers.ValidateDateString(form, "DateOfBirth", out var dateOfBirth);
            if (dobError != null) errors.Add(dobError);

            var regDateError = FormHelpers.ValidateDateString(form, "RegisterDate", out var registerDate);
            if (regDateError != null) errors.Add(regDateError);

            FormHelpers.ValidateDateString(form, "IdpoorValiddate", out var idpoorValiddate);

            // Check for duplicate client
            if (!string.IsNullOrWhiteSpace(firstName) && !string.IsNullOrWhiteSpace(lastName))
            {
                var clientInDb = _context.Clients
                    .IgnoreQueryFilters()
                    .FirstOrDefault(c => c.FirstName == firstName && c.LastName == lastName && c.Status == "Active");
                if (clientInDb != null)
                    errors.Add("Client already exists.");
            }

            if (errors.Any())
                return BadRequest(new { errors });

            // Validate and upload photo
            string imageName = "";
            var httpPostedFile = Request.Form.Files.GetFile("UploadedFile");
            if (httpPostedFile != null && httpPostedFile.Length > 0)
            {
                if (!FileUploadValidator.IsValidFile(httpPostedFile, out var fileError))
                    return BadRequest(new { errors = new[] { fileError } });

                imageName = FileUploadValidator.GenerateSafeFileName(httpPostedFile.FileName);
                var fileSavePath = Path.Combine(GetImagesPath(), imageName);
                using (var stream = new FileStream(fileSavePath, FileMode.Create))
                {
                    await httpPostedFile.CopyToAsync(stream);
                }
            }

            // Validate and upload ID card
            string imageNameIdCard = "";
            var httpPostedFileCardId = Request.Form.Files.GetFile("UploadedFileIdCard");
            if (httpPostedFileCardId != null && httpPostedFileCardId.Length > 0)
            {
                if (!FileUploadValidator.IsValidFile(httpPostedFileCardId, out var fileError))
                    return BadRequest(new { errors = new[] { fileError } });

                imageNameIdCard = FileUploadValidator.GenerateSafeFileName(httpPostedFileCardId.FileName);
                var fileSavePath = Path.Combine(GetImagesPath(), imageNameIdCard);
                using (var stream = new FileStream(fileSavePath, FileMode.Create))
                {
                    await httpPostedFileCardId.CopyToAsync(stream);
                }
            }

            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);
            if (user == null)
                return Unauthorized();

            var clientDto = new ClientDto()
            {
                Branch = user.Branch,
                ClientCode = FormHelpers.GetFormValue(form, "ClientCode"),
                FirstName = firstName,
                LastName = lastName,
                Gender = FormHelpers.GetFormValue(form, "Gender"),
                DateOfBirth = dateOfBirth,
                ContactPhone = FormHelpers.GetFormValue(form, "ContactPhone"),
                RelativePhone = FormHelpers.GetFormValue(form, "RelativePhone"),
                MaritalStatus = FormHelpers.GetFormValue(form, "MaritalStatus"),
                Email = FormHelpers.GetFormValue(form, "Email"),
                Address = FormHelpers.GetFormValue(form, "Address"),
                Province = FormHelpers.GetFormValue(form, "Province"),
                Photo = imageName,
                IdCard = imageNameIdCard,
                CurrentSituation = FormHelpers.GetFormValue(form, "CurrentSituation"),
                FurtherEducation = FormHelpers.ParseBool(FormHelpers.GetFormValue(form, "FurtherEducation")),
                Placement = FormHelpers.ParseBool(FormHelpers.GetFormValue(form, "Placement")),
                TrainingFromFutures = FormHelpers.ParseBool(FormHelpers.GetFormValue(form, "TrainingFromFutures")),
                SocialSupportRequired = FormHelpers.ParseBool(FormHelpers.GetFormValue(form, "SocialSupportRequired")),
                HearBy = FormHelpers.GetFormValue(form, "HearBy"),
                ExpectedSupport = FormHelpers.GetFormValue(form, "ExpectedSupport"),
                AspUserId = userId,
                EnrollDate = DateTime.Now,
                RegisterDate = registerDate,
                PlaceOfBirth = FormHelpers.GetFormValue(form, "PlaceOfBirth"),
                Nationality = FormHelpers.GetFormValue(form, "Nationality"),
                Citizenship = FormHelpers.GetFormValue(form, "Citizenship"),
                Height = FormHelpers.GetFormValue(form, "Height"),
                Weight = FormHelpers.GetFormValue(form, "Weight"),
                SocialSupportProblem = FormHelpers.GetFormValue(form, "SocialSupportProblem"),
                IdpoorStatus = FormHelpers.GetFormValue(form, "IdpoorStatus"),
                IdpoorValiddate = idpoorValiddate,
                IdpoorLevel = FormHelpers.GetFormValue(form, "IdpoorLevel"),
                IdpoorAccountNumber = FormHelpers.GetFormValue(form, "IdpoorAccountNumber"),
                Status = "Active"
            };

            var client = _mapper.Map<Client>(clientDto);

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            clientDto.Id = client.Id;

            return CreatedAtAction(nameof(GetClient), new { id = clientDto.Id }, clientDto);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateClient()
        {
            var form = Request.Form;
            var errors = new List<string>();

            if (!int.TryParse(FormHelpers.GetFormValue(form, "id"), out var id))
                return BadRequest(new { errors = new[] { "Invalid client ID." } });

            var clientInDb = _context.Clients.SingleOrDefault(c => c.Id == id);
            if (clientInDb == null)
                return NotFound();

            // Validate dates
            var dobError = FormHelpers.ValidateDateString(form, "DateOfBirth", out var dateOfBirth);
            if (dobError != null) errors.Add(dobError);

            var regDateError = FormHelpers.ValidateDateString(form, "RegisterDate", out var registerDate);
            if (regDateError != null) errors.Add(regDateError);

            FormHelpers.ValidateDateString(form, "RegisterDateNd", out var registerDateNd);
            FormHelpers.ValidateDateString(form, "RegisterDateRd", out var registerDateRd);
            FormHelpers.ValidateDateString(form, "IdpoorValiddate", out var idpoorValiddate);

            if (errors.Any())
                return BadRequest(new { errors });

            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);
            if (user == null)
                return Unauthorized();

            string imageName = clientInDb.Photo;
            string imageNameIdCard = clientInDb.IdCard;

            // Validate and upload new photo
            var httpPostedFile = Request.Form.Files.GetFile("UploadedFile");
            if (httpPostedFile != null && httpPostedFile.Length > 0)
            {
                if (!FileUploadValidator.IsValidFile(httpPostedFile, out var fileError))
                    return BadRequest(new { errors = new[] { fileError } });

                // Delete old image
                if (!string.IsNullOrEmpty(clientInDb.Photo))
                {
                    var oldImagePath = Path.Combine(GetImagesPath(), clientInDb.Photo);
                    if (System.IO.File.Exists(oldImagePath))
                        System.IO.File.Delete(oldImagePath);
                }

                imageName = FileUploadValidator.GenerateSafeFileName(httpPostedFile.FileName);
                var fileSavePath = Path.Combine(GetImagesPath(), imageName);
                using (var stream = new FileStream(fileSavePath, FileMode.Create))
                {
                    await httpPostedFile.CopyToAsync(stream);
                }
            }

            // Validate and upload new ID card
            var httpPostedFileCardId = Request.Form.Files.GetFile("UploadedFileIdCard");
            if (httpPostedFileCardId != null && httpPostedFileCardId.Length > 0)
            {
                if (!FileUploadValidator.IsValidFile(httpPostedFileCardId, out var fileError))
                    return BadRequest(new { errors = new[] { fileError } });

                imageNameIdCard = FileUploadValidator.GenerateSafeFileName(httpPostedFileCardId.FileName);
                var fileSavePath = Path.Combine(GetImagesPath(), imageNameIdCard);
                using (var stream = new FileStream(fileSavePath, FileMode.Create))
                {
                    await httpPostedFileCardId.CopyToAsync(stream);
                }
            }

            var clientDto = new ClientDto()
            {
                Id = id,
                Branch = user.Branch,
                ClientCode = FormHelpers.GetFormValue(form, "ClientCode"),
                FirstName = FormHelpers.GetFormValue(form, "FirstName"),
                LastName = FormHelpers.GetFormValue(form, "LastName"),
                Gender = FormHelpers.GetFormValue(form, "Gender"),
                DateOfBirth = dateOfBirth,
                ContactPhone = FormHelpers.GetFormValue(form, "ContactPhone"),
                RelativePhone = FormHelpers.GetFormValue(form, "RelativePhone"),
                MaritalStatus = FormHelpers.GetFormValue(form, "MaritalStatus"),
                Email = FormHelpers.GetFormValue(form, "Email"),
                Address = FormHelpers.GetFormValue(form, "Address"),
                Province = FormHelpers.GetFormValue(form, "Province"),
                Photo = imageName,
                IdCard = imageNameIdCard,
                CurrentSituation = FormHelpers.GetFormValue(form, "CurrentSituation"),
                FurtherEducation = FormHelpers.ParseBool(FormHelpers.GetFormValue(form, "FurtherEducation")),
                Placement = FormHelpers.ParseBool(FormHelpers.GetFormValue(form, "Placement")),
                TrainingFromFutures = FormHelpers.ParseBool(FormHelpers.GetFormValue(form, "TrainingFromFutures")),
                SocialSupportRequired = FormHelpers.ParseBool(FormHelpers.GetFormValue(form, "SocialSupportRequired")),
                HearBy = FormHelpers.GetFormValue(form, "HearBy"),
                ExpectedSupport = FormHelpers.GetFormValue(form, "ExpectedSupport"),
                AspUserId = clientInDb.AspUserId,
                EnrollDate = clientInDb.EnrollDate,
                RegisterDate = registerDate,
                RegisterDateNd = registerDateNd,
                RegisterDateRd = registerDateRd,
                UpdateDate = DateTime.Today,
                UpdateBy = userId,
                PlaceOfBirth = FormHelpers.GetFormValue(form, "PlaceOfBirth"),
                Nationality = FormHelpers.GetFormValue(form, "Nationality"),
                Citizenship = FormHelpers.GetFormValue(form, "Citizenship"),
                Height = FormHelpers.GetFormValue(form, "Height"),
                Weight = FormHelpers.GetFormValue(form, "Weight"),
                SocialSupportProblem = FormHelpers.GetFormValue(form, "SocialSupportProblem"),
                IdpoorStatus = FormHelpers.GetFormValue(form, "IdpoorStatus"),
                IdpoorValiddate = idpoorValiddate,
                IdpoorLevel = FormHelpers.GetFormValue(form, "IdpoorLevel"),
                IdpoorAccountNumber = FormHelpers.GetFormValue(form, "IdpoorAccountNumber"),
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

            // Soft delete: update status instead of hard delete
            clientInDb.Status = "Inactive";
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
