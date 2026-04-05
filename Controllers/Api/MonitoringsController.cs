using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Hubs;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonitoringsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public MonitoringsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //GET /api/monitorings/all
        [HttpGet("all")]
        public IActionResult GetMonitoring()
        {
            var monitoring = _context.Monitorings.Include(c => c.Client).Select(_mapper.Map<Monitoring, MonitoringDto>);
            return Ok(monitoring);
        }

        //GET /api/monitorings/{id}
        [HttpGet("{id}")]
        public IActionResult GetMonitoring(int id)
        {
            var monitoring = _context.Monitorings.Include(c => c.Client).SingleOrDefault(c => c.Id == id);

            if (monitoring == null)
                return NotFound();

            return Ok(_mapper.Map<Monitoring, MonitoringDto>(monitoring));
        }

        
        // GET: /api/placementsLy?clientId={id}
        [HttpGet]
        public IActionResult GetMonitoringByClient(int clientId)
        {
            var monitoring = _context.Monitorings
                                .Include(c => c.Client)
                                .Select(_mapper.Map<Monitoring, MonitoringDto>)
                                .Where(c => c.ClientId == clientId && c.Type != "Placement");

            return Ok(monitoring);
        }
        

        
         //GET: /api/monitorings/placement?clientId2={id}
        [HttpGet("placement")]
        public IActionResult GetMonitoringPlacementByClient(int clientId2)
        {
            var monitoring = _context.Monitorings
                                .Include(c => c.Client)
                                .Select(_mapper.Map<Monitoring, MonitoringDto>)
                                .Where(c => c.ClientId == clientId2 && c.Type == "Placement");

            return Ok(monitoring);
        }
         
        

        //POST /api/monitorings
        [HttpPost]
        public IActionResult CreateJobCategory(MonitoringDto monitoringDto)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Monitorings.SingleOrDefault(c => c.MonitoringTime == monitoringDto.MonitoringTime && c.Type == monitoringDto.Type && c.ClientId == monitoringDto.ClientId);

            if (isExists != null)
                return BadRequest();

            var newMonitoring = _mapper.Map<MonitoringDto, Monitoring>(monitoringDto);

            _context.Monitorings.Add(newMonitoring);
            _context.SaveChanges();

            monitoringDto.Id = newMonitoring.Id;
            return CreatedAtAction(nameof(GetMonitoring), new { id = newMonitoring.Id }, newMonitoring);
        }

        //PUT /api/monitorings/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateMonitoring(int id, MonitoringDto monitoringDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Monitorings.SingleOrDefault(c => c.Id != monitoringDto.Id && c.MonitoringTime == monitoringDto.MonitoringTime && c.Type == monitoringDto.Type && c.ClientId == monitoringDto.ClientId);

            if (isExists != null)
                return BadRequest();

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == id);

            _mapper.Map(monitoringDto, monitoringInDb);
            _context.SaveChanges();
          
            return Ok(new { });
        }

        //DELETE /api/monitorings/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteMonitoring(int id)
        {
            var monitoringInDB = _context.Monitorings.SingleOrDefault(c => c.Id == id);

            if (monitoringInDB == null)
                return NotFound();

            _context.Monitorings.Remove(monitoringInDB);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

