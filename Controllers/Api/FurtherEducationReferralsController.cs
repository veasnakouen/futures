using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using MtpApp.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FurtherEducationReferralsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public FurtherEducationReferralsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /api/furthereducationreferrals?clientId={}
        [HttpGet]
        public IActionResult GetFurtherEducationReferrals( int clientId)
        {
                var furtherEducationReferrals = _context.FurtherEducationReferrals
                                                                              .Include(c => c.EducationReferralSource)
                                                                              .Include(c => c.furtherEducationReferralSubject)
                                                                              .Include(c => c.Clients)
                                                                              .Select(_mapper.Map<FurtherEducationReferral, FurtherEducationReferralDto>)
                                                                              .Where(c => c.ClientId == clientId );
                return Ok(furtherEducationReferrals);  
        }


        // GET: /api/furthereducationreferrals/{id}
        [HttpGet("{id}")]
        public IActionResult GetFurtherEducationReferral(int id)
        {
            var furtherEducationReferralInDb = _context.FurtherEducationReferrals
                                                .Include(c => c.EducationReferralSource)
                                                .Include(c => c.furtherEducationReferralSubject)
                                                .SingleOrDefault(c => c.Id == id);

            if (furtherEducationReferralInDb == null)
                return NotFound();

            var viewModel = new FurtherEducationReferralViewModel()
            {
                FurtherEducationReferralDto = _mapper.Map<FurtherEducationReferral, FurtherEducationReferralDto>(furtherEducationReferralInDb),
                EducationReferralSource = _context.EducationReferralSources.ToList()
            };

            return Ok(viewModel);
        }

        // POST: /api/furthereducationreferrals
        [HttpPost]
        public IActionResult CreateFurtherEducationReferral(FurtherEducationReferralDto furtherEducationReferralDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            furtherEducationReferralDto.ReferralBy = user.FirstName + " " + user.LastName;

            var furtherEducationReferral = _mapper.Map<FurtherEducationReferralDto, FurtherEducationReferral>(furtherEducationReferralDto);

            _context.FurtherEducationReferrals.Add(furtherEducationReferral);
            _context.SaveChanges();

            furtherEducationReferralDto.Id = furtherEducationReferral.Id;

            return CreatedAtAction(nameof(GetFurtherEducationReferral), new { id = furtherEducationReferralDto.Id }, furtherEducationReferralDto);
        }

        // PUT: /api/furthereducationreferrals/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateFurtherEducationReferral(int id, FurtherEducationReferralDto furtherEducationReferralDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var furtherEducationReferralInDb = _context.FurtherEducationReferrals.SingleOrDefault(c => c.Id == id);

            if (furtherEducationReferralInDb == null)
                return NotFound();

            furtherEducationReferralDto.ReferralBy = furtherEducationReferralInDb.ReferralBy;

            _mapper.Map(furtherEducationReferralDto, furtherEducationReferralInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/furthereducationreferrals/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteFurtherEducationReferral(int id)
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

