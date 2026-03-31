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
    public class ReferralSourcesController : ApiController
    {
        private ApplicationDbContext _context;
        public ReferralSourcesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/referralsources
        [HttpGet]
        public IHttpActionResult GetReferralSources()
        {
            var referralSources = _context.EducationReferralSources
                                    .ToList()
                                    .Select(Mapper.Map<EducationReferralSource, EducationReferralSourceDto>);
            return Ok(referralSources);
        }

        // GET: /api/referralsources/{id}
        [HttpGet]
        public IHttpActionResult GetReferralSource(int id)
        {
            var referralSource = _context.EducationReferralSources.SingleOrDefault(c => c.Id == id);

            if (referralSource == null)
                return NotFound();

            return Ok(Mapper.Map<EducationReferralSource, EducationReferralSourceDto>(referralSource));
        }

        // POST: /api/referralsources
        [HttpPost]
        public IHttpActionResult CreateReferralSource(EducationReferralSourceDto educationReferralSourceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.EducationReferralSources.SingleOrDefault(c => c.ReferralSource == educationReferralSourceDto.ReferralSource);

            if (isExists != null)
                return BadRequest();

            var newReferralSource = Mapper.Map<EducationReferralSourceDto, EducationReferralSource>(educationReferralSourceDto);

            _context.EducationReferralSources.Add(newReferralSource);
            _context.SaveChanges();

            educationReferralSourceDto.Id = newReferralSource.Id;
            
            return Created(new Uri(Request.RequestUri + "/" + educationReferralSourceDto.Id), educationReferralSourceDto);
        }

        // PUT: /api/referralsources/{id}
        [HttpPut]
        public IHttpActionResult UpdateReferralSource(int id, EducationReferralSourceDto educationReferralSourceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.EducationReferralSources.SingleOrDefault(c => c.Id != educationReferralSourceDto.Id && c.ReferralSource == educationReferralSourceDto.ReferralSource);

            if (isExists != null)
                return BadRequest();

            var referralSourceInDb = _context.EducationReferralSources.SingleOrDefault(c => c.Id == id);

            Mapper.Map(educationReferralSourceDto, referralSourceInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/referralsources/{id}
        [HttpDelete]
        public IHttpActionResult DeleteReferralSource(int id)
        {
            var referralSourceInDb = _context.EducationReferralSources.SingleOrDefault(c => c.Id == id);

            if (referralSourceInDb == null)
                return NotFound();

            _context.EducationReferralSources.Remove(referralSourceInDb);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
