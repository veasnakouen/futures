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
    public class TicketTypesController : ApiController
    {
        private ApplicationDbContext _context;

        public TicketTypesController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/tickettypes
        [HttpGet]
        public IHttpActionResult GetTicketTypes()
        {
            var ticketTypeDtos = _context.TicketTypes
                .ToList()
                .Select(Mapper.Map<TicketType, TicketTypeDto>);

            return Ok(ticketTypeDtos);
        }

        //GET /api/tickettypes/{id}
        [HttpGet]
        public IHttpActionResult GetTicketType(int id)
        {
            var ticketTypeInDb = _context.TicketTypes.SingleOrDefault(c => c.Id == id);

            if (ticketTypeInDb == null)
                return NotFound();

            return Ok(Mapper.Map<TicketType, TicketTypeDto>(ticketTypeInDb));
        }

        //POST /api/tickettypes
        [HttpPost]
        public IHttpActionResult CreateTicketType(TicketTypeDto ticketTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var ticketType = Mapper.Map<TicketTypeDto, TicketType>(ticketTypeDto);

            _context.TicketTypes.Add(ticketType);
            _context.SaveChanges();

            ticketTypeDto.Id = ticketType.Id;

            return Created(new Uri(Request.RequestUri + "/" + ticketTypeDto.Id), ticketTypeDto);
        }

        //PUT /api/tickettypes/{id}
        [HttpPut]
        public IHttpActionResult UpdateTicketType(int id, TicketTypeDto ticketTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var ticketTypeInDb = _context.TicketTypes.SingleOrDefault(c => c.Id == id);

            if (ticketTypeInDb == null)
                return NotFound();

            Mapper.Map(ticketTypeDto, ticketTypeInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/tickettypes/{id}
        [HttpDelete]
        public IHttpActionResult DeleteTicketType(int id)
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
