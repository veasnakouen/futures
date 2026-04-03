using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class JobExperiencesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public JobExperiencesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetJobExperiences([FromQuery] int clientId)
        {
            var jobExperiences = _context.JobExperiences
                .Include(c => c.JobCategories)
                .Include(c => c.JobPositions)
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<JobExperience, JobExperienceDto>(c));
            return Ok(jobExperiences);
        }

        [HttpGet("{id}")]
        public IActionResult GetJobExperience(int id)
        {
            var jobExperience = _context.JobExperiences.SingleOrDefault(c => c.Id == id);
            if (jobExperience == null)
                return NotFound();
            return Ok(_mapper.Map<JobExperience, JobExperienceDto>(jobExperience));
        }

        [HttpPost]
        public IActionResult CreateJobExperience([FromBody] JobExperienceDto jobExperienceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var jobExperience = _mapper.Map<JobExperienceDto, JobExperience>(jobExperienceDto);
            _context.JobExperiences.Add(jobExperience);
            _context.SaveChanges();
            jobExperienceDto.Id = jobExperience.Id;
            return CreatedAtAction(nameof(GetJobExperience), new { id = jobExperienceDto.Id }, jobExperienceDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJobExperience(int id, [FromBody] JobExperienceDto jobExperienceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var jobExperienceInDb = _context.JobExperiences.SingleOrDefault(c => c.Id == id);
            if (jobExperienceInDb == null)
                return NotFound();

            _mapper.Map(jobExperienceDto, jobExperienceInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteJobExperience(int id)
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

