using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BusinessSetupMonitoringController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public BusinessSetupMonitoringController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetBusinessSetup([FromQuery] int clientId)
        {
            var businessSetups = _context.BusinessSetUps
                .Include(c => c.Client)
                .Where(c => c.ClientId == clientId)
                .OrderByDescending(c => c.Id)
                .ToList()
                .Select(c => _mapper.Map<BusinessSetUp, BusinessSetUpDto>(c));
            return Ok(businessSetups);
        }

        [HttpGet("monitoring")]
        public IActionResult GetBusinessSetupMonitoring([FromQuery] int clientId)
        {
            var monitoring = _context.BusinessInProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Monitoring.Client)
                .Include(c => c.BusinessSetUpCategory)
                .Where(c => c.Monitoring.ClientId == clientId && c.Monitoring.Type == "Businesssetup")
                .OrderByDescending(c => c.Id)
                .ToList()
                .Select(c => _mapper.Map<BusinessInProgress, BusinessInProgressDto>(c));
            return Ok(monitoring);
        }

        [HttpGet("{id}")]
        public IActionResult GetBusinessSetupById(int id)
        {
            var monitoring = _context.BusinessInProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Monitoring.Client)
                .Where(c => c.Id == id && c.Monitoring.Type == "Businesssetup")
                .OrderByDescending(c => c.Id)
                .ToList()
                .Select(c => _mapper.Map<BusinessInProgress, BusinessInProgressDto>(c));
            return Ok(monitoring);
        }

        [HttpPost]
        public IActionResult CreateBusinessSetupMonitoring([FromBody] businessInProgressMonitorIngMulObj businessInProgressMonitorIngMulObj)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            businessInProgressMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

            var monitoring = _mapper.Map<MonitoringDto, Monitoring>(businessInProgressMonitorIngMulObj.monitoringDto);
            _context.Monitorings.Add(monitoring);

            businessInProgressMonitorIngMulObj.businessInProgressDto.MonitoringId = monitoring.Id;

            var businessInProgress = _mapper.Map<BusinessInProgressDto, BusinessInProgress>(businessInProgressMonitorIngMulObj.businessInProgressDto);
            _context.BusinessInProgresses.Add(businessInProgress);

            _context.SaveChanges();
            return CreatedAtAction(nameof(GetBusinessSetupById), new { id = businessInProgress.Id }, businessInProgressMonitorIngMulObj.monitoringDto);
        }

        [HttpPut]
        public IActionResult UpdateBusinessSetupMonitoring([FromBody] businessInProgressMonitorIngMulObj businessInProgressMonitorIngMulObj)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var businessSetupMonitoringInDb = _context.BusinessInProgresses.SingleOrDefault(c => c.MonitoringId == businessInProgressMonitorIngMulObj.businessInProgressDto.MonitoringId);
            if (businessSetupMonitoringInDb == null)
                return NotFound();

            _mapper.Map(businessInProgressMonitorIngMulObj.businessInProgressDto, businessSetupMonitoringInDb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == businessInProgressMonitorIngMulObj.monitoringDto.Id);
            if (monitoringInDb == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);
            businessInProgressMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

            _mapper.Map(businessInProgressMonitorIngMulObj.monitoringDto, monitoringInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBusinessSetupMonitoring(int id)
        {
            var businessSetupInDb = _context.BusinessInProgresses.SingleOrDefault(c => c.MonitoringId == id);
            if (businessSetupInDb == null)
                return NotFound();

            _context.BusinessInProgresses.Remove(businessSetupInDb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == id);
            if (monitoringInDb == null)
                return NotFound();

            _context.Monitorings.Remove(monitoringInDb);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

