using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class EmployersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public EmployersController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //GET /api/employers
        [HttpGet]
        public IActionResult GetEmployers(string status)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            if (status == "Active")
            {
                var employers = _context.Employers.Include(m => m.JobCategory).Select(_mapper.Map<Employer, EmployerDto>).Where(c => c.Branch == user.Branch && c.Status == "Active");
                return Ok(employers);
            }
            else
            {
                var employers = _context.Employers.Include(m => m.JobCategory).Select(_mapper.Map<Employer, EmployerDto>).Where(c => c.Branch == user.Branch && c.Status == "Inactive");
                return Ok(employers);
            }
        }

        //GET /api/employers?start=&end=
        [HttpGet]
        public IActionResult GetEmployers(DateTime start, DateTime end)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            var employers = _context.Employers
                                .Include(m => m.JobCategory)
                                .Select(_mapper.Map<Employer, EmployerDto>)
                                .Where(c => c.Branch == user.Branch && c.Status == "Active" && c.CorporateDate >= start && c.CorporateDate <= end);
            
            return Ok(employers);
        }

        //GET /api/employers/{id}
        [HttpGet]
        public IActionResult GetEmployer(int id)
        {
            var employer = _context.Employers.Include(m => m.JobCategory).SingleOrDefault(c => c.Id == id);

            if (employer == null)
                return NotFound();

            return Ok(_mapper.Map<Employer,EmployerDto>(employer));
        }

        //POST /api/employers
        [HttpPost]
        public IActionResult CreateEmployer(EmployerDto employerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //Check if exists
            var employerInDb = _context.Employers.FirstOrDefault(c => c.Name == employerDto.Name);

            if (employerInDb != null)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            employerDto.Branch = user.Branch;

            var employer = _mapper.Map<EmployerDto, Employer>(employerDto);

            _context.Employers.Add(employer);
            _context.SaveChanges();

            employerDto.Id = employer.Id;

            return CreatedAtAction(nameof(GetEmployer), new { id = employerDto.Id }, employerDto);
        }

        //PUT /api/employers/{id}
        [HttpPut]
        public IActionResult UpdateEmployer(int id, EmployerDto employerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //Check if exist
            var checkEmployer = _context.Employers.FirstOrDefault(c => c.Id != id && c.Name == employerDto.Name);

            if (checkEmployer != null)
                return BadRequest();

            var employerInDb = _context.Employers.SingleOrDefault(c => c.Id == id);

            if (employerDto == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            employerDto.Branch = user.Branch;

            _mapper.Map(employerDto, employerInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/employers/{id}
        [HttpDelete]
        public IActionResult DeleteEmployer(int id)
        {
            var employer = _context.Employers.SingleOrDefault(c => c.Id == id);

            if (employer == null)
                return NotFound();

            _context.Employers.Remove(employer);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}

