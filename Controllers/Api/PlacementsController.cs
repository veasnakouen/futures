using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlacementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PlacementsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetPlacements([FromQuery] int clientId)
        {
            var placements = _context.Placements
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<Placement, PlacementDto>(c));
            return Ok(placements);
        }

        [HttpGet("{id}")]
        public IActionResult GetPlacement(int id)
        {
            var placement = _context.Placements.SingleOrDefault(c => c.Id == id);
            if (placement == null)
                return NotFound();
            return Ok(_mapper.Map<Placement, PlacementDto>(placement));
        }

        [HttpPost]
        public IActionResult CreatePlacement()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var placementDto = new PlacementDto()
            {
                PlacementDate = DateTime.ParseExact(Request.Form["PlacementDate"], "MM/dd/yyyy", null),
                PlacementType = Request.Form["PlacementType"],
                JobPositionId = int.Parse(Request.Form["JobPositionId"]),
                CompanyName = Request.Form["CompanyName"],
                CompanyContactName = Request.Form["CompanyContactName"],
                CompanyContactPhone = Request.Form["CompanyContactPhone"],
                CompanyContactEmail = Request.Form["CompanyContactEmail"],
                CompanyAddress = Request.Form["CompanyAddress"],
                JobPlacedBy = Request.Form["JobPlacedBy"],
                Salary = Request.Form["Salary"],
                Tips = Request.Form["Tips"],
                TotalIncome = Request.Form["TotalIncome"],
                WorkTime = Request.Form["WorkTime"],
                DayOff = Request.Form["DayOff"],
                NumberOfAnnualLeave = Request.Form["NumberOfAnnualLeave"],
                CountedTime = Request.Form["CaseId"],
                ClientId = int.Parse(Request.Form["ClientId"]),
                Health = bool.Parse(Request.Form["Health"]),
                Meal = bool.Parse(Request.Form["Meal"]),
                Transport = bool.Parse(Request.Form["Transport"]),
                Bonus = bool.Parse(Request.Form["Bonus"]),
                PublicHoliday = bool.Parse(Request.Form["PublicHoliday"]),
                AccidentInsurance = bool.Parse(Request.Form["AccidentInsurance"]),
                Accommodation = bool.Parse(Request.Form["Accommodation"]),
                Overtime = bool.Parse(Request.Form["Overtime"]),
                ThirteenMonthsSalary = bool.Parse(Request.Form["ThirteenMonthsSalary"]),
                AnnualLeave = bool.Parse(Request.Form["AnnualLeave"]),
                Status = null,
                DropfromDate = null
            };

            var isExistsCount = _context.Placements.SingleOrDefault(c => c.CountedTime == placementDto.CountedTime && c.ClientId == placementDto.ClientId);
            if (isExistsCount != null)
                return BadRequest();

            var newPlacement = _mapper.Map<PlacementDto, Placement>(placementDto);
            _context.Placements.Add(newPlacement);
            _context.SaveChanges();
            placementDto.Id = newPlacement.Id;
            return CreatedAtAction(nameof(GetPlacement), new { id = placementDto.Id }, placementDto);
        }

        [HttpPut]
        public IActionResult UpdatePlacement()
        {
            var id = int.Parse(Request.Form["PlacementId"]);
            var placementInDb = _context.Placements.SingleOrDefault(c => c.Id == id);
            if (placementInDb == null)
                return NotFound();

            var placementDto = new PlacementDto()
            {
                Id = id,
                PlacementDate = DateTime.ParseExact(Request.Form["PlacementDate"], "MM/dd/yyyy", null),
                PlacementType = Request.Form["PlacementType"],
                JobPositionId = int.Parse(Request.Form["JobPositionId"]),
                CompanyName = Request.Form["CompanyName"],
                CompanyContactName = Request.Form["CompanyContactName"],
                CompanyContactPhone = Request.Form["CompanyContactPhone"],
                CompanyContactEmail = Request.Form["CompanyContactEmail"],
                CompanyAddress = Request.Form["CompanyAddress"],
                JobPlacedBy = Request.Form["JobPlacedBy"],
                Salary = Request.Form["Salary"],
                Tips = Request.Form["Tips"],
                TotalIncome = Request.Form["TotalIncome"],
                WorkTime = Request.Form["WorkTime"],
                DayOff = Request.Form["DayOff"],
                NumberOfAnnualLeave = Request.Form["NumberOfAnnualLeave"],
                CountedTime = Request.Form["CaseId"],
                ClientId = int.Parse(Request.Form["ClientId"]),
                Health = bool.Parse(Request.Form["Health"]),
                Meal = bool.Parse(Request.Form["Meal"]),
                Transport = bool.Parse(Request.Form["Transport"]),
                Bonus = bool.Parse(Request.Form["Bonus"]),
                PublicHoliday = bool.Parse(Request.Form["PublicHoliday"]),
                AccidentInsurance = bool.Parse(Request.Form["AccidentInsurance"]),
                Accommodation = bool.Parse(Request.Form["Accommodation"]),
                Overtime = bool.Parse(Request.Form["Overtime"]),
                ThirteenMonthsSalary = bool.Parse(Request.Form["ThirteenMonthsSalary"]),
                AnnualLeave = bool.Parse(Request.Form["AnnualLeave"]),
                Status = placementInDb.Status,
                DropfromDate = placementInDb.DropfromDate
            };

            var isExistsCount = _context.Placements.SingleOrDefault(c => c.Id != placementDto.Id && c.CountedTime == placementDto.CountedTime && c.ClientId == placementDto.ClientId);
            if (isExistsCount != null)
                return BadRequest();

            _mapper.Map(placementDto, placementInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpPut("dropfromjob/{placementId}")]
        public IActionResult UpdatePlacementDropFromJob(int placementId, [FromBody] PlacementDto placementDto)
        {
            var placementInDb = _context.Placements.SingleOrDefault(c => c.Id == placementId);
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

            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePlacement(int id)
        {
            var placementInDb = _context.Placements.SingleOrDefault(c => c.Id == id);
            if (placementInDb == null)
                return NotFound();

            _context.Placements.Remove(placementInDb);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

