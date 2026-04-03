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
    public class ReferralSourcesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ReferralSourcesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetReferralSources()
        {
            var referralSources = _context.EducationReferralSources
                .ToList()
                .Select(c => _mapper.Map<EducationReferralSource, EducationReferralSourceDto>(c));
            return Ok(referralSources);
        }

        [HttpGet("{id}")]
        public IActionResult GetReferralSource(int id)
        {
            var referralSource = _context.EducationReferralSources.SingleOrDefault(c => c.Id == id);
            if (referralSource == null)
                return NotFound();
            return Ok(_mapper.Map<EducationReferralSource, EducationReferralSourceDto>(referralSource));
        }

        [HttpPost]
        public IActionResult CreateReferralSource([FromBody] EducationReferralSourceDto educationReferralSourceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.EducationReferralSources.SingleOrDefault(c => c.ReferralSource == educationReferralSourceDto.ReferralSource);
            if (isExists != null)
                return BadRequest();

            var newReferralSource = _mapper.Map<EducationReferralSourceDto, EducationReferralSource>(educationReferralSourceDto);
            _context.EducationReferralSources.Add(newReferralSource);
            _context.SaveChanges();
            educationReferralSourceDto.Id = newReferralSource.Id;
            return CreatedAtAction(nameof(GetReferralSource), new { id = educationReferralSourceDto.Id }, educationReferralSourceDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateReferralSource(int id, [FromBody] EducationReferralSourceDto educationReferralSourceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.EducationReferralSources.SingleOrDefault(c => c.Id != educationReferralSourceDto.Id && c.ReferralSource == educationReferralSourceDto.ReferralSource);
            if (isExists != null)
                return BadRequest();

            var referralSourceInDb = _context.EducationReferralSources.SingleOrDefault(c => c.Id == id);
            if (referralSourceInDb == null)
                return NotFound();

            _mapper.Map(educationReferralSourceDto, referralSourceInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteReferralSource(int id)
        {
            var referralSourceInDb = _context.EducationReferralSources.SingleOrDefault(c => c.Id == id);
            if (referralSourceInDb == null)
                return NotFound();

            _context.EducationReferralSources.Remove(referralSourceInDb);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

