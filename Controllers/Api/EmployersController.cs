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

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class EmployersController : ApiController
    {
        private ApplicationDbContext _context;
        public EmployersController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/employers
        [HttpGet]
        public IHttpActionResult GetEmployers(string status)
        {
            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            if (status == "Active")
            {
                var employers = _context.Employers.Include(m => m.JobCategory).Select(Mapper.Map<Employer, EmployerDto>).Where(c => c.Branch == user.Branch && c.Status == "Active");
                return Ok(employers);
            }
            else
            {
                var employers = _context.Employers.Include(m => m.JobCategory).Select(Mapper.Map<Employer, EmployerDto>).Where(c => c.Branch == user.Branch && c.Status == "Inactive");
                return Ok(employers);
            }
        }

        //GET /api/employers?start=&end=
        [HttpGet]
        public IHttpActionResult GetEmployers(DateTime start, DateTime end)
        {
            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            var employers = _context.Employers
                                .Include(m => m.JobCategory)
                                .Select(Mapper.Map<Employer, EmployerDto>)
                                .Where(c => c.Branch == user.Branch && c.Status == "Active" && c.CorporateDate >= start && c.CorporateDate <= end);
            
            return Ok(employers);
        }

        //GET /api/employers/{id}
        [HttpGet]
        public IHttpActionResult GetEmployer(int id)
        {
            var employer = _context.Employers.Include(m => m.JobCategory).SingleOrDefault(c => c.Id == id);

            if (employer == null)
                return NotFound();

            return Ok(Mapper.Map<Employer,EmployerDto>(employer));
        }

        //POST /api/employers
        [HttpPost]
        public IHttpActionResult CreateEmployer(EmployerDto employerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //Check if exists
            var employerInDb = _context.Employers.FirstOrDefault(c => c.Name == employerDto.Name);

            if (employerInDb != null)
                return BadRequest();

            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            employerDto.Branch = user.Branch;

            var employer = Mapper.Map<EmployerDto, Employer>(employerDto);

            _context.Employers.Add(employer);
            _context.SaveChanges();

            employerDto.Id = employer.Id;

            return Created(new Uri(Request.RequestUri + "/" + employerDto.Id), employerDto);
        }

        //PUT /api/employers/{id}
        [HttpPut]
        public IHttpActionResult UpdateEmployer(int id, EmployerDto employerDto)
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

            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            employerDto.Branch = user.Branch;

            Mapper.Map(employerDto, employerInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/employers/{id}
        [HttpDelete]
        public IHttpActionResult DeleteEmployer(int id)
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
