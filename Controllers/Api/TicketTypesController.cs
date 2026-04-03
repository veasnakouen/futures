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
    public class TicketTypesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TicketTypesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetTicketTypes()
        {
            var ticketTypeDtos = _context.TicketTypes
                .ToList()
                .Select(c => _mapper.Map<TicketType, TicketTypeDto>(c));
            return Ok(ticketTypeDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetTicketType(int id)
        {
            var ticketTypeInDb = _context.TicketTypes.SingleOrDefault(c => c.Id == id);
            if (ticketTypeInDb == null)
                return NotFound();
            return Ok(_mapper.Map<TicketType, TicketTypeDto>(ticketTypeInDb));
        }

        [HttpPost]
        public IActionResult CreateTicketType([FromBody] TicketTypeDto ticketTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var ticketType = _mapper.Map<TicketTypeDto, TicketType>(ticketTypeDto);
            _context.TicketTypes.Add(ticketType);
            _context.SaveChanges();
            ticketTypeDto.Id = ticketType.Id;
            return CreatedAtAction(nameof(GetTicketType), new { id = ticketTypeDto.Id }, ticketTypeDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTicketType(int id, [FromBody] TicketTypeDto ticketTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var ticketTypeInDb = _context.TicketTypes.SingleOrDefault(c => c.Id == id);
            if (ticketTypeInDb == null)
                return NotFound();

            _mapper.Map(ticketTypeDto, ticketTypeInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTicketType(int id)
        {
            var ticketTypeInDb = _context.TicketTypes.SingleOrDefault(c => c.Id == id);
            if (ticketTypeInDb == null)
                return NotFound();

            _context.TicketTypes.Remove(ticketTypeInDb);
            _context.SaveChanges();
            return Ok();
        }
    }
}

