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
    public class ComputerSkillsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ComputerSkillsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetComputerSkills([FromQuery] int clientId)
        {
            var computerSkills = _context.ComputerSkills
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<ComputerSkill, ComputerSkillDto>(c));
            return Ok(computerSkills);
        }

        [HttpGet("{id}")]
        public IActionResult GetComputerSkill(int id)
        {
            var computerSkill = _context.ComputerSkills.SingleOrDefault(c => c.Id == id);
            if (computerSkill == null)
                return NotFound();
            return Ok(_mapper.Map<ComputerSkill, ComputerSkillDto>(computerSkill));
        }

        [HttpPost]
        public IActionResult CreateComputerSkill([FromBody] ComputerSkillDto computerSkillDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var computerSkill = _mapper.Map<ComputerSkillDto, ComputerSkill>(computerSkillDto);
            _context.ComputerSkills.Add(computerSkill);
            _context.SaveChanges();
            computerSkillDto.Id = computerSkill.Id;
            return CreatedAtAction(nameof(GetComputerSkill), new { id = computerSkillDto.Id }, computerSkillDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateComputerSkill(int id, [FromBody] ComputerSkillDto computerSkillDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var computerSkillInDb = _context.ComputerSkills.SingleOrDefault(c => c.Id == id);
            if (computerSkillInDb == null)
                return NotFound();

            _mapper.Map(computerSkillDto, computerSkillInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteComputerSkill(int id)
        {
            var computerSkillInDb = _context.ComputerSkills.SingleOrDefault(c => c.Id == id);
            if (computerSkillInDb == null)
                return NotFound();

            _context.ComputerSkills.Remove(computerSkillInDb);
            _context.SaveChanges();
            return Ok();
        }
    }
}

