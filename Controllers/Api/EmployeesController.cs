using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using MtpApp.ViewModels;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;

        public EmployeesController(ApplicationDbContext context, IMapper mapper, IWebHostEnvironment env)
        {
            _context = context;
            _mapper = mapper;
            _env = env;
        }

        private string GetImagesPath() => Path.Combine(_env.WebRootPath, "Images");

        [HttpGet]
        public IActionResult GetEmployees()
        {
            var employees = _context.Employees
                .Include(c => c.Position).Include(c => c.Department)
                .ToList()
                .Select(c => _mapper.Map<Employee, EmployeeDto>(c));
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public IActionResult GetEmployee(int id)
        {
            var employeeInDb = _context.Employees
                .Include(c => c.Position).Include(c => c.Department)
                .SingleOrDefault(c => c.Id == id);
            if (employeeInDb == null)
                return NotFound();

            var viewModel = new EmployeeViewModel()
            {
                EmployeeDto = _mapper.Map<Employee, EmployeeDto>(employeeInDb),
                Departments = _context.Departments.ToList(),
                Positions = _context.Positions.ToList()
            };
            return Ok(viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            string ImageName = "";
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

            var employeeDto = new EmployeeDto()
            {
                IdNo = Request.Form["IdNo"],
                Title = Request.Form["Title"],
                FirstNameEnglish = Request.Form["FirstNameEnglish"],
                LastNameEnglish = Request.Form["LastNameEnglish"],
                FirstNameKhmer = Request.Form["FirstNameKhmer"],
                LastNameKhmer = Request.Form["LastNameKhmer"],
                Gender = Request.Form["Gender"],
                DateOfBirth = DateTime.ParseExact(Request.Form["DateOfBirth"], "dd/MM/yyyy", null),
                PlaceOfBirth = Request.Form["PlaceOfBirth"],
                Address = Request.Form["Address"],
                Country = Request.Form["Country"],
                Nationality = Request.Form["Nationality"],
                Email = Request.Form["Email"],
                PhoneNumber = Request.Form["PhoneNumber"],
                BloodGroup = Request.Form["BloodGroup"],
                BankAccountNumber = Request.Form["BankAccountNumber"],
                BankAccount = Request.Form["BankAccount"],
                ContractDate = DateTime.ParseExact(Request.Form["ContractDate"], "dd/MM/yyyy", null),
                ContractType = Request.Form["ContractType"],
                ContractStartDate = DateTime.ParseExact(Request.Form["ContractStartDate"], "dd/MM/yyyy", null),
                ContractEndDate = DateTime.ParseExact(Request.Form["ContractEndDate"], "dd/MM/yyyy", null),
                Manager = Request.Form["Manager"],
                MaritalStatus = Request.Form["MaritalStatus"],
                Children = Request.Form["Children"],
                EmergencyContact = Request.Form["EmergencyContact"],
                EmergencyContactName = Request.Form["EmergencyContactName"],
                EmergencyContactPhone = Request.Form["EmergencyContactPhone"],
                IdentityCardNumber = Request.Form["IdentityCardNumber"],
                IdentityCardType = Request.Form["IdentityCardType"],
                Note = Request.Form["Note"],
                Photo = ImageName,
                Status = Request.Form["Status"],
                PositionId = int.Parse(Request.Form["PositionId"]),
                DepartmentId = int.Parse(Request.Form["DepartmentId"])
            };

            var employee = _mapper.Map<EmployeeDto, Employee>(employeeDto);
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            employeeDto.Id = employee.Id;
            return CreatedAtAction(nameof(GetEmployee), new { id = employeeDto.Id }, employeeDto);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEmployee()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var id = int.Parse(Request.Form["id"]);
            var employeeInDb = _context.Employees.SingleOrDefault(c => c.Id == id);
            if (employeeInDb == null)
                return NotFound();

            string ImageName = employeeInDb.Photo;
            var httpPostedFile = Request.Form.Files.GetFile("UploadedFile");
            if (httpPostedFile != null)
            {
                // Delete old image
                if (!string.IsNullOrEmpty(employeeInDb.Photo))
                {
                    var oldImagePath = Path.Combine(GetImagesPath(), employeeInDb.Photo);
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

            var employeeDto = new EmployeeDto()
            {
                Id = id,
                IdNo = Request.Form["IdNo"],
                Title = Request.Form["Title"],
                FirstNameEnglish = Request.Form["FirstNameEnglish"],
                LastNameEnglish = Request.Form["LastNameEnglish"],
                FirstNameKhmer = Request.Form["FirstNameKhmer"],
                LastNameKhmer = Request.Form["LastNameKhmer"],
                Gender = Request.Form["Gender"],
                DateOfBirth = DateTime.ParseExact(Request.Form["DateOfBirth"], "dd/MM/yyyy", null),
                PlaceOfBirth = Request.Form["PlaceOfBirth"],
                Address = Request.Form["Address"],
                Country = Request.Form["Country"],
                Nationality = Request.Form["Nationality"],
                Email = Request.Form["Email"],
                PhoneNumber = Request.Form["PhoneNumber"],
                BloodGroup = Request.Form["BloodGroup"],
                BankAccountNumber = Request.Form["BankAccountNumber"],
                BankAccount = Request.Form["BankAccount"],
                ContractDate = DateTime.ParseExact(Request.Form["ContractDate"], "dd/MM/yyyy", null),
                ContractType = Request.Form["ContractType"],
                ContractStartDate = DateTime.ParseExact(Request.Form["ContractStartDate"], "dd/MM/yyyy", null),
                ContractEndDate = DateTime.ParseExact(Request.Form["ContractEndDate"], "dd/MM/yyyy", null),
                Manager = Request.Form["Manager"],
                MaritalStatus = Request.Form["MaritalStatus"],
                Children = Request.Form["Children"],
                EmergencyContact = Request.Form["EmergencyContact"],
                EmergencyContactName = Request.Form["EmergencyContactName"],
                EmergencyContactPhone = Request.Form["EmergencyContactPhone"],
                IdentityCardNumber = Request.Form["IdentityCardNumber"],
                IdentityCardType = Request.Form["IdentityCardType"],
                Note = Request.Form["Note"],
                Photo = ImageName,
                Status = Request.Form["Status"],
                PositionId = int.Parse(Request.Form["PositionId"]),
                DepartmentId = int.Parse(Request.Form["DepartmentId"])
            };

            _mapper.Map(employeeDto, employeeInDb);
            await _context.SaveChangesAsync();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employeeInDb = _context.Employees.SingleOrDefault(c => c.Id == id);
            if (employeeInDb == null)
                return NotFound();

            _context.Employees.Remove(employeeInDb);
            _context.SaveChanges();

            if (!string.IsNullOrEmpty(employeeInDb.Photo))
            {
                var imagePath = Path.Combine(GetImagesPath(), employeeInDb.Photo);
                if (System.IO.File.Exists(imagePath))
                    System.IO.File.Delete(imagePath);
            }
            return Ok(new { });
        }
    }
}

