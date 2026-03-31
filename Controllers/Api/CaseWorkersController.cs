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
    public class CaseWorkersController : ApiController
    {
        private ApplicationDbContext _context;
        public CaseWorkersController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/caseworkers
        [HttpGet]
        public IHttpActionResult GetCaseWorkers()
        {
            var caseWorkers = _context.CaseWorkers.ToList().Select(Mapper.Map<CaseWorker, CaseWorkerDto>);
            return Ok(caseWorkers);
        }


        // GET: /api/caseworkers/{id}
        [HttpGet]
        public IHttpActionResult GetCaseWorker(int id)
        {
            var caseWorker = _context.CaseWorkers.SingleOrDefault(c => c.Id == id);

            if (caseWorker == null)
                return NotFound();

            return Ok(Mapper.Map<CaseWorker, CaseWorkerDto>(caseWorker));
        }

        // GET: /api/CaseWorkers?Program=
        [HttpGet]
        public IHttpActionResult GetCaseWorkerByProgram(string Program)
        {
            if (Program != "Futures")
            {
                var caseWorker = _context.CaseWorkers
                    .Select(Mapper.Map<CaseWorker, CaseWorkerDto>)
                    .Where(c => c.Program != "Futures");
                if (caseWorker == null)
                    return NotFound();
                return Ok(caseWorker);
            }
            else
            {
                var caseWorker = _context.CaseWorkers
                    .Select(Mapper.Map<CaseWorker, CaseWorkerDto>)
                    .Where(c => c.Program == "Futures");
                if (caseWorker == null)
                    return NotFound();
                return Ok(caseWorker);
            }
        }

        // POST: /api/caseworkers
        [HttpPost]
        public IHttpActionResult CreateCaseWorker(CaseWorkerDto caseWorkerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.CaseWorkers.SingleOrDefault(c => c.Name == caseWorkerDto.Name);

            if (isExists != null)
                return BadRequest();

            var newCaseWorker = Mapper.Map<CaseWorkerDto, CaseWorker>(caseWorkerDto);

            _context.CaseWorkers.Add(newCaseWorker);
            _context.SaveChanges();

            caseWorkerDto.Id = newCaseWorker.Id;

            return Created(new Uri(Request.RequestUri + "/" + caseWorkerDto.Id), caseWorkerDto);
        }

        // PUT: /api/caseworkers/{id}
        [HttpPut]
        public IHttpActionResult UpdateCaseWorker(int id, CaseWorkerDto caseWorkerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.CaseWorkers.SingleOrDefault(c => c.Name == caseWorkerDto.Name && c.Id != caseWorkerDto.Id);

            if (isExists != null)
                return BadRequest();

            var caseWorkerInDb = _context.CaseWorkers.SingleOrDefault(c => c.Id == id);

            if (caseWorkerInDb == null)
                return NotFound();

            Mapper.Map(caseWorkerDto, caseWorkerInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/caseworkers/{id}
        [HttpDelete]
        public IHttpActionResult DeleteCaseWorker(int id)
        {
            var caseWorkerInDb = _context.CaseWorkers.SingleOrDefault(c => c.Id == id);

            if (caseWorkerInDb == null)
                return NotFound();

            _context.CaseWorkers.Remove(caseWorkerInDb);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
