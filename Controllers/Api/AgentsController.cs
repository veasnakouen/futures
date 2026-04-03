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
    public class AgentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AgentsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAgents()
        {
            var agentDtos = _context.Agents.ToList().Select(a => _mapper.Map<Agent, AgentDto>(a));
            return Ok(agentDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetAgent(int id)
        {
            var agent = _context.Agents.SingleOrDefault(c => c.Id == id);
            if (agent == null) return NotFound();
            return Ok(_mapper.Map<Agent, AgentDto>(agent));
        }

        [HttpPost]
        public IActionResult CreateAgent([FromBody] AgentDto agentDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var agent = _mapper.Map<AgentDto, Agent>(agentDto);
            _context.Agents.Add(agent);
            _context.SaveChanges();
            agentDto.Id = agent.Id;
            return CreatedAtAction(nameof(GetAgent), new { id = agentDto.Id }, agentDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateAgent(int id, [FromBody] AgentDto agentDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var agentInDb = _context.Agents.SingleOrDefault(c => c.Id == id);
            if (agentInDb == null) return NotFound();
            _mapper.Map(agentDto, agentInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAgent(int id)
        {
            var agentInDb = _context.Agents.SingleOrDefault(c => c.Id == id);
            if (agentInDb == null) return NotFound();
            _context.Agents.Remove(agentInDb);
            _context.SaveChanges();
            return Ok();
        }
    }
}
