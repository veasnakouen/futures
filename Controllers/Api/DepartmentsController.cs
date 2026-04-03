using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DepartmentsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetDepartments()
        {
            var departments = _context.Departments.ToList().Select(c => _mapper.Map<Department, DepartmentDto>(c));
            return Ok(departments);
        }

        [HttpGet("{id}")]
        public IActionResult GetDepartment(int id)
        {
            var departmentInDb = _context.Departments.SingleOrDefault(c => c.Id == id);
            if (departmentInDb == null)
                return NotFound();
            return Ok(_mapper.Map<Department, DepartmentDto>(departmentInDb));
        }

        [HttpPost]
        public IActionResult CreateDepartment([FromBody] DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var department = _mapper.Map<DepartmentDto, Department>(departmentDto);
            _context.Departments.Add(department);
            _context.SaveChanges();
            departmentDto.Id = department.Id;
            return CreatedAtAction(nameof(GetDepartment), new { id = departmentDto.Id }, departmentDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, [FromBody] DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var departmentInDb = _context.Departments.SingleOrDefault(c => c.Id == id);
            if (departmentInDb == null)
                return NotFound();

            _mapper.Map(departmentDto, departmentInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
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

