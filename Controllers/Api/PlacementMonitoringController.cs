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
using Newtonsoft.Json.Linq;
using System.Reflection;
using Microsoft.AspNet.Identity;
using MtpApp.Hubs;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class PlacementMonitoringController : ApiController
    {
        private ApplicationDbContext _context;

        public PlacementMonitoringController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/PlacementMonitoring?ClientId=
        [HttpGet]
        public IHttpActionResult GetPlacementMonitoring(int ClientId)
        {
            var PlacmentInDb = _context.Placements
                .Include(c => c.Clients)
                .Select(Mapper.Map<Placement, PlacementDto>)
                .Where(c => c.ClientId == ClientId );

            if (PlacmentInDb == null)
                return NotFound();

            return Ok(PlacmentInDb);
        }

        //GET /api/PlacementMonitoring?CountPlacmentPending=
        //[HttpGet]
        //public IHttpActionResult GetPlacementMonitoringNotification(int countskip)
        //{
        //    DateTime startdate = DateTime.Today.AddDays(10);
        //    var PLacementProcessInDb =
        //        (from pp in _context.PlacementProgresses
        //         join m in _context.Monitorings on pp.MonitoringId equals m.Id
        //         join c in _context.Clients on m.ClientId equals c.Id
        //         where m.NextMonitoringDate <= startdate && pp.Completed == "Pending"
        //         orderby m.NextMonitoringDate ​
        //         select new { PlacementProgress = pp, Monitorings = m, Client=c }
        //         ).ToList().Skip(countskip).Take(5);

        //    var PLacementProcessCount =
        //        (from pp in _context.PlacementProgresses
        //         join m in _context.Monitorings on pp.MonitoringId equals m.Id
        //         join c in _context.Clients on m.ClientId equals c.Id
        //         where m.NextMonitoringDate <= startdate && pp.Completed == "Pending"
        //         orderby pp.Id
        //         select new { PlacementProgress = pp, Monitorings = m, Client = c }
        //         ).ToList().Count();

        //    object[] Arrayobj = new object[2];

        //    Arrayobj[0] = PLacementProcessInDb;
        //    Arrayobj[1] = PLacementProcessCount;

        //    return Ok(new { Arrayobj });
        //}


        [HttpGet]
        public IHttpActionResult GetPlacementMonitoringNotification(int countskip)
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
        //GET /api/PlacementMonitoring?PlacementId=
        [HttpGet]
        public IHttpActionResult GetPlacementProcessMonitoring(int PlacementId)
        {
            var MonitoringPlacementInDb = _context.PlacementProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Monitoring.Client)
                .Select(Mapper.Map<PlacementProgress, PLacementProcessDto>)
                .Where(c => c.Monitoring.PlacementId == PlacementId && c.Monitoring.Type == "Placement");

            if (MonitoringPlacementInDb == null)
                return NotFound();

            return Ok(MonitoringPlacementInDb);
        }


        // for doing 
        //GET /api/PlacementMonitoring?PlacementId=
        [HttpGet]
        public IHttpActionResult GetAllPlacementProcessMonitoring(int ClientId2)
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


        //GET /api/PlacementMonitoring?Id
        [HttpGet]
        public IHttpActionResult GetPlacementProcessById(int Id)
        {
            var MonitoringPlecementInDb = _context.PlacementProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Monitoring.Client).ToList()
                .Select(Mapper.Map<PlacementProgress, PLacementProcessDto>)
                .Where(c => c.Id == Id && c.Monitoring.Type == "Placement");

            if (MonitoringPlecementInDb == null)
                return NotFound();
            return Ok(MonitoringPlecementInDb);
        }

        ////POST /api/PlacementMonitoring
        [HttpPost]
        public IHttpActionResult CreatePlacementMonitoring(PlacementMonitorIngMulObj placementMonitorIngMulObj)
        {
            {
               
                if (!ModelState.IsValid)
                    return BadRequest();

                placementMonitorIngMulObj.monitoringDto.MonitoringDate = DateTime.Today;
                var userId = User.Identity.GetUserId();
                var user = _context.Users.SingleOrDefault(c => c.Id == userId);
                placementMonitorIngMulObj.monitoringDto.MonitoringDate = DateTime.Today;// update to today date 

                placementMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

                var Monitoring = Mapper.Map<MonitoringDto, Monitoring>(placementMonitorIngMulObj.monitoringDto);

                _context.Monitorings.Add(Monitoring);
         
                placementMonitorIngMulObj.pLacementProcessDto.MonitoringId = Monitoring.Id;

                var PlacementProcess = Mapper.Map<PLacementProcessDto, PlacementProgress>(placementMonitorIngMulObj.pLacementProcessDto);

                _context.PlacementProgresses.Add(PlacementProcess);

                _context.SaveChanges();

                PlacementMonitorHub.BroadcastData();

                return Created(new Uri(Request.RequestUri + "/" + placementMonitorIngMulObj.monitoringDto.Id), placementMonitorIngMulObj.monitoringDto);
             }
        }

        ////PUT /api/PlacementMonitoring
        [HttpPut]
        public IHttpActionResult UpdatePlacementMonitoring (PlacementMonitorIngMulObj placementMonitorIngMulObj)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            placementMonitorIngMulObj.monitoringDto.MonitoringDate = DateTime.Today;

            var futureTrainingMonitoringInDb = _context.PlacementProgresses.SingleOrDefault(c => c.MonitoringId == placementMonitorIngMulObj.pLacementProcessDto.MonitoringId);

            if (futureTrainingMonitoringInDb == null)
                return NotFound();

            Mapper.Map(placementMonitorIngMulObj.pLacementProcessDto, futureTrainingMonitoringInDb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == placementMonitorIngMulObj.monitoringDto.Id);
            if (monitoringInDb == null)
            {
                return NotFound();
            }

            var userId = User.Identity.GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            placementMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

            Mapper.Map(placementMonitorIngMulObj.monitoringDto, monitoringInDb);

            _context.SaveChanges();

            PlacementMonitorHub.BroadcastData();

            return Ok(new { });
        }

        // DELETE: /api/PlacementMonitoring/{id}
        [HttpDelete]
        public IHttpActionResult DeletePlacementMonitoring(int id)
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
