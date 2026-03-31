using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Data.Entity;
using MtpApp.ViewModels;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class EmployeesController : ApiController
    {
        private ApplicationDbContext _context;

        public EmployeesController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/employees
        [HttpGet]
        public IHttpActionResult GetEmployees()
        {
            var employees = _context.Employees.Include(c => c.Position).Include(c => c.Department).ToList().Select(Mapper.Map<Employee, EmployeeDto>);

            return Ok(employees);
        }

        //GET /api/employees/{id}
        [HttpGet]
        public IHttpActionResult GetEmployee(int id)
        {
            var employeeInDb = _context.Employees.Include(c => c.Position).Include(c => c.Department).SingleOrDefault(c => c.Id == id);

            if (employeeInDb == null)
                return NotFound();

            var viewModel = new EmployeeViewModel()
            {
                EmployeeDto = Mapper.Map<Employee, EmployeeDto>(employeeInDb),
                Departments = _context.Departments.ToList(),
                Positions = _context.Positions.ToList()
            };

            return Ok(viewModel);
        }

        //POST /api/employees
        [HttpPost]
        public IHttpActionResult CreateEmployee()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            string ImageName = "";

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
            }

            var employeeDto = new EmployeeDto()
            {
                IdNo = HttpContext.Current.Request.Form["IdNo"],
                Title = HttpContext.Current.Request.Form["Title"],
                FirstNameEnglish = HttpContext.Current.Request.Form["FirstNameEnglish"],
                LastNameEnglish = HttpContext.Current.Request.Form["LastNameEnglish"],
                FirstNameKhmer = HttpContext.Current.Request.Form["FirstNameKhmer"],
                LastNameKhmer = HttpContext.Current.Request.Form["LastNameKhmer"],
                Gender = HttpContext.Current.Request.Form["Gender"],
                DateOfBirth = DateTime.ParseExact(HttpContext.Current.Request.Form["DateOfBirth"], "dd/MM/yyyy", null),
                PlaceOfBirth = HttpContext.Current.Request.Form["PlaceOfBirth"],
                Address = HttpContext.Current.Request.Form["Address"],
                Country = HttpContext.Current.Request.Form["Country"],
                Nationality = HttpContext.Current.Request.Form["Nationality"],
                Email = HttpContext.Current.Request.Form["Email"],
                PhoneNumber = HttpContext.Current.Request.Form["PhoneNumber"],
                BloodGroup = HttpContext.Current.Request.Form["BloodGroup"],
                BankAccountNumber = HttpContext.Current.Request.Form["BankAccountNumber"],
                BankAccount = HttpContext.Current.Request.Form["BankAccount"],
                ContractDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractDate"], "dd/MM/yyyy", null),
                ContractType = HttpContext.Current.Request.Form["ContractType"],
                ContractStartDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractStartDate"], "dd/MM/yyyy", null),
                ContractEndDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractEndDate"], "dd/MM/yyyy", null),
                Manager = HttpContext.Current.Request.Form["Manager"],
                MaritalStatus = HttpContext.Current.Request.Form["MaritalStatus"],
                Children = HttpContext.Current.Request.Form["Children"],
                EmergencyContact = HttpContext.Current.Request.Form["EmergencyContact"],
                EmergencyContactName = HttpContext.Current.Request.Form["EmergencyContactName"],
                EmergencyContactPhone = HttpContext.Current.Request.Form["EmergencyContactPhone"],
                IdentityCardNumber = HttpContext.Current.Request.Form["IdentityCardNumber"],
                IdentityCardType = HttpContext.Current.Request.Form["IdentityCardType"],
                Note = HttpContext.Current.Request.Form["Note"],
                Photo = ImageName,
                Status = HttpContext.Current.Request.Form["Status"],
                PositionId = int.Parse(HttpContext.Current.Request.Form["PositionId"]),
                DepartmentId = int.Parse(HttpContext.Current.Request.Form["DepartmentId"])              
            };

            var employee = Mapper.Map<EmployeeDto, Employee>(employeeDto);

            _context.Employees.Add(employee);
            _context.SaveChanges();

            employeeDto.Id = employee.Id;

            return Created(new Uri(Request.RequestUri + "/" + employeeDto.Id), employeeDto);
        }

        //PUT /api/employees/{id}
        [HttpPut]
        public IHttpActionResult UpdateEmployee()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            string ImageName = "";

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

                var employeeInDb = _context.Employees.SingleOrDefault(c => c.Id == id);

                //Delete Old Image
                var oldImagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), employeeInDb.Photo);

                if (File.Exists(oldImagePath))
                {
                    File.Delete(oldImagePath);
                }

                var employeeDto = new EmployeeDto()
                {
                    Id = int.Parse(HttpContext.Current.Request.Form["id"]),
                    IdNo = HttpContext.Current.Request.Form["IdNo"],
                    Title = HttpContext.Current.Request.Form["Title"],
                    FirstNameEnglish = HttpContext.Current.Request.Form["FirstNameEnglish"],
                    LastNameEnglish = HttpContext.Current.Request.Form["LastNameEnglish"],
                    FirstNameKhmer = HttpContext.Current.Request.Form["FirstNameKhmer"],
                    LastNameKhmer = HttpContext.Current.Request.Form["LastNameKhmer"],
                    Gender = HttpContext.Current.Request.Form["Gender"],
                    DateOfBirth = DateTime.ParseExact(HttpContext.Current.Request.Form["DateOfBirth"], "dd/MM/yyyy", null),
                    PlaceOfBirth = HttpContext.Current.Request.Form["PlaceOfBirth"],
                    Address = HttpContext.Current.Request.Form["Address"],
                    Country = HttpContext.Current.Request.Form["Country"],
                    Nationality = HttpContext.Current.Request.Form["Nationality"],
                    Email = HttpContext.Current.Request.Form["Email"],
                    PhoneNumber = HttpContext.Current.Request.Form["PhoneNumber"],
                    BloodGroup = HttpContext.Current.Request.Form["BloodGroup"],
                    BankAccountNumber = HttpContext.Current.Request.Form["BankAccountNumber"],
                    BankAccount = HttpContext.Current.Request.Form["BankAccount"],
                    ContractDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractDate"], "dd/MM/yyyy", null),
                    ContractType = HttpContext.Current.Request.Form["ContractType"],
                    ContractStartDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractStartDate"], "dd/MM/yyyy", null),
                    ContractEndDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractEndDate"], "dd/MM/yyyy", null),
                    Manager = HttpContext.Current.Request.Form["Manager"],
                    MaritalStatus = HttpContext.Current.Request.Form["MaritalStatus"],
                    Children = HttpContext.Current.Request.Form["Children"],
                    EmergencyContact = HttpContext.Current.Request.Form["EmergencyContact"],
                    EmergencyContactName = HttpContext.Current.Request.Form["EmergencyContactName"],
                    EmergencyContactPhone = HttpContext.Current.Request.Form["EmergencyContactPhone"],
                    IdentityCardNumber = HttpContext.Current.Request.Form["IdentityCardNumber"],
                    IdentityCardType = HttpContext.Current.Request.Form["IdentityCardType"],
                    Note = HttpContext.Current.Request.Form["Note"],
                    Photo = ImageName,
                    Status = HttpContext.Current.Request.Form["Status"],
                    PositionId = int.Parse(HttpContext.Current.Request.Form["PositionId"]),
                    DepartmentId = int.Parse(HttpContext.Current.Request.Form["DepartmentId"])   
                };

                if (employeeInDb == null)
                    return NotFound();

                Mapper.Map(employeeDto, employeeInDb);

                _context.SaveChanges();

            }
            else
            {
                var id = int.Parse(HttpContext.Current.Request.Form["id"]);

                var employeeInDb = _context.Employees.SingleOrDefault(c => c.Id == id);

                var employeeDto = new EmployeeDto()
                {
                    Id = Int32.Parse(HttpContext.Current.Request.Form["id"]),
                    IdNo = HttpContext.Current.Request.Form["IdNo"],
                    Title = HttpContext.Current.Request.Form["Title"],
                    FirstNameEnglish = HttpContext.Current.Request.Form["FirstNameEnglish"],
                    LastNameEnglish = HttpContext.Current.Request.Form["LastNameEnglish"],
                    FirstNameKhmer = HttpContext.Current.Request.Form["FirstNameKhmer"],
                    LastNameKhmer = HttpContext.Current.Request.Form["LastNameKhmer"],
                    Gender = HttpContext.Current.Request.Form["Gender"],
                    DateOfBirth = DateTime.ParseExact(HttpContext.Current.Request.Form["DateOfBirth"], "dd/MM/yyyy", null),
                    PlaceOfBirth = HttpContext.Current.Request.Form["PlaceOfBirth"],
                    Address = HttpContext.Current.Request.Form["Address"],
                    Country = HttpContext.Current.Request.Form["Country"],
                    Nationality = HttpContext.Current.Request.Form["Nationality"],
                    Email = HttpContext.Current.Request.Form["Email"],
                    PhoneNumber = HttpContext.Current.Request.Form["PhoneNumber"],
                    BloodGroup = HttpContext.Current.Request.Form["BloodGroup"],
                    BankAccountNumber = HttpContext.Current.Request.Form["BankAccountNumber"],
                    BankAccount = HttpContext.Current.Request.Form["BankAccount"],
                    ContractDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractDate"], "dd/MM/yyyy", null),
                    ContractType = HttpContext.Current.Request.Form["ContractType"],
                    ContractStartDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractStartDate"], "dd/MM/yyyy", null),
                    ContractEndDate = DateTime.ParseExact(HttpContext.Current.Request.Form["ContractEndDate"], "dd/MM/yyyy", null),
                    Manager = HttpContext.Current.Request.Form["Manager"],
                    MaritalStatus = HttpContext.Current.Request.Form["MaritalStatus"],
                    Children = HttpContext.Current.Request.Form["Children"],
                    EmergencyContact = HttpContext.Current.Request.Form["EmergencyContact"],
                    EmergencyContactName = HttpContext.Current.Request.Form["EmergencyContactName"],
                    EmergencyContactPhone = HttpContext.Current.Request.Form["EmergencyContactPhone"],
                    IdentityCardNumber = HttpContext.Current.Request.Form["IdentityCardNumber"],
                    IdentityCardType = HttpContext.Current.Request.Form["IdentityCardType"],
                    Note = HttpContext.Current.Request.Form["Note"],
                    Photo = employeeInDb.Photo,
                    Status = HttpContext.Current.Request.Form["Status"],
                    PositionId = Int32.Parse(HttpContext.Current.Request.Form["PositionId"]),
                    DepartmentId = Int32.Parse(HttpContext.Current.Request.Form["DepartmentId"])  
                };

                if (employeeInDb == null)
                    return NotFound();

                Mapper.Map(employeeDto, employeeInDb);

                _context.SaveChanges();
            }

            return Ok(new { });
        }

        //DELETE /api/employees/{id}
        [HttpDelete]
        public IHttpActionResult DeleteEmployee(int id)
        {
            var employeeInDb = _context.Employees.SingleOrDefault(c => c.Id == id);

            if (employeeInDb == null)
                return NotFound();

            _context.Employees.Remove(employeeInDb);
            _context.SaveChanges();

            var imagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), employeeInDb.Photo);

            if (File.Exists(imagePath))
            {
                File.Delete(imagePath);
            }

            return Ok(new { });
        }
    }
}
