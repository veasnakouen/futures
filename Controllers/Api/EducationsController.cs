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
    public class EducationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public EducationsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetEducations([FromQuery] int clientId)
        {
            var educations = _context.Educations
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<Education, EducationDto>(c));
            return Ok(educations);
        }

        [HttpGet("{id}")]
        public IActionResult GetEducation(int id)
        {
            var education = _context.Educations.SingleOrDefault(c => c.Id == id);
            if (education == null)
                return NotFound();
            return Ok(_mapper.Map<Education, EducationDto>(education));
        }

        [HttpPost]
        public IActionResult CreateEducation([FromBody] EducationDto educationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var education = _mapper.Map<EducationDto, Education>(educationDto);
            _context.Educations.Add(education);
            _context.SaveChanges();
            educationDto.Id = education.Id;
            return CreatedAtAction(nameof(GetEducation), new { id = educationDto.Id }, educationDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEducation(int id, [FromBody] EducationDto educationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var educationInDb = _context.Educations.SingleOrDefault(c => c.Id == id);
            if (educationInDb == null)
                return NotFound();

            _mapper.Map(educationDto, educationInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEducation(int id)
        {
            var educationInDb = _context.Educations.SingleOrDefault(c => c.Id == id);
            if (educationInDb == null)
                return NotFound();

            _context.Educations.Remove(educationInDb);
            _context.SaveChanges();
            return Ok();
        }
    }
}

