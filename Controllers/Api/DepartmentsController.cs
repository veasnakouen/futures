using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
     [Authorize]
    public class DepartmentsController : ApiController
    {
        private ApplicationDbContext _context;

        public DepartmentsController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/departments
        [HttpGet]
        public IHttpActionResult GetDepartments()
        {
            var departments = _context.Departments.ToList().Select(Mapper.Map<Department, DepartmentDto>);
            return Ok(departments);
        }

        //GET /api/departments
        [HttpGet]
        public IHttpActionResult GetDepartment(int id)
        {
            var departmentInDb = _context.Departments.SingleOrDefault(c => c.Id == id);

            if (departmentInDb == null)
                return NotFound();

            return Ok(Mapper.Map<Department, DepartmentDto>(departmentInDb));
        }

        //POST /api/departments
        [HttpPost]
        public IHttpActionResult CreateDepartment(DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var department = Mapper.Map<DepartmentDto, Department>(departmentDto);

            _context.Departments.Add(department);
            _context.SaveChanges();

            departmentDto.Id = department.Id;

            return Created(new Uri(Request.RequestUri + "/" + departmentDto.Id), departmentDto);
        }

        //PUT /api/departments/{id}
        [HttpPut]
        public IHttpActionResult UpdateDepartment(int id, DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var departmentInDb = _context.Departments.SingleOrDefault(c => c.Id == id);

            if (departmentInDb == null)
                return NotFound();

            Mapper.Map(departmentDto, departmentInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/departments/{id}
        [HttpDelete]
        public IHttpActionResult DeleteDepartment(int id)
        {
            var department = _context.Departments.SingleOrDefault(c => c.Id == id);

            if (department == null)
                return NotFound();

            _context.Departments.Remove(department);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
