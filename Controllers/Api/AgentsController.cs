using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AgentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;

        public AgentsController(ApplicationDbContext context, IMapper mapper, IWebHostEnvironment env)
        {
            _context = context;
            _mapper = mapper;
            _env = env;
        }

        [HttpGet]
        public IActionResult GetAgents()
        {
            var agents = _context.Agents
                .ToList()
                .Select(a => _mapper.Map<AgentDto>(a));

            return Ok(agents);
        }

        [HttpGet("{id}")]
        public IActionResult GetAgent(int id)
        {
            var agentInDb = _context.Agents.SingleOrDefault(c => c.Id == id);
            if (agentInDb == null) return NotFound();
            return Ok(_mapper.Map<AgentDto>(agentInDb));
        }

        [HttpPost]
        public IActionResult CreateAgent()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string imageName = string.Empty;
            var file = Request.Form.Files["UploadedFile"];
            if (file != null && file.Length > 0)
            {
                var uploads = Path.Combine(_env.WebRootPath, "Images");
                Directory.CreateDirectory(uploads);
                imageName = Path.GetFileNameWithoutExtension(file.FileName) + DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss") + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploads, imageName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    file.CopyTo(stream);
                }
            }

            var agentDto = new AgentDto
            {
                Name = Request.Form["name"],
                Photo = imageName
            };

            var agent = _mapper.Map<Agent>(agentDto);
            _context.Agents.Add(agent);
            _context.SaveChanges();

            agentDto.Id = agent.Id;
            return CreatedAtAction(nameof(GetAgent), new { id = agentDto.Id }, agentDto);
        }

        [HttpPut]
        public IActionResult UpdateAgent()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string imageName = string.Empty;
            var file = Request.Form.Files["UploadedFile"];
            int id = int.Parse(Request.Form["id"]);
            var agentInDb = _context.Agents.SingleOrDefault(c => c.Id == id);
            if (agentInDb == null) return NotFound();

            if (file != null && file.Length > 0)
            {
                var uploads = Path.Combine(_env.WebRootPath, "Images");
                Directory.CreateDirectory(uploads);
                imageName = Path.GetFileNameWithoutExtension(file.FileName) + DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss") + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploads, imageName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    file.CopyTo(stream);
                }

                // delete old
                var oldImagePath = Path.Combine(_env.WebRootPath, "Images", agentInDb.Photo ?? string.Empty);
                if (System.IO.File.Exists(oldImagePath)) System.IO.File.Delete(oldImagePath);

                agentInDb.Photo = imageName;
            }

            agentInDb.Name = Request.Form["name"];
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAgent(int id)
        {
            var agentInDb = _context.Agents.SingleOrDefault(c => c.Id == id);
            if (agentInDb == null) return NotFound();
            _context.Agents.Remove(agentInDb);
            _context.SaveChanges();

            var imagePath = Path.Combine(_env.WebRootPath, "Images", agentInDb.Photo ?? string.Empty);
            if (System.IO.File.Exists(imagePath)) System.IO.File.Delete(imagePath);

            return Ok();
        }
    }
}
