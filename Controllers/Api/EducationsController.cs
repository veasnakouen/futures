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
    public class EducationsController : ApiController
    {
        private ApplicationDbContext _context;
        public EducationsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/educations?clientId={id}
        [HttpGet]
        public IHttpActionResult GetEducations(int clientId)
        {
            var educations = _context.Educations.Select(Mapper.Map<Education, EducationDto>).Where(c => c.ClientId == clientId);

            return Ok(educations);
        }

        // GET: /api/educations/{id}
        [HttpGet]
        public IHttpActionResult GetEducation(int id)
        {
            var education = _context.Educations.SingleOrDefault(c => c.Id == id);

            if (education == null)
                return NotFound();

            return Ok(Mapper.Map<Education, EducationDto>(education));
        }

        // POST: /api/educations
        [HttpPost]
        public IHttpActionResult CreateEducation(EducationDto educationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var education = Mapper.Map<EducationDto, Education>(educationDto);

            _context.Educations.Add(education);
            _context.SaveChanges();

            educationDto.Id = education.Id;

            return Created(new Uri(Request.RequestUri + "/" + educationDto.Id), educationDto);
        }

        // PUT: /api/educations/{id}
        [HttpPut]
        public IHttpActionResult UpdateEducation(int id, EducationDto educationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var educationInDb = _context.Educations.SingleOrDefault(c => c.Id == id);

            if (educationInDb == null)
                return NotFound();

            Mapper.Map(educationDto, educationInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/educations/{id}
        [HttpDelete]
        public IHttpActionResult DeleteEducation(int id)
        {
            var educationInDb = _context.Educations.SingleOrDefault(c => c.Id == id);

            if (educationInDb == null)
                return NotFound();
                
            _context.Educations.Remove(educationInDb);
            _context.SaveChanges();

            return Ok();
        }
    }
}
