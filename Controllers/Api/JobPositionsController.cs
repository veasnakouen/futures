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
    public class JobPositionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public JobPositionsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetJobPositions([FromQuery] int? jobCategoryId)
        {
            var query = _context.JobPosition
                .Include(j => j.JobCategory)
                .Where(c => c.IsDeleted == false);

            // Filter by JobCategoryId if provided
            if (jobCategoryId.HasValue && jobCategoryId.Value > 0)
            {
                query = query.Where(c => c.JobCategoryId == jobCategoryId.Value);
            }

            var jobPositions = query
                .ToList()
                .Select(c => _mapper.Map<JobPosition, JobPositionDto>(c));
            return Ok(jobPositions);
        }

        [HttpGet("{id}")]
        public IActionResult GetJobPosition(int id)
        {
            var jobPositionInDb = _context.JobPosition.SingleOrDefault(c => c.IsDeleted == false && c.Id == id);
            if (jobPositionInDb == null)
                return NotFound();
            return Ok(_mapper.Map<JobPosition, JobPositionDto>(jobPositionInDb));
        }

        [HttpPost]
        public IActionResult CreateJobPosition([FromBody] JobPositionDto jobPositionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var jobPositionInDb = _context.JobPosition.FirstOrDefault(c => c.Name == jobPositionDto.Name);
            if (jobPositionInDb != null)
                return BadRequest();

            var jobPosition = _mapper.Map<JobPositionDto, JobPosition>(jobPositionDto);
            _context.JobPosition.Add(jobPosition);
            _context.SaveChanges();
            jobPositionDto.Id = jobPosition.Id;
            return CreatedAtAction(nameof(GetJobPosition), new { id = jobPositionDto.Id }, jobPositionDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJobPosition(int id, [FromBody] JobPositionDto jobPositionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var jobPosition = _context.JobPosition.FirstOrDefault(c => c.Id != id && c.Name == jobPositionDto.Name);
            if (jobPosition != null)
                return BadRequest();

            var jobPositionInDb = _context.JobPosition.SingleOrDefault(c => c.Id == id);
            if (jobPositionInDb == null)
                return NotFound();

            _mapper.Map(jobPositionDto, jobPositionInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteJobPosition(int id)
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

