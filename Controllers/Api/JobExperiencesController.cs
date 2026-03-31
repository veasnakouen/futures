using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class JobExperiencesController : ApiController
    {
        private ApplicationDbContext _context;
        public JobExperiencesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/jobexperiences?clientId={id}
        [HttpGet]
        public IHttpActionResult GetJobExperiences(int clientId)
        {
            var jobExperiences = _context.JobExperiences.Include(c => c.JobCategories).Include(c => c.JobPositions).Select(Mapper.Map<JobExperience, JobExperienceDto>).Where(c => c.ClientId == clientId);
            return Ok(jobExperiences);
        }

        // GET: /api/jobexperiences/{id}
        [HttpGet]
        public IHttpActionResult GetJobExperience(int id)
        {
            var jobExperience = _context.JobExperiences.SingleOrDefault(c => c.Id == id);

            if (jobExperience == null)
                return NotFound();

            return Ok(Mapper.Map<JobExperience, JobExperienceDto>(jobExperience));
        }

        // POST: /api/jobexperiences
        [HttpPost]
        public IHttpActionResult CreateJobExperience(JobExperienceDto jobExperienceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var jobExperience = Mapper.Map<JobExperienceDto, JobExperience>(jobExperienceDto);

            _context.JobExperiences.Add(jobExperience);
            _context.SaveChanges();

            jobExperienceDto.Id = jobExperience.Id;

            return Created(new Uri(Request.RequestUri + "/" + jobExperienceDto.Id), jobExperienceDto);
        }

        // PUT: /api/jobexperiences/{id}
        [HttpPut]
        public IHttpActionResult UpdateJobExperience(int id, JobExperienceDto jobExperienceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var jobExperienceInDb = _context.JobExperiences.SingleOrDefault(c => c.Id == id);

            if (jobExperienceInDb == null)
                return NotFound();

            Mapper.Map(jobExperienceDto, jobExperienceInDb);
            _context.SaveChanges();
            
            return Ok(new { });
        }

        // DELETE: /api/jobexperiences/{id}
        [HttpDelete]
        public IHttpActionResult DeleteJobExperience(int id)
        {
            var jobExperience = _context.JobExperiences.SingleOrDefault(c => c.Id == id);

            if (jobExperience == null)
                return NotFound();

            _context.JobExperiences.Remove(jobExperience);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
