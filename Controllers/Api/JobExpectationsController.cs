using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class JobExpectationsController : ApiController
    {
        private ApplicationDbContext _context;
        public JobExpectationsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/jobexpectations?clientId={id}
        [HttpGet]
        public IHttpActionResult GetJobExpectations(int clientId)
        {
            var jobExpectations = _context.JobExpectations.Select(Mapper.Map<JobExpectation, JobExpectationDto>).Where(c => c.ClientId == clientId);
            return Ok(jobExpectations);
        }

        // GET: /api/jobexpectations/{id}
        [HttpGet]
        public IHttpActionResult GetJobExpectation(int id)
        {
            var jobExpectation = _context.JobExpectations.SingleOrDefault(c => c.Id == id);

            if (jobExpectation == null)
                return NotFound();

            return Ok(jobExpectation);
        }

        // PUT: /api/jobexpectations/{id}
        [HttpPut]
        public IHttpActionResult UpdateJobExpectation(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var jobExpectationInDb = _context.JobExpectations.SingleOrDefault(c => c.ClientId == id);

            var JobCategoryIdOne = HttpContext.Current.Request.Form["JobCategoryIdOne"];

            if (JobCategoryIdOne == null)
            {
                JobCategoryIdOne = null;
            }

            var jobExpectationDto = new JobExpectationDto()
            {
                ClientId = int.Parse(HttpContext.Current.Request.Form["ClientId"]),
                JobCategoryIdOne = int.Parse(HttpContext.Current.Request.Form["JobCategoryIdOne"]),
                JobCategoryIdTwo = int.Parse(HttpContext.Current.Request.Form["JobCategoryIdTwo"]),
                JobCategoryIdThree = int.Parse(HttpContext.Current.Request.Form["JobCategoryIdThree"]),
                JobPositionIdOne = int.Parse(HttpContext.Current.Request.Form["JobPositionIdOne"]),
                JobPositionIdTwo = int.Parse(HttpContext.Current.Request.Form["JobPositionIdTwo"]),
                JobPositionIdThree = int.Parse(HttpContext.Current.Request.Form["JobPositionIdThree"]),
                EmploymentType = (HttpContext.Current.Request.Form["EmploymentType"]),
                Permanent =  true,  // Boolean.Parse(HttpContext.Current.Request.Form["Permanent"]),
                Temporary =   true, // Boolean.Parse(HttpContext.Current.Request.Form["Temporary"]),
                Seasonal =   true, //Boolean.Parse(HttpContext.Current.Request.Form["Seasonal"]),
                AvailableTime = HttpContext.Current.Request.Form["AvailableTime"],
                SalaryExpectation = HttpContext.Current.Request.Form["SalaryExpectation"],
                Note = HttpContext.Current.Request.Form["Note"],
                Candidate = HttpContext.Current.Request.Form["Candidate"],
                Hobby = HttpContext.Current.Request.Form["Hobby"],
                SelfEmployment = HttpContext.Current.Request.Form["SelfEmployment"],
                BusinessSetUpCategoryId = int.Parse(HttpContext.Current.Request.Form["BusinessSetUpCategoryId"]),
                BusinessType = HttpContext.Current.Request.Form["BusinessType"],
                ExpectationStatus = HttpContext.Current.Request.Form["ExpectationStatus"]
            };

            if (jobExpectationInDb == null)
            {
                var jobExpectation = Mapper.Map<JobExpectationDto, JobExpectation>(jobExpectationDto);

                _context.JobExpectations.Add(jobExpectation);
                _context.SaveChanges();

                jobExpectationDto.Id = jobExpectation.Id;

                return Created(new Uri(Request.RequestUri + "/" + jobExpectationDto.Id), jobExpectationDto);
            }
            else
            {
                Mapper.Map(jobExpectationDto, jobExpectationInDb);
                _context.SaveChanges();

                return Ok(new { });
            }
        }
    }
}
