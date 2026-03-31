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
    public class FutureTrainingMonitoringController : ApiController
    {
        private ApplicationDbContext _context;

        public FutureTrainingMonitoringController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/FutureTrainingMonitoring?ClientId=
        [HttpGet]
        public IHttpActionResult GetMonitoringFutureTraining(int ClientId )
        {
            var MonitoringFutureTrainingInDb = _context.FutureTrainingProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Lession)
                .Include(c => c.Monitoring.Client)
                .Include(c => c.Lession.Subject).ToList()
                .Select(Mapper.Map<FutureTrainingProgress, FutureTrainingProgressDto>)
                .Where(c => c.Monitoring.ClientId == ClientId  && c.Monitoring.Type == "Futuretraining");

            if (MonitoringFutureTrainingInDb == null)
                return NotFound();

            return Ok(MonitoringFutureTrainingInDb);
        }

        [HttpGet]
        public IHttpActionResult GetMonitoringFutureTraining(int ClientId , int SubjectId)
        {
            var MonitoringFutureTrainingInDb = _context.FutureTrainingProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Lession)
                .Include(c => c.Monitoring.Client)
                .Include(c => c.Lession.Subject).ToList()
                .Select(Mapper.Map<FutureTrainingProgress, FutureTrainingProgressDto>)
                .Where(c => c.Monitoring.ClientId == ClientId && c.Lession.SubjectId == SubjectId && c.Monitoring.Type == "Futuretraining");

            if (MonitoringFutureTrainingInDb == null)
                return NotFound();

            return Ok(MonitoringFutureTrainingInDb);
        }

        //GET /api/FutureTrainingMonitoring?Id
        [HttpGet]
        public IHttpActionResult GetMonitoringFutureTrainingById(int Id)
        {
            var MonitoringFutureTrainingInDb = _context.FutureTrainingProgresses
                .Include(c => c.Monitoring)
                .Include(c => c.Lession)
                .Include(c => c.Monitoring.Client)
                .Include(c => c.Lession.Subject).ToList()
                .Select(Mapper.Map<FutureTrainingProgress, FutureTrainingProgressDto>)
                .Where(c => c.Id == Id && c.Monitoring.Type == "Futuretraining");

            if (MonitoringFutureTrainingInDb == null)
                return NotFound();
            return Ok(MonitoringFutureTrainingInDb);
        }

        //POST /api/futureTrainingMonitoring
        [HttpPost]
        public IHttpActionResult CreateFutureTrainingMonitoring(FutureTrainingMonitorIngMulObj futureTrainingMonitorIngMulObj)
        {
            //using (var transaction = _context.Database.BeginTransaction())
            //{
            //    try
            //    {
            //        if (!ModelState.IsValid)
            //            return BadRequest();
           
            //                List<FutureTrainingProgress> monitorings = new List<FutureTrainingProgress>();
            //                dynamic jsonData = objData;
            //                JObject monitoringJson = jsonData.monitoring;
            //                JArray futureTrainingJson = jsonData.futuretraining;
            //                var Monitoring = monitoringJson.ToObject<Monitoring>();
            //                foreach (var item in futureTrainingJson)
            //                {
            //                    monitorings.Add(item.ToObject<FutureTrainingProgress>());
            //                }
            //                _context.Monitorings.Add(Monitoring);
            //                foreach (FutureTrainingProgress futureTrainingProgress in monitorings)
            //                {
            //                    _context.FutureTrainingProgresses.Add(futureTrainingProgress);
            //                }

            //                _context.SaveChanges();
            //                transaction.Commit();
            //    }
            //    catch
            //    {
            //        transaction.Rollback();
            //        return BadRequest();
            //    }
            //    finally
            //    {
            //        transaction.Dispose();
            //    }
            //}

            {
                if (!ModelState.IsValid)
                    return BadRequest();

                var userId = User.Identity.GetUserId();
                var user = _context.Users.SingleOrDefault(c => c.Id == userId);

                futureTrainingMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

                var Monitoring = Mapper.Map<MonitoringDto, Monitoring>(futureTrainingMonitorIngMulObj.monitoringDto);

                _context.Monitorings.Add(Monitoring);

                futureTrainingMonitorIngMulObj.futureTrainingProgressDto.MonitoringId = Monitoring.Id;


                var subjectIndb = _context.Lessions.Include(c => c.Subject).SingleOrDefault(c => c.Id == futureTrainingMonitorIngMulObj.futureTrainingProgressDto.LessionId);
                //Checking when monitoring have complete exists cannot save
                var CompleteExistsInDb =
                    (
                       from M in _context.Monitorings
                       join FP in _context.FutureTrainingProgresses on M.Id equals FP.MonitoringId
                       join L in _context.Lessions on FP.LessionId equals L.Id
                       join S in _context.Subjects on L.SubjectId equals S.Id
                       where
                            M.ClientId == futureTrainingMonitorIngMulObj.monitoringDto.ClientId && M.Type == "Futuretraining"
                            &&
                            S.SubjectName == subjectIndb.Subject.SubjectName
                            && FP.Ontraining == "Completed"
                       select new
                       {
                           M.Id,
                           M.MonitoringDate,
                           M.NextMonitoringDate,
                           M.Monitoringtype,
                           M.ClientId,
                           M.Type,
                           M.Enroll,
                           FP.Ontraining,
                           S.SubjectName
                       }
                    ).FirstOrDefault();

                if (CompleteExistsInDb != null)
                {
                    return BadRequest();
                }


                var futureTrainingMonitorIng = Mapper.Map<FutureTrainingProgressDto, FutureTrainingProgress>(futureTrainingMonitorIngMulObj.futureTrainingProgressDto);

                _context.FutureTrainingProgresses.Add(futureTrainingMonitorIng);

                _context.SaveChanges();
                return Created(new Uri(Request.RequestUri + "/" + futureTrainingMonitorIngMulObj.monitoringDto.Id), futureTrainingMonitorIngMulObj.monitoringDto);

            }
        }

        //PUT /api/futureTrainingMonitoring
        [HttpPut]
        public IHttpActionResult UpdateFutureTrainingMonitoring(FutureTrainingMonitorIngMulObj futureTrainingMonitorIngMulObj)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var futureTrainingMonitoringInDb = _context.FutureTrainingProgresses.SingleOrDefault(c => c.MonitoringId == futureTrainingMonitorIngMulObj.futureTrainingProgressDto.MonitoringId);

            if (futureTrainingMonitoringInDb == null)
                return NotFound();

            Mapper.Map(futureTrainingMonitorIngMulObj.futureTrainingProgressDto, futureTrainingMonitoringInDb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == futureTrainingMonitorIngMulObj.monitoringDto.Id);
            if (monitoringInDb == null)
            {
                return NotFound();
            }

            //Checking when monitoring have complete exists cannot save
            var subjectIndb = _context.Lessions.Include(c => c.Subject).SingleOrDefault(c => c.Id == futureTrainingMonitorIngMulObj.futureTrainingProgressDto.LessionId);

            var CompleteExistsInDb =
               (from M in _context.Monitorings
                join FP in _context.FutureTrainingProgresses on M.Id equals FP.MonitoringId
                join L in _context.Lessions on FP.LessionId equals L.Id
                join S in _context.Subjects on L.SubjectId equals S.Id
                where
                     M.ClientId == futureTrainingMonitorIngMulObj.monitoringDto.ClientId
                        && 
                     M.Type == "Futuretraining"
                        && 
                     S.SubjectName == subjectIndb.Subject.SubjectName
                        && 
                     FP.Ontraining == "Completed"
                select new
                {
                    M.Id,
                    M.MonitoringDate,
                    M.NextMonitoringDate,
                    M.Monitoringtype,
                    M.ClientId,
                    M.Type,
                    M.Enroll,
                    FP.Ontraining,
                    S.SubjectName
                }
                ).FirstOrDefault();

            if (CompleteExistsInDb != null)
            {
                return BadRequest();
            }



            var userId = User.Identity.GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            futureTrainingMonitorIngMulObj.monitoringDto.Enroll = user.FirstName + " " + user.LastName;

            Mapper.Map(futureTrainingMonitorIngMulObj.monitoringDto, monitoringInDb);
             
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/futureTrainingMonitoring/{id}
        [HttpDelete]
        public IHttpActionResult DeleteFutureTrainingMonitoring(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var futureTrainingMonitoringInDb = _context.FutureTrainingProgresses.SingleOrDefault(c => c.MonitoringId == id);

            if (futureTrainingMonitoringInDb == null)
                return NotFound();

            _context.FutureTrainingProgresses.Remove(futureTrainingMonitoringInDb);

            var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == id);

            if (monitoringInDb == null)
                return NotFound();

            _context.Monitorings.Remove(monitoringInDb);

            _context.SaveChanges();

            return Ok(new { });
        }
       
    }
}
