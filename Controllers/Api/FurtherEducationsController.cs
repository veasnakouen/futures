using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FurtherEducationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public FurtherEducationsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /api/furthereducations/{id}
        [HttpGet("{id}")]
        public IActionResult GetFurtherEducation(int id)
        {
            var furtherEducation = _context.FurtherEducations.SingleOrDefault(c => c.Id == id);

            if (furtherEducation == null)
                return NotFound();

            return Ok(_mapper.Map<FurtherEducation, FurtherEducationDto>(furtherEducation));
        }

        // GET: /api/furthereducations?clientId={id}
        [HttpGet]
        public IActionResult GetFurtherEducationByClientId(int clientId)
        {
            var furtherEducations = _context.FurtherEducations.Select(_mapper.Map<FurtherEducation, FurtherEducationDto>).Where(c => c.ClientId == clientId);

            return Ok(furtherEducations);
        }

        //// POST: /api/furthereducations
        //[HttpPost]
        //public IActionResult CreateFurtherEducation(FurtherEducationDto furtherEducationDto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();

        //    var furtherEducation = _mapper.Map<FurtherEducationDto, FurtherEducation>(furtherEducationDto);

        //    _context.FurtherEducations.Add(furtherEducation);
        //    _context.SaveChanges();

        //    furtherEducationDto.Id = furtherEducation.Id;

        //    return Created(new Uri(Request.RequestUri + "/" + furtherEducationDto.Id), furtherEducationDto);
        //}

        // PUT: /api/furthereducations/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateFurtherEducation(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var furtherEducationInDb = _context.FurtherEducations.SingleOrDefault(c => c.ClientId == id);

            var furtherEducationDto = new FurtherEducationDto()
            {
                ClientId = int.TryParse(Request.Form["ClientId"], out var clientIdVal) ? clientIdVal : 0,
                University = bool.TryParse(Request.Form["University"], out var uni) && uni,
                PublicSchool = bool.TryParse(Request.Form["PublicSchool"], out var pub) && pub,
                VocationalTraining = bool.TryParse(Request.Form["VocationalTraining"], out var voc) && voc,
                ComputerSchool = bool.TryParse(Request.Form["ComputerSchool"], out var comp) && comp,
                EnglishSchool = bool.TryParse(Request.Form["EnglishSchool"], out var eng) && eng,
                ChineseSchool = bool.TryParse(Request.Form["ChineseSchool"], out var chi) && chi,
                AvailableTime = Request.Form["AvailableTime"]
            };

            if (furtherEducationInDb == null)
            {
                var furtherEducation = _mapper.Map<FurtherEducationDto, FurtherEducation>(furtherEducationDto);

                _context.FurtherEducations.Add(furtherEducation);
                _context.SaveChanges();

                furtherEducationDto.Id = furtherEducation.Id;

                return CreatedAtAction(nameof(GetFurtherEducation), new { id = furtherEducationDto.Id }, furtherEducationDto);
            }
            else
            {
                _mapper.Map(furtherEducationDto, furtherEducationInDb);
                _context.SaveChanges();

                return Ok(new { });
            }
        }

        // DELETE: /api/furthereducation/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteFurtherEducation(int id)
        {
            var furtherEducation = _context.FurtherEducations.SingleOrDefault(c => c.Id == id);

            if (furtherEducation == null)
                return NotFound();

            _context.FurtherEducations.Remove(furtherEducation);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}

