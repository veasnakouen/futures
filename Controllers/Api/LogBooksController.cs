using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LogBooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public LogBooksController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetLogBooks()
        {
            var logbooks = _context.LogBooks.ToList().Select(c => _mapper.Map<LogBook, LogBookDto>(c));
            return Ok(logbooks);
        }

        [HttpGet("{id}")]
        public IActionResult GetLogBook(int id)
        {
            var logbook = _context.LogBooks.SingleOrDefault(c => c.Id == id);
            if (logbook == null)
                return NotFound();
            return Ok(_mapper.Map<LogBook, LogBookDto>(logbook));
        }

        [HttpPost]
        public IActionResult CreateLogBook([FromBody] LogBookDto logBookDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            logBookDto.User = user.FirstName + " " + user.LastName;
            logBookDto.EnrollDate = DateTime.Now;

            if (!ModelState.IsValid)
                return BadRequest();

            var newLogbook = _mapper.Map<LogBookDto, LogBook>(logBookDto);
            _context.LogBooks.Add(newLogbook);
            _context.SaveChanges();
            logBookDto.Id = newLogbook.Id;
            return CreatedAtAction(nameof(GetLogBook), new { id = logBookDto.Id }, logBookDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateLogBook(int id, [FromBody] LogBookDto logBookDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            logBookDto.User = user.FirstName + " " + user.LastName;
            logBookDto.EnrollDate = DateTime.Now;

            if (!ModelState.IsValid)
                return BadRequest();

            var logbookInDb = _context.LogBooks.SingleOrDefault(c => c.Id == id);
            if (logbookInDb == null)
                return NotFound();

            _mapper.Map(logBookDto, logbookInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteLogBook(int id)
        {
            var logBook = _context.LogBooks.SingleOrDefault(c => c.Id == id);
            if (logBook == null)
                return NotFound();

            _context.LogBooks.Remove(logBook);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

