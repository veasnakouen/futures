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
    public class PersonalitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PersonalitiesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetPersonalities([FromQuery] int clientId)
        {
            var personalities = _context.Personalities
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<Personality, PersonalityDto>(c));
            return Ok(personalities);
        }

        [HttpGet("{id}")]
        public IActionResult GetPersonality(int id)
        {
            var personality = _context.Personalities.SingleOrDefault(c => c.Id == id);
            if (personality == null)
                return NotFound();
            return Ok(_mapper.Map<Personality, PersonalityDto>(personality));
        }

        [HttpPost]
        public IActionResult CreatePersonality([FromBody] PersonalityDto personalityDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var personality = _mapper.Map<PersonalityDto, Personality>(personalityDto);
            _context.Personalities.Add(personality);
            _context.SaveChanges();
            personalityDto.Id = personality.Id;
            return CreatedAtAction(nameof(GetPersonality), new { id = personalityDto.Id }, personalityDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePersonality(int id, [FromBody] PersonalityDto personalityDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var personalityInDb = _context.Personalities.SingleOrDefault(c => c.ClientId == id);

            if (personalityInDb == null)
            {
                var personality = _mapper.Map<PersonalityDto, Personality>(personalityDto);
                _context.Personalities.Add(personality);
                _context.SaveChanges();
                personalityDto.Id = personality.Id;
                return CreatedAtAction(nameof(GetPersonality), new { id = personalityDto.Id }, personalityDto);
            }
            else
            {
                _mapper.Map(personalityDto, personalityInDb);
                _context.SaveChanges();
                return Ok(new { });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePersonality(int id)
        {
            var personality = _context.Personalities.SingleOrDefault(c => c.Id == id);
            if (personality == null)
                return NotFound();

            _context.Personalities.Remove(personality);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

