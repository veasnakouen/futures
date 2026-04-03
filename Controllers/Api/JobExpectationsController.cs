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
    public class JobExpectationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public JobExpectationsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetJobExpectations([FromQuery] int clientId)
        {
            var jobExpectations = _context.JobExpectations
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<JobExpectation, JobExpectationDto>(c));
            return Ok(jobExpectations);
        }

        [HttpGet("{id}")]
        public IActionResult GetJobExpectation(int id)
        {
            var jobExpectation = _context.JobExpectations.SingleOrDefault(c => c.Id == id);
            if (jobExpectation == null)
                return NotFound();
            return Ok(_mapper.Map<JobExpectation, JobExpectationDto>(jobExpectation));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJobExpectation(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var jobExpectationInDb = _context.JobExpectations.SingleOrDefault(c => c.ClientId == id);

            var jobExpectationDto = new JobExpectationDto()
            {
                ClientId = int.Parse(Request.Form["ClientId"]),
                JobCategoryIdOne = int.Parse(Request.Form["JobCategoryIdOne"]),
                JobCategoryIdTwo = int.Parse(Request.Form["JobCategoryIdTwo"]),
                JobCategoryIdThree = int.Parse(Request.Form["JobCategoryIdThree"]),
                JobPositionIdOne = int.Parse(Request.Form["JobPositionIdOne"]),
                JobPositionIdTwo = int.Parse(Request.Form["JobPositionIdTwo"]),
                JobPositionIdThree = int.Parse(Request.Form["JobPositionIdThree"]),
                EmploymentType = Request.Form["EmploymentType"],
                Permanent = true,
                Temporary = true,
                Seasonal = true,
                AvailableTime = Request.Form["AvailableTime"],
                SalaryExpectation = Request.Form["SalaryExpectation"],
                Note = Request.Form["Note"],
                Candidate = Request.Form["Candidate"],
                Hobby = Request.Form["Hobby"],
                SelfEmployment = Request.Form["SelfEmployment"],
                BusinessSetUpCategoryId = int.Parse(Request.Form["BusinessSetUpCategoryId"]),
                BusinessType = Request.Form["BusinessType"],
                ExpectationStatus = Request.Form["ExpectationStatus"]
            };

            if (jobExpectationInDb == null)
            {
                var jobExpectation = _mapper.Map<JobExpectationDto, JobExpectation>(jobExpectationDto);
                _context.JobExpectations.Add(jobExpectation);
                _context.SaveChanges();
                jobExpectationDto.Id = jobExpectation.Id;
                return CreatedAtAction(nameof(GetJobExpectation), new { id = jobExpectationDto.Id }, jobExpectationDto);
            }
            else
            {
                _mapper.Map(jobExpectationDto, jobExpectationInDb);
                _context.SaveChanges();
                return Ok(new { });
            }
        }
    }
}

