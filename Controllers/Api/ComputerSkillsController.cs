using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class ComputerSkillsController : ApiController
    {
        private ApplicationDbContext _context;
        public ComputerSkillsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/computerSkills?clientId={id}
        [HttpGet]
        public IHttpActionResult GetComputerSkills(int clientId)
        {
            var computerSkills = _context.ComputerSkills.Select(Mapper.Map<ComputerSkill, ComputerSkillDto>).Where(c => c.ClientId == clientId);

            return Ok(computerSkills);
        }

        // GET: /api/computerSkills/{id}
        [HttpGet]
        public IHttpActionResult GetComputerSkill(int id)
        {
            var computerSkill = _context.ComputerSkills.SingleOrDefault(c => c.Id == id);

            if (computerSkill == null)
                return NotFound();

            return Ok(Mapper.Map<ComputerSkill, ComputerSkillDto>(computerSkill));
        }

        // POST: /api/computerSkills
        [HttpPost]
        public IHttpActionResult CreateComputerSkill(ComputerSkillDto computerSkillDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var computerSkill = Mapper.Map<ComputerSkillDto, ComputerSkill>(computerSkillDto);

            _context.ComputerSkills.Add(computerSkill);
            _context.SaveChanges();

            computerSkillDto.Id = computerSkill.Id;

            return Created(new Uri(Request.RequestUri + "/" + computerSkillDto.Id), computerSkillDto);
        }

        // PUT: /api/computerSkills/{id}
        [HttpPut]
        public IHttpActionResult UpdateComputerSkill(int id, ComputerSkillDto computerSkillDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var computerSkillInDb = _context.ComputerSkills.SingleOrDefault(c => c.Id == id);

            if (computerSkillInDb == null)
                return NotFound();

            Mapper.Map(computerSkillDto, computerSkillInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/computerSkills/{id}
        [HttpDelete]
        public IHttpActionResult DeleteComputerSkill(int id)
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
