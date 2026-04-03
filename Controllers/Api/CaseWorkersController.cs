using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CaseWorkersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CaseWorkersController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetCaseWorkers()
        {
            var caseWorkers = _context.CaseWorkers.ToList().Select(c => _mapper.Map<CaseWorker, CaseWorkerDto>(c));
            return Ok(caseWorkers);
        }

        [HttpGet("{id}")]
        public IActionResult GetCaseWorker(int id)
        {
            var caseWorker = _context.CaseWorkers.SingleOrDefault(c => c.Id == id);
            if (caseWorker == null)
                return NotFound();
            return Ok(_mapper.Map<CaseWorker, CaseWorkerDto>(caseWorker));
        }

        [HttpGet("byprogram")]
        public IActionResult GetCaseWorkerByProgram([FromQuery] string program)
        {
            var caseWorkers = program != "Futures"
                ? _context.CaseWorkers.Where(c => c.Program != "Futures").ToList().Select(c => _mapper.Map<CaseWorker, CaseWorkerDto>(c))
                : _context.CaseWorkers.Where(c => c.Program == "Futures").ToList().Select(c => _mapper.Map<CaseWorker, CaseWorkerDto>(c));
            return Ok(caseWorkers);
        }

        [HttpPost]
        public IActionResult CreateCaseWorker([FromBody] CaseWorkerDto caseWorkerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.CaseWorkers.SingleOrDefault(c => c.Name == caseWorkerDto.Name);
            if (isExists != null)
                return BadRequest();

            var newCaseWorker = _mapper.Map<CaseWorkerDto, CaseWorker>(caseWorkerDto);
            _context.CaseWorkers.Add(newCaseWorker);
            _context.SaveChanges();
            caseWorkerDto.Id = newCaseWorker.Id;
            return CreatedAtAction(nameof(GetCaseWorker), new { id = caseWorkerDto.Id }, caseWorkerDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCaseWorker(int id, [FromBody] CaseWorkerDto caseWorkerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.CaseWorkers.SingleOrDefault(c => c.Name == caseWorkerDto.Name && c.Id != caseWorkerDto.Id);
            if (isExists != null)
                return BadRequest();

            var caseWorkerInDb = _context.CaseWorkers.SingleOrDefault(c => c.Id == id);
            if (caseWorkerInDb == null)
                return NotFound();

            _mapper.Map(caseWorkerDto, caseWorkerInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCaseWorker(int id)
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

