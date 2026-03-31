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
using Microsoft.AspNet.Identity;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class SocialSupportCasesController : ApiController
    {
        private ApplicationDbContext _context;
        public SocialSupportCasesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/SocialSupportCases?clientId={id}
        [HttpGet]
        public IHttpActionResult GetSocialSupportCases(int clientId)
        {
            var Socialsupportcases = _context.SocialsupportCases
                                .Include(c => c.Client)
                                .Include(c => c.CaseWorker)
                                .Select(Mapper.Map<SocialsupportCase, SocialsupportCaseDto>)
                                .Where(c => c.ClientId == clientId);
            if (Socialsupportcases == null)
                return NotFound();

            return Ok(Socialsupportcases);
        }

        // GET: /api/SocialSupportCases?SocialSupportCaseId={id}
        [HttpGet]
        public IHttpActionResult GetSocialSupportCaseBySocialSupportCaseId(int SocialSupportCaseId)
        {
            var SocialsupportProblem = (from
                                        SC in _context.SocialsupportCases
                                        join
                                        SP in _context.SocialSupportProblems
                                        on SC.Id equals SP.SocialSupportCaseId
                                        into SPGroup
                                        from SP in SPGroup.DefaultIfEmpty()
                                        where SC.Id == SocialSupportCaseId
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

        // GET: /api/SocialSupportCases
        [HttpGet]
        public IHttpActionResult GetSocialSupportCase(int Id)
        {
            var Socialsupportcases = _context.SocialsupportCases
                                .Include(c => c.Client)
                                .Include(c => c.CaseWorker)
                                .Select(Mapper.Map<SocialsupportCase, SocialsupportCaseDto>)
                                .Where(c => c.Id == Id);
            if (Socialsupportcases == null)
                return NotFound();

            return Ok(Socialsupportcases);
        }

        // POST: /api/SocialSupportCases
        [HttpPost]
        public IHttpActionResult CreateSocialSupportCases(SocialsupportCaseDto socialsupportCaseDto)
        {
            var userId = User.Identity.GetUserId();
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
            
            var newSocialSupportCase = Mapper.Map<SocialsupportCaseDto, SocialsupportCase>(socialsupportCaseDto);

            _context.SocialsupportCases.Add(newSocialSupportCase);
            _context.SaveChanges();
            socialsupportCaseDto.Id = newSocialSupportCase.Id;
            return Created(new Uri(Request.RequestUri + "/" + socialsupportCaseDto.Id), socialsupportCaseDto);
        }


        //Save with problem
         //POST: /api/SocialSupportCases
        [HttpPost]
        public IHttpActionResult CreateSocialSupportWithProblem(SocialsupportCaseMulObj SocialsupportCaseMulObj, string SaveMultipleTAble)
        {
            var userId = User.Identity.GetUserId();
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

            var newSocialSupportCase = Mapper.Map<SocialsupportCaseDto, SocialsupportCase>(SocialsupportCaseMulObj.SocialsupportCaseDto);

            _context.SocialsupportCases.Add(newSocialSupportCase);

            SocialsupportCaseMulObj.SocialSupportProblemDto.SocialSupportCaseId = newSocialSupportCase.Id;
            SocialsupportCaseMulObj.SocialSupportProblemDto.Status = "Active";

            var newSocialSupportProblem = Mapper.Map<SocialSupportProblemDto, SocialSupportProblem>(SocialsupportCaseMulObj.SocialSupportProblemDto);

            _context.SocialSupportProblems.Add(newSocialSupportProblem);

            _context.SaveChanges();

            SocialsupportCaseMulObj.SocialsupportCaseDto.Id = newSocialSupportCase.Id;

            return Created(new Uri(Request.RequestUri + "/" + SocialsupportCaseMulObj.SocialsupportCaseDto.Id), SocialsupportCaseMulObj.SocialsupportCaseDto);
        }

        // PUT: /api/SocialSupportCases/{id}
        [HttpPut]
        public IHttpActionResult UpdateSocialSupportCases(SocialsupportCaseDto socialsupportCaseDto)
        {
            var userId = User.Identity.GetUserId();
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
          
            Mapper.Map(socialsupportCaseDto, SocialSupportCasesInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        // PUT: /api/SocialSupportCases?UpdateMultipleTAble=
        [HttpPut]
        public IHttpActionResult UpdateSocialSupportCasesWithProblem(SocialsupportCaseMulObj SocialsupportCaseMulObj, string UpdateMultipleTAble)
        {
            var userId = User.Identity.GetUserId();
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
                var socialSupportProblemDto = Mapper.Map<SocialSupportProblemDto, SocialSupportProblem>(SocialsupportCaseMulObj.SocialSupportProblemDto);
                _context.SocialSupportProblems.Add(socialSupportProblemDto);
            }
            else
            {
                SocialsupportCaseMulObj.SocialSupportProblemDto.Status = "Active";
                SocialsupportCaseMulObj.SocialSupportProblemDto.SocialSupportCaseId = SocialsupportCaseMulObj.SocialsupportCaseDto.Id;
                Mapper.Map(SocialsupportCaseMulObj.SocialSupportProblemDto, socialSupportProblemIndb);
            }


            var socialSupportCaseIndb = _context.SocialsupportCases.SingleOrDefault(c => c.Id == SocialsupportCaseMulObj.SocialsupportCaseDto.Id);

            if (socialSupportCaseIndb == null)
                return NotFound();

            Mapper.Map(SocialsupportCaseMulObj.SocialsupportCaseDto, socialSupportCaseIndb);

            _context.SaveChanges();
            return Ok(new { });
        }

        //// DELETE: /api/SocialSupportCases/{id}
        [HttpDelete]
        public IHttpActionResult DeleteSocialSupportCase(int id)
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
