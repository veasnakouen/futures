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
    public class SocialCareController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SocialCareController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public IActionResult GetSocialCare(int id)
        {
            var socialCare = _context.SocialCare.SingleOrDefault(c => c.Id == id);
            if (socialCare == null)
                return NotFound();
            return Ok(_mapper.Map<SocialCare, SocialCareDto>(socialCare));
        }

        [HttpGet]
        public IActionResult GetSocialCareByClientId([FromQuery] int clientId)
        {
            var socialCare = _context.SocialCare
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<SocialCare, SocialCareDto>(c));
            return Ok(socialCare);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSocialCare(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var socialCareInDb = _context.SocialCare.SingleOrDefault(c => c.ClientId == id);

            var socialCareDto = new SocialCareDto()
            {
                ClientId = int.Parse(Request.Form["ClientId"]),
                SocialSupportNeeded = Boolean.Parse(Request.Form["socialsupportNeeded"]),
                MeetingFuture = Boolean.Parse(Request.Form["Meetingfuture"]),
                Problem = Boolean.Parse(Request.Form["problems"])
            };

            if (socialCareInDb == null)
            {
                var socialCare = _mapper.Map<SocialCareDto, SocialCare>(socialCareDto);
                _context.SocialCare.Add(socialCare);
                _context.SaveChanges();
                socialCareDto.Id = socialCare.Id;
                return CreatedAtAction(nameof(GetSocialCare), new { id = socialCareDto.Id }, socialCareDto);
            }
            else
            {
                _mapper.Map(socialCareDto, socialCareInDb);
                _context.SaveChanges();
                return Ok(new { });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSocialCare(int id)
        {
            var socialCare = _context.SocialCare.SingleOrDefault(c => c.Id == id);
            if (socialCare == null)
                return NotFound();

            _context.SocialCare.Remove(socialCare);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

