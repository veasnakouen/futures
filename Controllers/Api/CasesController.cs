using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using AutoMapper;
using MtpApp.Dtos;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class CasesController : ApiController
    {
        private ApplicationDbContext _context;
        public CasesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/cases?clientId={id}
        [HttpGet]
        public IHttpActionResult GetCases(int clientId)
        {
            var cases = _context.Cases.Include(c => c.Client).Include(c => c.CaseWorker).Select(Mapper.Map<Case, CaseDto>).Where(c => c.ClientId == clientId);
            return Ok(cases);
        }

        // GET: /api/cases?caseWorkerId={id}
        [HttpGet]
        public IHttpActionResult GetCasesByCaseWorker(string caseWorkerId, string status)
        {
            if (caseWorkerId == "all")
            {
                var cases = _context.Cases.Include(c => c.Client).Include(c => c.CaseWorker).Select(Mapper.Map<Case, CaseDto>).Where(c => c.Status == status);
                return Ok(cases);
            }
            else
            {
                var cases = _context.Cases.Include(c => c.Client).Include(c => c.CaseWorker).Select(Mapper.Map<Case, CaseDto>).Where(c => c.CaseWorkerId == int.Parse(caseWorkerId) && c.Status == status);
                return Ok(cases);
            }
        }

        // GET: /api/cases/{id}
        [HttpGet]
        public IHttpActionResult GetCase(int id)
        {
            var caseManagement = _context.Cases.Include(c => c.Client).Include(c => c.CaseWorker).SingleOrDefault(c => c.Id == id);

            if (caseManagement == null)
                return NotFound();

            return Ok(Mapper.Map<Case, CaseDto>(caseManagement));
        }

        // POST: /api/cases
        [HttpPost]
        public IHttpActionResult CreateCase(CaseDto caseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var newCase = Mapper.Map<CaseDto, Case>(caseDto);

            _context.Cases.Add(newCase);
            _context.SaveChanges();

            caseDto.Id = newCase.Id;

            return Created(new Uri(Request.RequestUri + "/" + caseDto.Id), caseDto);
        }

        // PUT: /api/cases/{id}
        [HttpPut]
        public IHttpActionResult UpdateCase(int id, CaseDto caseDto)
        {
            var caseInDb = _context.Cases.SingleOrDefault(c => c.Id == id);

            if (caseInDb == null)
                return NotFound();

            if (caseDto.Id == 0)
            {
                caseInDb.Status = caseDto.Status;
            }
            else
            {
                Mapper.Map(caseDto, caseInDb);
            }

            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/cases/{id}
        [HttpDelete]
        public IHttpActionResult DeleteCase(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var caseInDb = _context.Cases.SingleOrDefault(c => c.Id == id);

            if (caseInDb == null)
                return NotFound();

            _context.Cases.Remove(caseInDb);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
