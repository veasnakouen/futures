using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SocialSupportCasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SocialSupportCasesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /api/SocialSupportCases?clientId={id}
        [HttpGet]
        public IActionResult GetSocialSupportCases([FromQuery] int clientId)
        {
            var Socialsupportcases = _context.SocialsupportCases
                                .Include(c => c.Client)
                                .Include(c => c.CaseWorker)
                                .Select(_mapper.Map<SocialsupportCase, SocialsupportCaseDto>)
                                .Where(c => c.ClientId == clientId);
            if (Socialsupportcases == null)
                return NotFound();

            return Ok(Socialsupportcases);
        }

        // GET: /api/SocialSupportCases/{id}/problem
        [HttpGet("{id}/problem")]
        public IActionResult GetSocialSupportCaseBySocialSupportCaseId(int id)
        {
            var SocialsupportProblem = (from
                                        SC in _context.SocialsupportCases
                                        join
                                        SP in _context.SocialSupportProblems
                                        on SC.Id equals SP.SocialSupportCaseId
                                        into SPGroup
                                        from SP in SPGroup.DefaultIfEmpty()
                                        where SC.Id == id
                                        select new
                                        {
                                            SocialproblemId = SP == null ? 0 : SP.Id,
                                            HealthProblemBool = SP == null ? false : SP.HealthProblembool,
                                            DrugProblemBool = SP == null ? false : SP.DrugProblembool,
                                            BabyProblemBool = SP == null ? false : SP.BabyProblembool,
                                            PersonalProblembool = SP == null ? false : SP.PersonalProblembool,
                                            LegalProblembool = SP == null ? false : SP.LegalProblembool,
                                            otherProblembool = SP == null ? false : SP.OtherProblembool,
                                            NoteProblem= SP == null ? " " : SP.Note,
                                            StatusProblem = SP == null ? " " : SP.Status,
                                            SocialCaseId = SC.Id,
                                            HaveCaseManager = SC.HaveCaseManager,
                                            CaseworkerId = SC.CaseWorkerId,
                                            OpenDate = SC.OpenDate,
                                            CloseDate = SC.CloseDate,
                                            HaveProblem = SC.HaveProblem,
                                            ClientId = SC.ClientId,
                                            AccessBy = SC.AccessBy,
                                            AccessDate = SC.AccessDate,
                                            Status = SC.Status
                                        }).FirstOrDefault();
            if (SocialsupportProblem == null)
                return NotFound();

            return Ok(SocialsupportProblem);
        }

        // GET: /api/SocialSupportCases/{id}
        [HttpGet("{id}")]
        public IActionResult GetSocialSupportCase(int id)
        {
            var Socialsupportcases = _context.SocialsupportCases
                                .Include(c => c.Client)
                                .Include(c => c.CaseWorker)
                                .Select(_mapper.Map<SocialsupportCase, SocialsupportCaseDto>)
                                .Where(c => c.Id == id);
            if (Socialsupportcases == null)
                return NotFound();

            return Ok(Socialsupportcases);
        }

        // POST: /api/SocialSupportCases
        [HttpPost]
        public IActionResult CreateSocialSupportCases([FromBody] SocialsupportCaseDto socialsupportCaseDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            socialsupportCaseDto.AccessBy = user.FirstName + " " + user.LastName;
            socialsupportCaseDto.AccessDate = DateTime.Today;
            
            if (!ModelState.IsValid)
                return BadRequest();

            var IsExist = _context.SocialsupportCases.FirstOrDefault(c => c.ClientId == socialsupportCaseDto.ClientId);

            if (IsExist != null)
            {
                return BadRequest();
            }
            
            var newSocialSupportCase = _mapper.Map<SocialsupportCaseDto, SocialsupportCase>(socialsupportCaseDto);

            _context.SocialsupportCases.Add(newSocialSupportCase);
            _context.SaveChanges();
            socialsupportCaseDto.Id = newSocialSupportCase.Id;
            return CreatedAtAction(nameof(GetSocialSupportCases), new { clientId = socialsupportCaseDto.ClientId }, socialsupportCaseDto);
        }


        //Save with problem
        // POST: /api/SocialSupportCases/withproblem
        [HttpPost("withproblem")]
        public IActionResult CreateSocialSupportWithProblem([FromBody] SocialsupportCaseMulObj SocialsupportCaseMulObj)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            SocialsupportCaseMulObj.SocialsupportCaseDto.AccessBy = user.FirstName + " " + user.LastName;

            SocialsupportCaseMulObj.SocialsupportCaseDto.AccessDate = DateTime.Today;

            if (!ModelState.IsValid)
                return BadRequest();

            var IsExist = _context.SocialsupportCases.FirstOrDefault(c => c.ClientId == SocialsupportCaseMulObj.SocialsupportCaseDto.ClientId);

            if (IsExist != null)
            {
                return BadRequest();
            }

            var newSocialSupportCase = _mapper.Map<SocialsupportCaseDto, SocialsupportCase>(SocialsupportCaseMulObj.SocialsupportCaseDto);

            _context.SocialsupportCases.Add(newSocialSupportCase);

            SocialsupportCaseMulObj.SocialSupportProblemDto.SocialSupportCaseId = newSocialSupportCase.Id;
            SocialsupportCaseMulObj.SocialSupportProblemDto.Status = "Active";

            var newSocialSupportProblem = _mapper.Map<SocialSupportProblemDto, SocialSupportProblem>(SocialsupportCaseMulObj.SocialSupportProblemDto);

            _context.SocialSupportProblems.Add(newSocialSupportProblem);

            _context.SaveChanges();

            SocialsupportCaseMulObj.SocialsupportCaseDto.Id = newSocialSupportCase.Id;

            return CreatedAtAction(nameof(GetSocialSupportCases), new { clientId = SocialsupportCaseMulObj.SocialsupportCaseDto.ClientId }, SocialsupportCaseMulObj.SocialsupportCaseDto);
        }

        // PUT: /api/SocialSupportCases/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateSocialSupportCases(int id, [FromBody] SocialsupportCaseDto socialsupportCaseDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            socialsupportCaseDto.AccessBy = user.FirstName + " " + user.LastName;
            socialsupportCaseDto.AccessDate = DateTime.Today;

            if (!ModelState.IsValid)
                return BadRequest();

            var SocialSupportCasesInDb = _context.SocialsupportCases.SingleOrDefault(c => c.Id == socialsupportCaseDto.Id);

            if (SocialSupportCasesInDb == null)
                return NotFound();

            if (socialsupportCaseDto.HaveProblem == "NoHave")
            {
                var SocialSupportProblemInDb = _context.SocialSupportProblems.SingleOrDefault(c => c.SocialSupportCaseId == socialsupportCaseDto.Id);
                if (SocialSupportProblemInDb != null)
                {
                    SocialSupportProblemInDb.Status = "Deactive";
                }
            }
          
            _mapper.Map(socialsupportCaseDto, SocialSupportCasesInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        // PUT: /api/SocialSupportCases/{id}/withproblem
        [HttpPut("{id}/withproblem")]
        public IActionResult UpdateSocialSupportCasesWithProblem(int id, [FromBody] SocialsupportCaseMulObj SocialsupportCaseMulObj)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            SocialsupportCaseMulObj.SocialsupportCaseDto.AccessBy = user.FirstName + " " + user.LastName;
            SocialsupportCaseMulObj.SocialsupportCaseDto.AccessDate = DateTime.Today;

            if (!ModelState.IsValid)
                return BadRequest();

            var socialSupportProblemIndb = _context.SocialSupportProblems.SingleOrDefault(c => c.SocialSupportCaseId == SocialsupportCaseMulObj.SocialsupportCaseDto.Id);

            if (socialSupportProblemIndb == null)
            {
                SocialsupportCaseMulObj.SocialSupportProblemDto.Status = "Active";
                SocialsupportCaseMulObj.SocialSupportProblemDto.SocialSupportCaseId = SocialsupportCaseMulObj.SocialsupportCaseDto.Id;
                var socialSupportProblemDto = _mapper.Map<SocialSupportProblemDto, SocialSupportProblem>(SocialsupportCaseMulObj.SocialSupportProblemDto);
                _context.SocialSupportProblems.Add(socialSupportProblemDto);
            }
            else
            {
                SocialsupportCaseMulObj.SocialSupportProblemDto.Status = "Active";
                SocialsupportCaseMulObj.SocialSupportProblemDto.SocialSupportCaseId = SocialsupportCaseMulObj.SocialsupportCaseDto.Id;
                _mapper.Map(SocialsupportCaseMulObj.SocialSupportProblemDto, socialSupportProblemIndb);
            }


            var socialSupportCaseIndb = _context.SocialsupportCases.SingleOrDefault(c => c.Id == SocialsupportCaseMulObj.SocialsupportCaseDto.Id);

            if (socialSupportCaseIndb == null)
                return NotFound();

            _mapper.Map(SocialsupportCaseMulObj.SocialsupportCaseDto, socialSupportCaseIndb);

            _context.SaveChanges();
            return Ok(new { });
        }

        //// DELETE: /api/SocialSupportCases/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteSocialSupportCase(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var socialSupportProblemIndb = _context.SocialSupportProblems.SingleOrDefault(c => c.SocialSupportCaseId == id);

            if (socialSupportProblemIndb != null)
            {
                _context.SocialSupportProblems.Remove(socialSupportProblemIndb);
            }

            var socialSupportCaseIndb = _context.SocialsupportCases.SingleOrDefault(c => c.Id == id);
            if (socialSupportCaseIndb == null)
            {
                return NotFound();
            }

            _context.SocialsupportCases.Remove(socialSupportCaseIndb);
            _context.SaveChanges();

            return Ok(new { });
        }

    }
}

