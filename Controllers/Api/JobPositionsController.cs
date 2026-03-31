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
    public class JobPositionsController : ApiController
    {
        private ApplicationDbContext _context;
        public JobPositionsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET /api/jobpositions
        [HttpGet]
        public IHttpActionResult GetJobPositions()
        {
            var jobPositions = _context.JobPosition.Select(Mapper.Map<JobPosition, JobPositionDto>).Where(c => c.IsDeleted == false);

            return Ok(jobPositions);
        }

        // GET /api/jobposition/{id}
        [HttpGet]
        public IHttpActionResult GetJobPosition(int id)
        {
            var jobPositionInDb = _context.JobPosition.SingleOrDefault(c => c.IsDeleted == false && c.Id == id);

            if (jobPositionInDb == null)
                return NotFound();

            return Ok(Mapper.Map<JobPosition, JobPositionDto>(jobPositionInDb));
        }

        // POST /api/jobposition
        [HttpPost]
        public IHttpActionResult CreateJobPosition(JobPositionDto jobPositionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //Check if exist
            var jobPositionInDb = _context.JobPosition.FirstOrDefault(c => c.Name == jobPositionDto.Name);

            if (jobPositionInDb != null)
                return BadRequest();

            var jobPosition = Mapper.Map<JobPositionDto, JobPosition>(jobPositionDto);

            _context.JobPosition.Add(jobPosition);
            _context.SaveChanges();

            jobPositionDto.Id = jobPosition.Id;

            return Created(new Uri(Request.RequestUri + "/" + jobPositionDto.Id), jobPositionDto);
        }

        // PUT /api/jobposition/{id}
        [HttpPut]
        public IHttpActionResult UpdateJobPosition(int id, JobPositionDto jobPositionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //Check if exist
            var jobPosition = _context.JobPosition.FirstOrDefault(c => c.Id != id && c.Name == jobPositionDto.Name);

            if (jobPosition != null)
                return BadRequest();

            var jobPositionInDb = _context.JobPosition.SingleOrDefault(c => c.Id == id);

            if (jobPositionInDb == null)
                return NotFound();

            Mapper.Map(jobPositionDto, jobPositionInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE /api/jobposition/{id}
        [HttpDelete]
        public IHttpActionResult DeleteJobPosition(int id)
        {
            var jobPosition = _context.JobPosition.SingleOrDefault(c => c.Id == id);

            if (jobPosition == null)
                return NotFound();

            jobPosition.IsDeleted = true;
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
