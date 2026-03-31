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
using System.Web;
using MtpApp.Hubs;
namespace MtpApp.Controllers.Api
{
    public class MonitoringsController : ApiController
    {
        private ApplicationDbContext _context;
        public MonitoringsController ()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/monitorings
        [HttpGet]
        public IHttpActionResult GetMonitoring()
        {
            var monitoring = _context.Monitorings.Include(c => c.Client).Select(Mapper.Map<Monitoring, MonitoringDto>);
            return Ok(monitoring);
        }

        //GET /api/monitorings/{id}
        [HttpGet]
        public IHttpActionResult GetMonitoring(int id)
        {
            var monitoring = _context.Monitorings.Include(c => c.Client).SingleOrDefault(c => c.Id == id);

            if (monitoring == null)
                return NotFound();

            return Ok(Mapper.Map<Monitoring, MonitoringDto>(monitoring));
        }

        
        // GET: /api/placementsLy?clientId={id}
        [HttpGet]
        public IHttpActionResult GetMonitoringByClient(int clientId)
        {
            var monitoring = _context.Monitorings
                                .Include(c => c.Client)
                                .Select(Mapper.Map<Monitoring, MonitoringDto>)
                                .Where(c => c.ClientId == clientId && c.Type != "Placement");

            return Ok(monitoring);
        }
        

        
         //GET: /api/placements?clientId={id}
        [HttpGet]
        public IHttpActionResult GetMonitoringPlacementByClient(int clientId2)
        {
            var monitoring = _context.Monitorings
                                .Include(c => c.Client)
                                .Select(Mapper.Map<Monitoring, MonitoringDto>)
                                .Where(c => c.ClientId == clientId2 && c.Type == "Placement");

            return Ok(monitoring);
        }
         
        

        //POST /api/monitorings
        [HttpPost]
        public IHttpActionResult CreateJobCategory(MonitoringDto monitoringDto)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Monitorings.SingleOrDefault(c => c.MonitoringTime == monitoringDto.MonitoringTime && c.Type == monitoringDto.Type && c.ClientId == monitoringDto.ClientId);

            if (isExists != null)
                return BadRequest();

            var newMonitoring = Mapper.Map<MonitoringDto, Monitoring>(monitoringDto);

            _context.Monitorings.Add(newMonitoring);
            _context.SaveChanges();

            monitoringDto.Id = newMonitoring.Id;
            return Created(new Uri(Request.RequestUri + "/" + newMonitoring.Id), newMonitoring);   
        }

        //PUT /api/monitorings/{id}
        [HttpPut]
        public IHttpActionResult UpdateMonitoring(int id, MonitoringDto monitoringDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Monitorings.SingleOrDefault(c => c.Id != monitoringDto.Id && c.MonitoringTime == monitoringDto.MonitoringTime && c.Type == monitoringDto.Type && c.ClientId == monitoringDto.ClientId);

            if (isExists != null)
                return BadRequest();

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == id);

            Mapper.Map(monitoringDto, monitoringInDb);
            _context.SaveChanges();
          
            return Ok(new { });
        }

        //DELETE /api/monitorings/{id}
        [HttpDelete]
        public IHttpActionResult DeleteMonitoring(int id)
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
