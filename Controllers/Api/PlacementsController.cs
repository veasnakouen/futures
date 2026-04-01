using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using AutoMapper;
using MtpApp.Dtos;
using System.Web;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class PlacementsController : ApiController
    {
        private ApplicationDbContext _context;
        public PlacementsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/placements?clientId={id}
        [HttpGet]
        public IHttpActionResult GetPlacements(int clientId)
        {
            var placements = _context.Placements
                                .Include(c => c.Clients)
                                .Include(c => c.JobPosition)
                                .Select(Mapper.Map<Placement, PlacementDto>)
                                .Where(c => c.ClientId == clientId);
            return Ok(placements);
        }

        // GET: /api/placements/{id}
        [HttpGet]
        public IHttpActionResult GetPlacement(int id)
        {
            var placement = _context.Placements
                                .Include(c => c.Clients)
                                .Include(c => c.JobPosition)
                                .SingleOrDefault(c => c.Id == id);

            if (placement == null)
                return NotFound();

            return Ok(Mapper.Map<Placement, PlacementDto>(placement));
        }

        // POST: /api/placements
        [HttpPost]
        public IHttpActionResult CreatePlacement()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var placementDto = new PlacementDto()
            {
                PlacementDate = DateTime.ParseExact(System.Web.HttpContext.Current.Request.Form["PlacementDate"], "MM/dd/yyyy", null),
                PlacementType = System.Web.HttpContext.Current.Request.Form["PlacementType"],
                JobPositionId = int.Parse(System.Web.HttpContext.Current.Request.Form["JobPositionId"]),
                CompanyName = System.Web.HttpContext.Current.Request.Form["CompanyName"],
                CompanyContactName = HttpContext.Current.Request.Form["CompanyContactName"],
                CompanyContactPhone = HttpContext.Current.Request.Form["CompanyContactPhone"],
                CompanyContactEmail = HttpContext.Current.Request.Form["CompanyContactEmail"],
                CompanyAddress = HttpContext.Current.Request.Form["CompanyAddress"],
                JobPlacedBy = HttpContext.Current.Request.Form["JobPlacedBy"],
                Salary = HttpContext.Current.Request.Form["Salary"],
                Tips = HttpContext.Current.Request.Form["Tips"],
                TotalIncome = HttpContext.Current.Request.Form["TotalIncome"],
                WorkTime = HttpContext.Current.Request.Form["WorkTime"],
                DayOff = HttpContext.Current.Request.Form["DayOff"],
                NumberOfAnnualLeave = HttpContext.Current.Request.Form["NumberOfAnnualLeave"],
                CountedTime = HttpContext.Current.Request.Form["CaseId"],
                ClientId = int.Parse(HttpContext.Current.Request.Form["ClientId"]),
                Health = bool.Parse(HttpContext.Current.Request.Form["Health"]),
                Meal = bool.Parse(HttpContext.Current.Request.Form["Meal"]),
                Transport = bool.Parse(HttpContext.Current.Request.Form["Transport"]),
                Bonus = bool.Parse(HttpContext.Current.Request.Form["Bonus"]),
                PublicHoliday = bool.Parse(HttpContext.Current.Request.Form["PublicHoliday"]),
                AccidentInsurance = bool.Parse(HttpContext.Current.Request.Form["AccidentInsurance"]),
                Accommodation = bool.Parse(HttpContext.Current.Request.Form["Accommodation"]),
                Overtime = bool.Parse(HttpContext.Current.Request.Form["Overtime"]),
                ThirteenMonthsSalary = bool.Parse(HttpContext.Current.Request.Form["ThirteenMonthsSalary"]),
                AnnualLeave = bool.Parse(HttpContext.Current.Request.Form["AnnualLeave"]),
                Status = null,
                DropfromDate = null
            };

            var isExistsCount = _context.Placements.SingleOrDefault(c => c.CountedTime == placementDto.CountedTime && c.ClientId == placementDto.ClientId);

            if (isExistsCount != null)
                return BadRequest();

            var newPlacement = Mapper.Map<PlacementDto, Placement>(placementDto);

            _context.Placements.Add(newPlacement);
            _context.SaveChanges();

            placementDto.Id = newPlacement.Id;

            return Created(new Uri(Request.RequestUri + "/" + placementDto.Id), placementDto);
        }

        // PUT: /api/placements/{id}
        [HttpPut]
        public IHttpActionResult UpdatePlacement()
        {
            var id = int.Parse(HttpContext.Current.Request.Form["PlacementId"]);

            var placementInDb = _context.Placements.SingleOrDefault(c => c.Id == id);

            if (placementInDb == null)
                return NotFound();
            var placementDto = new PlacementDto()
            {
                Id = int.Parse(HttpContext.Current.Request.Form["PlacementId"]),
                PlacementDate = DateTime.ParseExact(HttpContext.Current.Request.Form["PlacementDate"], "MM/dd/yyyy", null),
                PlacementType = HttpContext.Current.Request.Form["PlacementType"],
                JobPositionId = int.Parse(HttpContext.Current.Request.Form["JobPositionId"]),
                CompanyName = HttpContext.Current.Request.Form["CompanyName"],
                CompanyContactName = HttpContext.Current.Request.Form["CompanyContactName"],
                CompanyContactPhone = HttpContext.Current.Request.Form["CompanyContactPhone"],
                CompanyContactEmail = HttpContext.Current.Request.Form["CompanyContactEmail"],
                CompanyAddress = HttpContext.Current.Request.Form["CompanyAddress"],
                JobPlacedBy = HttpContext.Current.Request.Form["JobPlacedBy"],
                Salary = HttpContext.Current.Request.Form["Salary"],
                Tips = HttpContext.Current.Request.Form["Tips"],
                TotalIncome = HttpContext.Current.Request.Form["TotalIncome"],
                WorkTime = HttpContext.Current.Request.Form["WorkTime"],
                DayOff = HttpContext.Current.Request.Form["DayOff"],
                NumberOfAnnualLeave = HttpContext.Current.Request.Form["NumberOfAnnualLeave"],
                CountedTime = HttpContext.Current.Request.Form["CaseId"],
                ClientId = int.Parse(HttpContext.Current.Request.Form["ClientId"]),
                Health = bool.Parse(HttpContext.Current.Request.Form["Health"]),
                Meal = bool.Parse(HttpContext.Current.Request.Form["Meal"]),
                Transport = bool.Parse(HttpContext.Current.Request.Form["Transport"]),
                Bonus = bool.Parse(HttpContext.Current.Request.Form["Bonus"]),
                PublicHoliday = bool.Parse(HttpContext.Current.Request.Form["PublicHoliday"]),
                AccidentInsurance = bool.Parse(HttpContext.Current.Request.Form["AccidentInsurance"]),
                Accommodation = bool.Parse(HttpContext.Current.Request.Form["Accommodation"]),
                Overtime = bool.Parse(HttpContext.Current.Request.Form["Overtime"]),
                ThirteenMonthsSalary = bool.Parse(HttpContext.Current.Request.Form["ThirteenMonthsSalary"]),
                AnnualLeave = bool.Parse(HttpContext.Current.Request.Form["AnnualLeave"]),
                Status = placementInDb.Status,
                DropfromDate = placementInDb.DropfromDate
            };

            var isExistsCount = _context.Placements.SingleOrDefault(c => c.Id != placementDto.Id && c.CountedTime == placementDto.CountedTime && c.ClientId == placementDto.ClientId);

            if (isExistsCount != null)
                return BadRequest();

            Mapper.Map(placementDto, placementInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

         //PUT: /api/placements/{id}
        [HttpPut]
        public IHttpActionResult UpdatePlacementDropfromjob(PlacementDto placementDto ,int PlacementId)
        {
            var placementInDb = _context.Placements.SingleOrDefault(c => c.Id == PlacementId);

            if (placementInDb == null)
                return NotFound();

            if (placementInDb.Status == "Drop")
            {
                placementInDb.Status = null;
                placementInDb.DropfromDate = null;
            }
            else
            {
                placementInDb.DropfromDate = placementDto.DropfromDate;
                placementInDb.Status = "Drop";
            }

            Mapper.Map(placementInDb, placementInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/placements/{id}
        [HttpDelete]
        public IHttpActionResult DeletePlacement(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var placementInDb = _context.Placements.SingleOrDefault(c => c.Id == id);

            if (placementInDb == null)
                return NotFound();

            _context.Placements.Remove(placementInDb);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
