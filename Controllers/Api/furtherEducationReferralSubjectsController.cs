using AutoMapper;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class furtherEducationReferralSubjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public furtherEducationReferralSubjectsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /api/furthereducationreferrals?clientId={id}
        [HttpGet]
        public IActionResult GetfurtherEducationReferralSubjects()
        {
            var furtherEducationReferralSubjects = _context.furtherEducationReferralSubjects
                                                .Select(_mapper.Map<furtherEducationReferralSubject, furtherEducationReferralSubjectDto>)
                                                .OrderBy(c => c.Subject)
                                                .ToList();
            return Ok(furtherEducationReferralSubjects);
        }

    }
}

