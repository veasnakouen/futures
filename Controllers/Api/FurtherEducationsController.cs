using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
     [Authorize]
    public class FurtherEducationsController : ApiController
    {
        private ApplicationDbContext _context;
        public FurtherEducationsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/furthereducations/{id}
        [HttpGet]
        public IHttpActionResult GetFurtherEducation(int id)
        {
            var furtherEducation = _context.FurtherEducations.SingleOrDefault(c => c.Id == id);

            if (furtherEducation == null)
                return NotFound();

            return Ok(Mapper.Map<FurtherEducation, FurtherEducationDto>(furtherEducation));
        }

        // GET: /api/furthereducations?clientId={id}
        [HttpGet]
        public IHttpActionResult GetFurtherEducationByClientId(int clientId)
        {
            var furtherEducations = _context.FurtherEducations.Select(Mapper.Map<FurtherEducation, FurtherEducationDto>).Where(c => c.ClientId == clientId);

            return Ok(furtherEducations);
        }

        //// POST: /api/furthereducations
        //[HttpPost]
        //public IHttpActionResult CreateFurtherEducation(FurtherEducationDto furtherEducationDto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();

        //    var furtherEducation = Mapper.Map<FurtherEducationDto, FurtherEducation>(furtherEducationDto);

        //    _context.FurtherEducations.Add(furtherEducation);
        //    _context.SaveChanges();

        //    furtherEducationDto.Id = furtherEducation.Id;

        //    return Created(new Uri(Request.RequestUri + "/" + furtherEducationDto.Id), furtherEducationDto);
        //}

        // PUT: /api/furthereducations/{id}
        [HttpPut]
        public IHttpActionResult UpdateFurtherEducation(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var furtherEducationInDb = _context.FurtherEducations.SingleOrDefault(c => c.ClientId == id);

            var furtherEducationDto = new FurtherEducationDto()
            {
                ClientId = int.Parse(HttpContext.Current.Request.Form["ClientId"]),
                University = Boolean.Parse(HttpContext.Current.Request.Form["University"]),
                PublicSchool = Boolean.Parse(HttpContext.Current.Request.Form["PublicSchool"]),
                VocationalTraining = Boolean.Parse(HttpContext.Current.Request.Form["VocationalTraining"]),
                ComputerSchool = Boolean.Parse(HttpContext.Current.Request.Form["ComputerSchool"]),
                EnglishSchool = Boolean.Parse(HttpContext.Current.Request.Form["EnglishSchool"]),
                ChineseSchool = Boolean.Parse(HttpContext.Current.Request.Form["ChineseSchool"]),
                AvailableTime = HttpContext.Current.Request.Form["AvailableTime"]
            };

            if (furtherEducationInDb == null)
            {
                var furtherEducation = Mapper.Map<FurtherEducationDto, FurtherEducation>(furtherEducationDto);

                _context.FurtherEducations.Add(furtherEducation);
                _context.SaveChanges();

                furtherEducationDto.Id = furtherEducation.Id;

                return Created(new Uri(Request.RequestUri + "/" + furtherEducationDto.Id), furtherEducationDto);
            }
            else
            {
                Mapper.Map(furtherEducationDto, furtherEducationInDb);
                _context.SaveChanges();

                return Ok(new { });
            }
        }

        // DELETE: /api/furthereducation/{id}
        [HttpDelete]
        public IHttpActionResult DeleteFurtherEducation(int id)
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
