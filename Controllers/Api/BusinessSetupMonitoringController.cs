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

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class BusinessSetupMonitoringController : ApiController
    {
        private ApplicationDbContext _context;

        public BusinessSetupMonitoringController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/businessSetupMonitoring?ClientId=
        [HttpGet]
        public IHttpActionResult GetbusinessSetup(int ClientId)
        {
            var businessSetupMonitoringInDb = _context.BusinessSetUps
                .Include(c => c.Client)
                .Select(Mapper.Map<BusinessSetUp, BusinessSetUpDto>)
                .OrderByDescending(c => c.Id)
                .Where(c => c.ClientId == ClientId );

            if (businessSetupMonitoringInDb == null)
                return NotFound();

            return Ok(businessSetupMonitoringInDb);
        }

        //GET /api/businessSetupMonitoring?PClientId=
        [HttpGet]
        public IHttpActionResult GetbusinessSetupMonitoring(int PClientId)
        {
            var MonitoringbusinessSetupInDb = _context.BusinessInProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Monitoring.Client)
                .Include(c => c.BusinessSetUpCategory)
                .Select(Mapper.Map<BusinessInProgress, BusinessInProgressDto>)
                .OrderByDescending(c=> c.Id)
                .Where(c => c.Monitoring.ClientId == PClientId && c.Monitoring.Type == "Businesssetup");

            if (MonitoringbusinessSetupInDb == null)
                return NotFound();

            return Ok(MonitoringbusinessSetupInDb);
        }

        //GET /api/businessSetupMonitoring?Id
        [HttpGet]
        public IHttpActionResult GetbusinessSetupById(int Id)
        {
            var MonitoringBusinessSetupInDb = _context.BusinessInProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Monitoring.Client).ToList()
                .Select(Mapper.Map<BusinessInProgress, BusinessInProgressDto>)
                .OrderByDescending(c => c.Id)
                .Where(c => c.Id == Id && c.Monitoring.Type == "Businesssetup");

            if (MonitoringBusinessSetupInDb == null)
                return NotFound();
            return Ok(MonitoringBusinessSetupInDb);
        }

        ////POST /api/businessSetupMonitoring
        [HttpPost]
        public IHttpActionResult CreatePlacementMonitoring(businessInProgressMonitorIngMulObj businessInProgressMonitorIngMulObj)
        {
            {
                if (!ModelState.IsValid)
                    return BadRequest();

                var userId = User.Identity.GetUserId();
                var user = _context.Users.SingleOrDefault(c => c.Id == userId);

                businessInProgressMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

                var Monitoring = Mapper.Map<MonitoringDto, Monitoring>(businessInProgressMonitorIngMulObj.monitoringDto);

                _context.Monitorings.Add(Monitoring);

                businessInProgressMonitorIngMulObj.businessInProgressDto.MonitoringId = Monitoring.Id;

                var businessInProgress = Mapper.Map<BusinessInProgressDto, BusinessInProgress>(businessInProgressMonitorIngMulObj.businessInProgressDto);

                _context.BusinessInProgresses.Add(businessInProgress);

                _context.SaveChanges();
                return Created(new Uri(Request.RequestUri + "/" + businessInProgressMonitorIngMulObj.monitoringDto.Id), businessInProgressMonitorIngMulObj.monitoringDto);
             }
        }

        ////PUT /api/businessSetupMonitoring
        [HttpPut]
        public IHttpActionResult UpdatebusinessSetupMonitoring(businessInProgressMonitorIngMulObj businessInProgressMonitorIngMulObj)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var BusinessSetupMonitoringInDb = _context.BusinessInProgresses.SingleOrDefault(c => c.MonitoringId == businessInProgressMonitorIngMulObj.businessInProgressDto.MonitoringId);

            if (BusinessSetupMonitoringInDb == null)
                return NotFound();

            Mapper.Map(businessInProgressMonitorIngMulObj.businessInProgressDto, BusinessSetupMonitoringInDb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == businessInProgressMonitorIngMulObj.monitoringDto.Id);
            if (monitoringInDb == null)
            {
                return NotFound();
            }

            var userId = User.Identity.GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            businessInProgressMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

            Mapper.Map(businessInProgressMonitorIngMulObj.monitoringDto, monitoringInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/businessSetupMonitoring/{id}
        [HttpDelete]
        public IHttpActionResult DeletebusinessSetupMonitoring(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var BusinessSetupIndb = _context.BusinessInProgresses.SingleOrDefault(c => c.MonitoringId == id);

            if (BusinessSetupIndb == null)
                return NotFound();

            _context.BusinessInProgresses.Remove(BusinessSetupIndb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == id);

            if (monitoringInDb == null)
                return NotFound();

            _context.Monitorings.Remove(monitoringInDb);

            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
