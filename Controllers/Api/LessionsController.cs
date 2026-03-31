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

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class LessionsController : ApiController
   {
        private ApplicationDbContext _context;
        public LessionsController()
    {
        _context = new ApplicationDbContext();

    }

        ////GET /api/Lessions
        [HttpGet]
        public IHttpActionResult GetLessions()
        {
            var lessions = _context.Lessions.Include(c => c.Subject).ToList().Select(Mapper.Map<Lession, LessionDto>);
            return Ok(lessions);
        }

        //GET /api/lessions/{id}

        [HttpGet]
        public IHttpActionResult GetLessions(int id)
        {
            var lession = _context.Lessions.SingleOrDefault(c => c.Id == id);

            if (lession == null)
                return NotFound();

            return Ok(Mapper.Map<Lession, LessionDto>(lession));
        }

        //GET /api/lessions/subjectId=

        [HttpGet]
        public IHttpActionResult GetLessionBySubject(int subjectId)
        {
            var lession = _context.Lessions.Include(c => c.Subject).Select(Mapper.Map<Lession, LessionDto>).Where(c => c.SubjectId == subjectId);
            if (lession == null)
                return NotFound();
            return Ok(lession);
        }


        //POST /api/lessions
        [HttpPost]
        public IHttpActionResult CreateLessions(LessionDto lessionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Lessions.FirstOrDefault(c => c.LessionSub == lessionDto.LessionSub && c.SubjectId == lessionDto.SubjectId);

            if (isExists != null)
                return BadRequest();

            var newlession = Mapper.Map<LessionDto, Lession>(lessionDto);

            _context.Lessions.Add(newlession);
            _context.SaveChanges();

            lessionDto.Id = newlession.Id;

            return Created(new Uri(Request.RequestUri + "/" + lessionDto.Id), lessionDto);
        }



        //PUT /api/lessions/{id}

        [HttpPut]
        public IHttpActionResult UpdateLessions(int id, LessionDto lessionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var isExists = _context.Lessions.SingleOrDefault(c => c.LessionSub == lessionDto.LessionSub && c.SubjectId == lessionDto.SubjectId && c.Id != lessionDto.Id);

            if (isExists != null)
                return BadRequest();

            var lessionIndb = _context.Lessions.SingleOrDefault(c => c.Id == id);

            if (lessionIndb == null)
                return NotFound();

            Mapper.Map(lessionDto, lessionIndb);

            _context.SaveChanges();

            return Ok(new { });
        }


        //DELETE /api/lessions/{id}
        [HttpDelete]
        public IHttpActionResult DeleteLessions(int id)
        {
            var lession = _context.Lessions.SingleOrDefault(c => c.Id == id);

            if (lession == null)
                return NotFound();

            _context.Lessions.Remove(lession);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
