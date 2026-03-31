using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using MtpApp.ViewModels;
using Microsoft.AspNet.Identity;

namespace MtpApp.Controllers.Api
{
     [Authorize]
    public class FurtherEducationReferralsController : ApiController
    {
        private ApplicationDbContext _context;
        public FurtherEducationReferralsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/furthereducationreferrals?clientId={}
        [HttpGet]
        public IHttpActionResult GetFurtherEducationReferrals( int clientId)
        {
                var furtherEducationReferrals = _context.FurtherEducationReferrals
                                                                              .Include(c => c.EducationReferralSource)
                                                                              .Include(c => c.furtherEducationReferralSubject)
                                                                              .Include(c => c.Clients)
                                                                              .Select(Mapper.Map<FurtherEducationReferral, FurtherEducationReferralDto>)
                                                                              .Where(c => c.ClientId == clientId );
                return Ok(furtherEducationReferrals);  
        }


        // GET: /api/furthereducationreferrals/{id}
        [HttpGet]
        public IHttpActionResult GetFurtherEducationReferral(int id)
        {
            var furtherEducationReferralInDb = _context.FurtherEducationReferrals
                                                .Include(c => c.EducationReferralSource)
                                                .Include(c => c.furtherEducationReferralSubject)
                                                .SingleOrDefault(c => c.Id == id);

            if (furtherEducationReferralInDb == null)
                return NotFound();

            var viewModel = new FurtherEducationReferralViewModel()
            {
                FurtherEducationReferralDto = Mapper.Map<FurtherEducationReferral, FurtherEducationReferralDto>(furtherEducationReferralInDb),
                EducationReferralSource = _context.EducationReferralSources.ToList()
            };

            return Ok(viewModel);
        }

        // POST: /api/furthereducationreferrals
        [HttpPost]
        public IHttpActionResult CreateFurtherEducationReferral(FurtherEducationReferralDto furtherEducationReferralDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            furtherEducationReferralDto.ReferralBy = user.FirstName + " " + user.LastName;

            var furtherEducationReferral = Mapper.Map<FurtherEducationReferralDto, FurtherEducationReferral>(furtherEducationReferralDto);

            _context.FurtherEducationReferrals.Add(furtherEducationReferral);
            _context.SaveChanges();

            furtherEducationReferralDto.Id = furtherEducationReferral.Id;

            return Created(new Uri(Request.RequestUri + "/" + furtherEducationReferralDto.Id), furtherEducationReferralDto);
        }

        // PUT: /api/furthereducationreferrals/{id}
        [HttpPut]
        public IHttpActionResult UpdateFurtherEducationReferral(int id, FurtherEducationReferralDto furtherEducationReferralDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var furtherEducationReferralInDb = _context.FurtherEducationReferrals.SingleOrDefault(c => c.Id == id);

            if (furtherEducationReferralInDb == null)
                return NotFound();

            furtherEducationReferralDto.ReferralBy = furtherEducationReferralInDb.ReferralBy;

            Mapper.Map(furtherEducationReferralDto, furtherEducationReferralInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/furthereducationreferrals/{id}
        [HttpDelete]
        public IHttpActionResult DeleteFurtherEducationReferral(int id)
        {
            var furtherEducationReferralInDb = _context.FurtherEducationReferrals.SingleOrDefault(c => c.Id == id);

            if (furtherEducationReferralInDb == null)
                return NotFound();

            _context.FurtherEducationReferrals.Remove(furtherEducationReferralInDb);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
