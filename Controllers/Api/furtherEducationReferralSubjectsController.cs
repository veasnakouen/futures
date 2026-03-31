using AutoMapper;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
    public class furtherEducationReferralSubjectsController : ApiController
    {
        private ApplicationDbContext _context;
        public furtherEducationReferralSubjectsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/furthereducationreferrals?clientId={id}
        [HttpGet]
        public IHttpActionResult GetfurtherEducationReferralSubjects()
        {
            var furtherEducationReferralSubjects = _context.furtherEducationReferralSubjects
                                                .Select(Mapper.Map<furtherEducationReferralSubject, furtherEducationReferralSubjectDto>)
                                                .OrderBy(c => c.Subject)
                                                .ToList();
            return Ok(furtherEducationReferralSubjects);
        }

    }
}
