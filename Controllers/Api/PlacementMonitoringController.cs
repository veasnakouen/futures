using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Hubs;
using MtpApp.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlacementMonitoringController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly Microsoft.AspNetCore.SignalR.IHubContext<PlacementMonitorHub> _hubContext;

        public PlacementMonitoringController(ApplicationDbContext context, IMapper mapper, Microsoft.AspNetCore.SignalR.IHubContext<PlacementMonitorHub> hubContext)
        {
            _context = context;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        //GET /api/PlacementMonitoring?ClientId=
        [HttpGet]
        public IActionResult GetPlacementMonitoring(int ClientId)
        {
            var PlacmentInDb = _context.Placements
                .Include(c => c.Clients)
                .Select(_mapper.Map<Placement, PlacementDto>)
                .Where(c => c.ClientId == ClientId );

            if (PlacmentInDb == null)
                return NotFound();

            return Ok(PlacmentInDb);
        }

        //GET /api/PlacementMonitoring?CountPlacmentPending=
        [HttpGet("notification")]
        public IActionResult GetPlacementMonitoringNotification(int countskip)
        {
            DateTime startdate = DateTime.Today.AddDays(10);
            var PLacementProcessInDb =
                (
                from c in _context.Clients
                join p in _context.Placements on c.Id equals p.ClientId
                join m in _context.Monitorings on p.Id equals m.PlacementId
                join pp in _context.PlacementProgresses on m.Id equals pp.MonitoringId
                where m.NextMonitoringDate <= startdate && pp.Completed == "Pending"
                orderby m.NextMonitoringDate
                select new { PlacementProgress = pp, Monitorings = m, Client = c }
                 ).ToList().Skip(countskip).Take(5);

            var PLacementProcessCount =
                (from c in _context.Clients
                 join p in _context.Placements on c.Id equals p.ClientId
                 join m in _context.Monitorings on p.Id equals m.PlacementId
                 join pp in _context.PlacementProgresses on m.Id equals pp.MonitoringId
                 where m.NextMonitoringDate <= startdate && pp.Completed == "Pending"
                 orderby pp.Id
                 select new { PlacementProgress = pp, Monitorings = m, Client = c }
                 ).ToList().Count();
            object[] Arrayobj = new object[2];

            Arrayobj[0] = PLacementProcessInDb;
            Arrayobj[1] = PLacementProcessCount;

            return Ok(new { Arrayobj });
        }

        // for doing 
        //GET /api/PlacementMonitoring/process?PlacementId=
        [HttpGet("process")]
        public IActionResult GetPlacementProcessMonitoring(int PlacementId)
        {
            var MonitoringPlacementInDb = _context.PlacementProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Monitoring.Client)
                .Select(_mapper.Map<PlacementProgress, PLacementProcessDto>)
                .Where(c => c.Monitoring.PlacementId == PlacementId && c.Monitoring.Type == "Placement");

            if (MonitoringPlacementInDb == null)
                return NotFound();

            return Ok(MonitoringPlacementInDb);
        }


        // for doing 
        //GET /api/PlacementMonitoring/all?ClientId2=
        [HttpGet("all")]
        public IActionResult GetAllPlacementProcessMonitoring(int ClientId2)
        {
            var MonitoringInDb =
                (from m in _context.Monitorings
                 join p in _context.Placements on m.PlacementId equals p.Id
                 where p.ClientId == ClientId2 && m.Type == "Placement"
                 //select m).ToList();
                 select new { m, p }).ToList();
            if (MonitoringInDb == null)
                return NotFound();

            return Ok(MonitoringInDb);
        }


        //GET /api/PlacementMonitoring/byid?Id=
        [HttpGet("byid")]
        public IActionResult GetPlacementProcessById(int Id)
        {
            var MonitoringPlecementInDb = _context.PlacementProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Monitoring.Client).ToList()
                .Select(_mapper.Map<PlacementProgress, PLacementProcessDto>)
                .Where(c => c.Id == Id && c.Monitoring.Type == "Placement");

            if (MonitoringPlecementInDb == null)
                return NotFound();
            return Ok(MonitoringPlecementInDb);
        }

        ////POST /api/PlacementMonitoring
        [HttpPost]
        public IActionResult CreatePlacementMonitoring(PlacementMonitorIngMulObj placementMonitorIngMulObj)
        {
            {
               
                if (!ModelState.IsValid)
                    return BadRequest();

                placementMonitorIngMulObj.monitoringDto.MonitoringDate = DateTime.Today;
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = _context.Users.SingleOrDefault(c => c.Id == userId);
                placementMonitorIngMulObj.monitoringDto.MonitoringDate = DateTime.Today;// update to today date 

                placementMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

                var Monitoring = _mapper.Map<MonitoringDto, Monitoring>(placementMonitorIngMulObj.monitoringDto);

                _context.Monitorings.Add(Monitoring);
         
                placementMonitorIngMulObj.pLacementProcessDto.MonitoringId = Monitoring.Id;

                var PlacementProcess = _mapper.Map<PLacementProcessDto, PlacementProgress>(placementMonitorIngMulObj.pLacementProcessDto);

                _context.PlacementProgresses.Add(PlacementProcess);

                _context.SaveChanges();

                _hubContext.Clients.All.SendAsync("refreshEmployeeData");

                return Ok(placementMonitorIngMulObj.monitoringDto);
             }
        }

        ////PUT /api/PlacementMonitoring
        [HttpPut]
        public IActionResult UpdatePlacementMonitoring (PlacementMonitorIngMulObj placementMonitorIngMulObj)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            placementMonitorIngMulObj.monitoringDto.MonitoringDate = DateTime.Today;

            var futureTrainingMonitoringInDb = _context.PlacementProgresses.SingleOrDefault(c => c.MonitoringId == placementMonitorIngMulObj.pLacementProcessDto.MonitoringId);

            if (futureTrainingMonitoringInDb == null)
                return NotFound();

            _mapper.Map(placementMonitorIngMulObj.pLacementProcessDto, futureTrainingMonitoringInDb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == placementMonitorIngMulObj.monitoringDto.Id);
            if (monitoringInDb == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            placementMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

            _mapper.Map(placementMonitorIngMulObj.monitoringDto, monitoringInDb);

            _context.SaveChanges();

            _hubContext.Clients.All.SendAsync("refreshEmployeeData");

            return Ok(new { });
        }

        // DELETE: /api/PlacementMonitoring/{id}
        [HttpDelete]
        public IActionResult DeletePlacementMonitoring(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var PlacementMonitoringInDb = _context.PlacementProgresses.SingleOrDefault(c => c.MonitoringId == id);

            if (PlacementMonitoringInDb == null)
                return NotFound();

            _context.PlacementProgresses.Remove(PlacementMonitoringInDb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == id);

            if (monitoringInDb == null)
                return NotFound();

            _context.Monitorings.Remove(monitoringInDb);

            _context.SaveChanges();

            return Ok(new { });
        }
    }
}

