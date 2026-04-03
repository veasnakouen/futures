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
    public class PositionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PositionsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetPositions()
        {
            var positions = _context.Positions.ToList().Select(c => _mapper.Map<Position, PositionDto>(c));
            return Ok(positions);
        }

        [HttpGet("{id}")]
        public IActionResult GetPosition(int id)
        {
            var positionInDb = _context.Positions.SingleOrDefault(c => c.Id == id);
            if (positionInDb == null)
                return NotFound();
            return Ok(_mapper.Map<Position, PositionDto>(positionInDb));
        }

        [HttpPost]
        public IActionResult CreatePosition([FromBody] PositionDto positionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var position = _mapper.Map<PositionDto, Position>(positionDto);
            _context.Positions.Add(position);
            _context.SaveChanges();
            positionDto.Id = position.Id;
            return CreatedAtAction(nameof(GetPosition), new { id = positionDto.Id }, positionDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePosition(int id, [FromBody] PositionDto positionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var positionInDb = _context.Positions.SingleOrDefault(c => c.Id == id);
            if (positionInDb == null)
                return NotFound();

            _mapper.Map(positionDto, positionInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePosition(int id)
        {
            try
            {
                var position = _context.Positions.SingleOrDefault(c => c.Id == id);
                if (position == null)
                    return NotFound();

                _context.Positions.Remove(position);
                _context.SaveChanges();
                return Ok(new { });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}

