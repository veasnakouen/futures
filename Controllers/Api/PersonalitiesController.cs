using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
     [Authorize]
    public class PersonalitiesController : ApiController
    {
        private ApplicationDbContext _context;
        public PersonalitiesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/personalities?clientId={id}
        [HttpGet]
        public IHttpActionResult GetPersonalities(int clientId)
        {
            var personalities = _context.Personalities.Select(Mapper.Map<Personality, PersonalityDto>).Where(c => c.ClientId == clientId);
            return Ok(personalities);
        }

        // GET: /api/personalities/{id}
        [HttpGet]
        public IHttpActionResult GetPersonality(int id)
        {
            var personalitie = _context.Personalities.SingleOrDefault(c => c.Id == id);

            if (personalitie == null)
                return NotFound();

            return Ok(Mapper.Map<Personality, PersonalityDto>(personalitie));
        }

        // POST: /api/personalities
        [HttpPost]
        public IHttpActionResult CreatePersonality(PersonalityDto personalitieDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var personalitie = Mapper.Map<PersonalityDto, Personality>(personalitieDto);

            _context.Personalities.Add(personalitie);
            _context.SaveChanges();

            personalitieDto.Id = personalitie.Id;

            return Created(new Uri(Request.RequestUri + "/" + personalitieDto.Id), personalitieDto);
        }

        // PUT: /api/personalities/{id}
        [HttpPut]
        public IHttpActionResult UpdatePersonality(int id, PersonalityDto personalitiesDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var personalityInDb = _context.Personalities.SingleOrDefault(c => c.ClientId == id);

            if (personalityInDb == null)
            {
                var furtherEducation = Mapper.Map<PersonalityDto, Personality>(personalitiesDto);

                _context.Personalities.Add(furtherEducation);
                _context.SaveChanges();

                personalitiesDto.Id = furtherEducation.Id;

                return Created(new Uri(Request.RequestUri + "/" + personalitiesDto.Id), personalitiesDto);
            }
            else
            {
                Mapper.Map(personalitiesDto, personalityInDb);
                _context.SaveChanges();

                return Ok(new { });
            }
        }

        // DELETE: /api/personalities/{id}
        [HttpDelete]
        public IHttpActionResult DeletePersonality(int id)
        {
            var personalitie = _context.Personalities.SingleOrDefault(c => c.Id == id);

            if (personalitie == null)
                return NotFound();

            _context.Personalities.Remove(personalitie);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
