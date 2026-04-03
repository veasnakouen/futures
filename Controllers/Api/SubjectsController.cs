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
    public class SubjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SubjectsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetSubjects()
        {
            var subjects = _context.Subjects.ToList().Select(c => _mapper.Map<Subject, SubjectDto>(c));
            return Ok(subjects);
        }

        [HttpGet("{id}")]
        public IActionResult GetSubject(int id)
        {
            var subject = _context.Subjects.SingleOrDefault(c => c.Id == id);
            if (subject == null)
                return NotFound();
            return Ok(_mapper.Map<Subject, SubjectDto>(subject));
        }

        [HttpPost]
        public IActionResult CreateSubject([FromBody] SubjectDto subjectDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Subjects.SingleOrDefault(c => c.SubjectName == subjectDto.SubjectName);
            if (isExists != null)
                return BadRequest();

            var newsubject = _mapper.Map<SubjectDto, Subject>(subjectDto);
            _context.Subjects.Add(newsubject);
            _context.SaveChanges();
            subjectDto.Id = newsubject.Id;
            return CreatedAtAction(nameof(GetSubject), new { id = subjectDto.Id }, subjectDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSubject(int id, [FromBody] SubjectDto subjectDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Subjects.SingleOrDefault(c => c.SubjectName == subjectDto.SubjectName && c.Id != subjectDto.Id);
            if (isExists != null)
                return BadRequest();

            var subjectInDb = _context.Subjects.SingleOrDefault(c => c.Id == id);
            if (subjectInDb == null)
                return NotFound();

            _mapper.Map(subjectDto, subjectInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSubject(int id)
        {
            var subject = _context.Subjects.SingleOrDefault(c => c.Id == id);
            if (subject == null)
                return NotFound();

            _context.Subjects.Remove(subject);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

