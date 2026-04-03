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
    public class LessionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public LessionsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetLessions()
        {
            var lessions = _context.Lessions.Include(c => c.Subject).ToList().Select(c => _mapper.Map<Lession, LessionDto>(c));
            return Ok(lessions);
        }

        [HttpGet("{id}")]
        public IActionResult GetLession(int id)
        {
            var lession = _context.Lessions.SingleOrDefault(c => c.Id == id);
            if (lession == null)
                return NotFound();
            return Ok(_mapper.Map<Lession, LessionDto>(lession));
        }

        [HttpGet("bysubject")]
        public IActionResult GetLessionBySubject([FromQuery] int subjectId)
        {
            var lessions = _context.Lessions
                .Include(c => c.Subject)
                .Where(c => c.SubjectId == subjectId)
                .ToList()
                .Select(c => _mapper.Map<Lession, LessionDto>(c));
            return Ok(lessions);
        }

        [HttpPost]
        public IActionResult CreateLession([FromBody] LessionDto lessionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Lessions.FirstOrDefault(c => c.LessionSub == lessionDto.LessionSub && c.SubjectId == lessionDto.SubjectId);
            if (isExists != null)
                return BadRequest();

            var newlession = _mapper.Map<LessionDto, Lession>(lessionDto);
            _context.Lessions.Add(newlession);
            _context.SaveChanges();
            lessionDto.Id = newlession.Id;
            return CreatedAtAction(nameof(GetLession), new { id = lessionDto.Id }, lessionDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateLession(int id, [FromBody] LessionDto lessionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Lessions.SingleOrDefault(c => c.LessionSub == lessionDto.LessionSub && c.SubjectId == lessionDto.SubjectId && c.Id != lessionDto.Id);
            if (isExists != null)
                return BadRequest();

            var lessionInDb = _context.Lessions.SingleOrDefault(c => c.Id == id);
            if (lessionInDb == null)
                return NotFound();

            _mapper.Map(lessionDto, lessionInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteLession(int id)
        {
            var lession = _context.Lessions.SingleOrDefault(c => c.Id == id);
            if (lession == null)
                return NotFound();

            _context.Lessions.Remove(lession);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

