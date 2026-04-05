using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using MtpApp.ViewModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MonitoringOptionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public MonitoringOptionController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //Get   /api/monitoringoption?Id=&conditionType=
        [HttpGet]
        public IActionResult GetMonitoring(int id, string conditionType)
        {
            var TypeconditionIndb = _context.Monitorings
                                .Select(_mapper.Map<Monitoring, MonitoringDto>)
                                .Where(c => c.Id == id && c.Type == conditionType);
            if (TypeconditionIndb == null)
                return NotFound();
            object[] Arrayobj = new object[1]; 
            //var monitoringPlacementInDB = _context.Monitorings
            //                                .Select(_mapper.Map<Monitoring, MonitoringDto>)
            //                                .Where(c => c.Id == id);
            //Arrayobj[0] = monitoringPlacementInDB;

            //if (monitoringPlacementInDB == null)
            //    return NotFound();
            switch (conditionType)
            {
                case "Placement":
                    var PlacementInDB = _context.PlacementProgresses
                    .Include(c => c.Monitoring)
                    .Select(_mapper.Map<PlacementProgress, PLacementProcessDto>)
                    .Where(c => c.MonitoringId == id);
                    if (PlacementInDB == null)
                    {
                        return NotFound();
                    }
                    Arrayobj[0] = PlacementInDB;
                    break;
                case "Businesssetup":
                    var BusinesssetupInDb = _context.BusinessInProgresses
                     .Include(c => c.Monitoring)
                    .Select(_mapper.Map<BusinessInProgress, BusinessInProgressDto>)
                    .Where(c => c.MonitoringId == id);
                    if (BusinesssetupInDb == null)
                    {
                        return NotFound();
                    }
                    Arrayobj[0] = BusinesssetupInDb;
                    break;
                case "Furthereducation":
                    var FurthereducationInDb = _context.FurthereducationInProgresses
                     .Include(c => c.Monitoring)
                    .Select(_mapper.Map<FurthereducationInProgress, FurthereducationInProgressDto>)
                    .Where(c => c.MonitoringId == id);
                    if (FurthereducationInDb == null)
                    {
                        return NotFound();
                    }
                    Arrayobj[0] = FurthereducationInDb;
                    break;
                case "Futuretraining":
                    var FuturetrainingInDb = _context.FutureTrainingProgresses
                     .Include(c => c.Monitoring)
                    .Select(_mapper.Map<FutureTrainingProgress, FutureTrainingProgressDto>)
                    .Where(c => c.MonitoringId == id);
                    if (FuturetrainingInDb == null)
                    {
                        return NotFound();
                    }
                    Arrayobj[0] = FuturetrainingInDb;
                    break;
                default:
                    return BadRequest();
            }
            return Ok(new {Arrayobj});
        }

        [HttpPost]
        public IActionResult Post(JObject objData, string TypeCondition)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest();
                    switch (TypeCondition)
                    {
                        case "Placement":
                                List<PlacementProgress> lstmonitorings = new List<PlacementProgress>();
                                dynamic jsonData = objData;
                                JObject monitoringJson = jsonData.monitoring;
                                JArray placementsJson = jsonData.placements;
                                var Monitoring = monitoringJson.ToObject<Monitoring>();

                                //var MonitoringInDb = _context.Monitorings.FirstOrDefault(c => c.MonitoringTime == Monitoring.MonitoringTime && c.Type == Monitoring.Type);
                                //if (MonitoringInDb != null)
                                //{
                                //    return BadRequest();
                                //} 
                                foreach (var item in placementsJson)
                                {
                                    lstmonitorings.Add(item.ToObject<PlacementProgress>());
                                }      
                                _context.Monitorings.Add(Monitoring);
                                foreach (PlacementProgress placement in lstmonitorings)
                                {
                                    _context.PlacementProgresses.Add(placement);
                                }
                                _context.SaveChanges();
                                transaction.Commit();
                            break;

                        case "Businesssetup":
                            List<BusinessInProgress> monitorings2 = new List<BusinessInProgress>();
                                dynamic jsonData2 = objData;
                                JObject monitoringJson2 = jsonData2.monitoring;
                                JArray businessSetupsJson = jsonData2.businessSetups;
                                var Monitoring2 = monitoringJson2.ToObject<Monitoring>();
                                foreach (var item in businessSetupsJson)
                                {
                                    monitorings2.Add(item.ToObject<BusinessInProgress>());
                                }
                                _context.Monitorings.Add(Monitoring2);
                                foreach (BusinessInProgress businessSetup in monitorings2)
                                {
                                    _context.BusinessInProgresses.Add(businessSetup);
                                }
                                _context.SaveChanges();
                                transaction.Commit();
                            break;

                        case "Furthereducation":
                            List<FurthereducationInProgress> monitorings3 = new List<FurthereducationInProgress>();
                                dynamic jsonData3 = objData;
                                JObject monitoringJson3 = jsonData3.monitoring;
                                JArray furthereducationJson = jsonData3.futureeducation;
                                var Monitoring3 = monitoringJson3.ToObject<Monitoring>();

                                 // need to check codition later
                                //var MonitoringInDb4 = _context.Monitorings.FirstOrDefault(c => c.MonitoringTime == Monitoring4.MonitoringTime && c.Type == Monitoring4.Type);
                                //if (MonitoringInDb4 != null)
                                //{
                                //    return BadRequest();
                                //}
                                foreach (var item in furthereducationJson)
                                {
                                    monitorings3.Add(item.ToObject<FurthereducationInProgress>());
                                }
                                _context.Monitorings.Add(Monitoring3);
                                foreach (FurthereducationInProgress furtherEducationInProgress in monitorings3)
                                {
                                    _context.FurthereducationInProgresses.Add(furtherEducationInProgress);
                                }
                                _context.SaveChanges();
                                transaction.Commit();
                            break;

                        case "Futuretraining":
                            List<FutureTrainingProgress> monitorings4 = new List<FutureTrainingProgress>();
                                dynamic jsonData4 = objData;
                                JObject monitoringJson4 = jsonData4.monitoring;
                                JArray futureTrainingJson = jsonData4.futuretraining;
                                var Monitoring4 = monitoringJson4.ToObject<Monitoring>();


                                 // need to check codition later    (check condition if already monitor cannot monitor agaiin)
                                //var MonitoringInDb4 = _context.Monitorings.FirstOrDefault(c => c.MonitoringDate <= Monitoring4.MonitoringDate && c.Type == "Futuretraining");
                                //if (MonitoringInDb4 != null)
                                //{
                                //    return BadRequest();
                                //}

                                foreach (var item in futureTrainingJson)
                                {
                                    monitorings4.Add(item.ToObject<FutureTrainingProgress>());
                                }
                                _context.Monitorings.Add(Monitoring4);
                                foreach (FutureTrainingProgress futureTrainingProgress in monitorings4)
                                {
                                    _context.FutureTrainingProgresses.Add(futureTrainingProgress);
                                }

                            

                                _context.SaveChanges();
                                transaction.Commit();
                            break;
                        default:
                            transaction.Rollback();
                            return BadRequest();
                    }
                }
                catch
                {
                    transaction.Rollback();
                    return BadRequest();
                }
                finally
                {
                    transaction.Dispose();
                }
            }
            return Ok();
        }



        //Update 
        //Put  /api/monitoringoption/
        [HttpPut]
        public IActionResult UpdateMonitoring()
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest();
                    //Get value from parameter form control
                    var id = int.TryParse(Request.Form["MonitoringId"], out var monitoringId) ? monitoringId : 0;
                    var TypeCondition = (string)Request.Form["Type"];
                    //relationship  (Update Child table first, and then update parent table to prevent error )
                    switch (TypeCondition)
                    {
                        case "Placement":
                            var placementProgressDto = new PLacementProcessDto()
                            {
                                Id = int.TryParse(Request.Form["PlacementprocessId"], out var ppId) ? ppId : 0,
                                Completed = Request.Form["Completed"],
                                MonitoringId = int.TryParse(Request.Form["PlacementpmonitoringId"], out var pmId) ? pmId : 0,
                                PlacementStatus = Request.Form["Placementstatus"],
                                Salary = Request.Form["Salary"],
                                Note = Request.Form["Placementprogressnote"]
                            };
                            var placementprogressInDb = _context.PlacementProgresses.SingleOrDefault(c => c.MonitoringId == id);
                            if (placementprogressInDb == null)
                            {
                                return NotFound();
                            }
                            _mapper.Map(placementProgressDto, placementprogressInDb);
                            _context.SaveChanges();
                            break;
                        case "Businesssetup":
                            var businessInProgressDto = new BusinessInProgressDto()
                            {
                                Id = int.TryParse(Request.Form["BusinesssetupId"], out var bsId) ? bsId : 0,
                                StillInbusiness = Request.Form["Sillinbusiness"],
                                MonitoringId = int.TryParse(Request.Form["BusinessmonitoringId"], out var bmId) ? bmId : 0,
                                BusinessType = Request.Form["BusinessnameType"],
                                Expense = Request.Form["Expense"],
                                Income = Request.Form["Income"],
                                Note = Request.Form["Businessprogressnote"]
                            };
                            var businessInProgressInDb = _context.BusinessInProgresses.SingleOrDefault(c => c.MonitoringId == id);
                            if (businessInProgressInDb == null)
                            {
                                return NotFound();
                            }
                            _mapper.Map(businessInProgressDto, businessInProgressInDb);
                            _context.SaveChanges();
                            break;

                        case "Furthereducation":
                            var furtherInProgressDto = new FurthereducationInProgressDto()
                            {
                                Id = int.TryParse(Request.Form["FurthereducationId"], out var feId) ? feId : 0,
                                MonitoringId = int.TryParse(Request.Form["FurtherEducationmonitoringId"], out var femId) ? femId : 0,
                                Ontraining = Request.Form["Ontraining"],
                                GraduateDate = DateTime.TryParseExact(Request.Form["GraduatedateFuther"], "MM/dd/yyyy", null, System.Globalization.DateTimeStyles.None, out var feGrad) ? feGrad : DateTime.MinValue,
                                DropoutDate = DateTime.TryParseExact(Request.Form["DropoutdateFuther"], "MM/dd/yyyy", null, System.Globalization.DateTimeStyles.None, out var feDrop) ? feDrop : DateTime.MinValue,
                                Reason = Request.Form["ReasondateFuther"]
                            };
                            var furtherInProgressInDb = _context.FurthereducationInProgresses.SingleOrDefault(c => c.MonitoringId == id);
                            if (furtherInProgressInDb == null)
                            {
                                return NotFound();
                            }
                            _mapper.Map(furtherInProgressDto, furtherInProgressInDb);
                            _context.SaveChanges();
                            break;
                        case "Futuretraining":

                            var futureTrainingProgressDto = new FutureTrainingProgressDto()
                            {
                                Id = int.TryParse(Request.Form["FurtureTrainingId"], out var ftId) ? ftId : 0,
                                MonitoringId = int.TryParse(Request.Form["FurtureTrainingmonitoringId"], out var ftmId) ? ftmId : 0,
                                LessionId = int.TryParse(Request.Form["LessionId"], out var lId) ? lId : 0,
                                Ontraining = Request.Form["OntrainingFurtureTraining"],
                                GraduateDate = DateTime.TryParseExact(Request.Form["GraduatedateFurtureTraining"], "MM/dd/yyyy", null, System.Globalization.DateTimeStyles.None, out var ftGrad) ? ftGrad : DateTime.MinValue,
                                DropoutDate = DateTime.TryParseExact(Request.Form["DropoutdateFurtureTraining"], "MM/dd/yyyy", null, System.Globalization.DateTimeStyles.None, out var ftDrop) ? ftDrop : DateTime.MinValue,
                                Reason = Request.Form["ReasondateFurtureTraining"]
                            };
                            var futureTrainingInDb = _context.FutureTrainingProgresses.SingleOrDefault(c => c.MonitoringId == id);
                            if (futureTrainingInDb == null)
                            {
                                return NotFound();
                            }
                            _mapper.Map(futureTrainingProgressDto, futureTrainingInDb);
                            _context.SaveChanges();
                            break;
                        default:
                            transaction.Rollback();
                            return BadRequest();
                    }
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    var user = _context.Users.SingleOrDefault(c => c.Id == userId);

                    var monitoringDto = new MonitoringDto()
                    {
                        Id = int.TryParse(Request.Form["MonitoringId"], out var mId) ? mId : 0,
                        MonitoringTime = Request.Form["MonitoringTime"],
                        Enroll = user.FirstName + " " + user.LastName,
                        Type = Request.Form["Type"],
                        ClientId = int.TryParse(Request.Form["ClientId"], out var mcId) ? mcId : 0,
                        MonitoringDate = DateTime.TryParseExact(Request.Form["MonitoringDate"], "MM/dd/yyyy", null, System.Globalization.DateTimeStyles.None, out var mDate) ? mDate : DateTime.MinValue,
                        NextMonitoringDate = DateTime.TryParseExact(Request.Form["Nextmonitoringdate"], "MM/dd/yyyy", null, System.Globalization.DateTimeStyles.None, out var nmDate) ? nmDate : DateTime.MinValue,
                        Monitoringtype = Request.Form["Monitoringtype"]
                    };
                    var monitoringInDb = _context.Monitorings.SingleOrDefault(c => c.Id == id);
                    if (monitoringInDb == null)
                    {
                        return NotFound();
                    }
                    _mapper.Map(monitoringDto, monitoringInDb);
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    return BadRequest();
                }
                finally
                {
                    transaction.Dispose();
                }
            }
            return Ok();
        }



        [HttpDelete]
        public IActionResult DeleteMonitoring(int id, string conditionType)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    if (conditionType == "Placement")
                    {
                        var placementProgressInDb = _context.PlacementProgresses.SingleOrDefault(c => c.MonitoringId == id);

                        if (placementProgressInDb == null)
                            return NotFound();

                        _context.PlacementProgresses.Remove(placementProgressInDb);
                    }
                    else if (conditionType == "Futuretraining")
                    {
                        var FutureProgressInDb = _context.FutureTrainingProgresses.SingleOrDefault(c => c.MonitoringId == id);

                        if (FutureProgressInDb == null)
                            return NotFound();

                        _context.FutureTrainingProgresses.Remove(FutureProgressInDb);
                    }
                    //else if (conditionType == "Futuretraining")
                    //{
                    //    var FutureProgressInDb = _context.FurthereducationInProgresses.SingleOrDefault(c => c.MonitoringId == id);

                    //    if (FutureProgressInDb == null)
                    //        return NotFound();

                    //    _context.FurthereducationInProgresses.Remove(FutureProgressInDb);
                    //}

                    var monitoringinDb = _context.Monitorings.SingleOrDefault(c => c.Id == id);

                    if (monitoringinDb == null)
                        return NotFound();

                    _context.Monitorings.Remove(monitoringinDb);
                    _context.SaveChanges();

                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    return BadRequest();
                }
                finally
                {
                    transaction.Dispose();
                }
            }
            return Ok(); 
        }



  
       
        
    }
}

