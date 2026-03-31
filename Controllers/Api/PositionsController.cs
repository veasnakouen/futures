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
    public class PositionsController : ApiController
    {
        private ApplicationDbContext _context;

        public PositionsController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/positions
        [HttpGet]
        public IHttpActionResult GetPositions()
        {
            var positions = _context.Positions.ToList().Select(Mapper.Map<Position, PositionDto>);
            return Ok(positions);
        }

        //GET /api/positions/{id}
        [HttpGet]
        public IHttpActionResult GetPosition(int id)
        {
            var positionInDb = _context.Positions.SingleOrDefault(c => c.Id == id);

            if (positionInDb == null)
                return NotFound();

            return Ok(Mapper.Map<Position, PositionDto>(positionInDb));
        }

        //POST /api/positions
        [HttpPost]
        public IHttpActionResult CreatePosition(PositionDto positionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var position = Mapper.Map<PositionDto, Position>(positionDto);

            _context.Positions.Add(position);
            _context.SaveChanges();

            positionDto.Id = position.Id;

            return Created(new Uri(Request.RequestUri + "/" + positionDto.Id), positionDto);
        }

        //PUT /api/positions/{id}
        [HttpPut]
        public IHttpActionResult UpdatePosition(int id, PositionDto positionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var positionInDb = _context.Positions.SingleOrDefault(c => c.Id == id);

            if (positionInDb == null)
                return NotFound();

            Mapper.Map(positionDto, positionInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/positions/{id}
        [HttpDelete]
        public IHttpActionResult DeletePosition(int id)
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
