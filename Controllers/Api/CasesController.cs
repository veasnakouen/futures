using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CasesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetCases([FromQuery] int? clientId)
        {
            var query = _context.Cases.AsQueryable();

            if (clientId.HasValue && clientId.Value > 0)
                query = query.Where(c => c.ClientId == clientId.Value);

            var cases = query
                .OrderByDescending(c => c.Id)
                .Select(c => new CaseDto
                {
                    Id = c.Id,
                    ClientId = c.ClientId,
                    CaseWorkerId = c.CaseWorkerId,
                    Priority = c.Priority,
                    ServiceType = c.ServiceType,
                    Subject = c.Subject,
                    Description = c.Description,
                    OpenDate = c.OpenDate,
                    CloseDate = c.CloseDate,
                    Status = c.Status,
                    Client = c.Client == null ? null : new ClientDto
                    {
                        Id = c.Client.Id,
                        FirstName = c.Client.FirstName,
                        LastName = c.Client.LastName,
                        ContactPhone = c.Client.ContactPhone
                    },
                    CaseWorker = c.CaseWorker == null ? null : new CaseWorkerDto
                    {
                        Id = c.CaseWorker.Id,
                        Name = c.CaseWorker.Name,
                        Program = c.CaseWorker.Program,
                        Status = c.CaseWorker.Status
                    }
                })
                .ToList();

            return Ok(cases);
        }

        [HttpGet("bycaseworker")]
        public IActionResult GetCasesByCaseWorker([FromQuery] string caseWorkerId, [FromQuery] string status)
        {
            if (caseWorkerId == "all")
            {
                var cases = _context.Cases
                    .Where(c => c.Status == status)
                    .OrderByDescending(c => c.Id)
                    .Select(c => new CaseDto
                    {
                        Id = c.Id,
                        ClientId = c.ClientId,
                        CaseWorkerId = c.CaseWorkerId,
                        Priority = c.Priority,
                        ServiceType = c.ServiceType,
                        Subject = c.Subject,
                        Description = c.Description,
                        OpenDate = c.OpenDate,
                        CloseDate = c.CloseDate,
                        Status = c.Status,
                        Client = c.Client == null ? null : new ClientDto
                        {
                            Id = c.Client.Id,
                            FirstName = c.Client.FirstName,
                            LastName = c.Client.LastName,
                            ContactPhone = c.Client.ContactPhone
                        },
                        CaseWorker = c.CaseWorker == null ? null : new CaseWorkerDto
                        {
                            Id = c.CaseWorker.Id,
                            Name = c.CaseWorker.Name,
                            Program = c.CaseWorker.Program,
                            Status = c.CaseWorker.Status
                        }
                    })
                    .ToList();
                return Ok(cases);
            }
            else
            {
                var cases = _context.Cases
                    .Where(c => c.CaseWorkerId == int.Parse(caseWorkerId) && c.Status == status)
                    .OrderByDescending(c => c.Id)
                    .Select(c => new CaseDto
                    {
                        Id = c.Id,
                        ClientId = c.ClientId,
                        CaseWorkerId = c.CaseWorkerId,
                        Priority = c.Priority,
                        ServiceType = c.ServiceType,
                        Subject = c.Subject,
                        Description = c.Description,
                        OpenDate = c.OpenDate,
                        CloseDate = c.CloseDate,
                        Status = c.Status,
                        Client = c.Client == null ? null : new ClientDto
                        {
                            Id = c.Client.Id,
                            FirstName = c.Client.FirstName,
                            LastName = c.Client.LastName,
                            ContactPhone = c.Client.ContactPhone
                        },
                        CaseWorker = c.CaseWorker == null ? null : new CaseWorkerDto
                        {
                            Id = c.CaseWorker.Id,
                            Name = c.CaseWorker.Name,
                            Program = c.CaseWorker.Program,
                            Status = c.CaseWorker.Status
                        }
                    })
                    .ToList();
                return Ok(cases);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetCase(int id)
        {
            var caseManagement = _context.Cases
                .Where(c => c.Id == id)
                .Select(c => new CaseDto
                {
                    Id = c.Id,
                    ClientId = c.ClientId,
                    CaseWorkerId = c.CaseWorkerId,
                    Priority = c.Priority,
                    ServiceType = c.ServiceType,
                    Subject = c.Subject,
                    Description = c.Description,
                    OpenDate = c.OpenDate,
                    CloseDate = c.CloseDate,
                    Status = c.Status,
                    Client = c.Client == null ? null : new ClientDto
                    {
                        Id = c.Client.Id,
                        FirstName = c.Client.FirstName,
                        LastName = c.Client.LastName,
                        ContactPhone = c.Client.ContactPhone
                    },
                    CaseWorker = c.CaseWorker == null ? null : new CaseWorkerDto
                    {
                        Id = c.CaseWorker.Id,
                        Name = c.CaseWorker.Name,
                        Program = c.CaseWorker.Program,
                        Status = c.CaseWorker.Status
                    }
                })
                .SingleOrDefault();
            if (caseManagement == null)
                return NotFound();
            return Ok(caseManagement);
        }

        [HttpPost]
        public IActionResult CreateCase([FromBody] CaseDto caseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var newCase = _mapper.Map<CaseDto, Case>(caseDto);
            _context.Cases.Add(newCase);
            _context.SaveChanges();
            caseDto.Id = newCase.Id;
            return CreatedAtAction(nameof(GetCase), new { id = caseDto.Id }, caseDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCase(int id, [FromBody] CaseDto caseDto)
        {
            var caseInDb = _context.Cases.SingleOrDefault(c => c.Id == id);
            if (caseInDb == null)
                return NotFound();

            if (caseDto.Id == 0)
                caseInDb.Status = caseDto.Status;
            else
                _mapper.Map(caseDto, caseInDb);

            _context.SaveChanges();
            return Ok(new { id = caseInDb.Id, clientId = caseInDb.ClientId });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCase(int id)
        {
            var caseInDb = _context.Cases.SingleOrDefault(c => c.Id == id);
            if (caseInDb == null)
                return NotFound();

            _context.Cases.Remove(caseInDb);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

