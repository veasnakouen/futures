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
    public class SocialSupportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SocialSupportsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetSocialSupports([FromQuery] int? clientId)
        {
            if (clientId.HasValue)
            {
                var socialSupports = _context.SocialSupports
                    .Where(c => c.ClientId == clientId.Value)
                    .ToList()
                    .Select(c => _mapper.Map<SocialSupport, SocialSupportDto>(c));
                return Ok(socialSupports);
            }
            else
            {
                var socialSupports = _context.SocialSupports
                    .ToList()
                    .Select(c => _mapper.Map<SocialSupport, SocialSupportDto>(c));
                return Ok(socialSupports);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetSocialSupport(int id)
        {
            var socialSupportInDb = _context.SocialSupports.SingleOrDefault(c => c.Id == id);
            if (socialSupportInDb == null)
                return NotFound();
            return Ok(_mapper.Map<SocialSupport, SocialSupportDto>(socialSupportInDb));
        }

        [HttpPost]
        public IActionResult CreateSocialSupport([FromBody] SocialSupportDto socialSupportDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var newSocialSupport = _mapper.Map<SocialSupportDto, SocialSupport>(socialSupportDto);
            _context.SocialSupports.Add(newSocialSupport);
            _context.SaveChanges();
            socialSupportDto.Id = newSocialSupport.Id;
            return CreatedAtAction(nameof(GetSocialSupport), new { id = socialSupportDto.Id }, socialSupportDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSocialSupport(int id, [FromBody] SocialSupportDto socialSupportDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var socialSupportInDb = _context.SocialSupports.SingleOrDefault(c => c.Id == id);
            if (socialSupportInDb == null)
                return NotFound();

            _mapper.Map(socialSupportDto, socialSupportInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSocialSupport(int id)
        {
            var socialSupportInDb = _context.SocialSupports.SingleOrDefault(c => c.Id == id);
            if (socialSupportInDb == null)
                return NotFound();

            _context.SocialSupports.Remove(socialSupportInDb);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

