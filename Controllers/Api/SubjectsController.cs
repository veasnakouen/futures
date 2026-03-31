using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class SubjectsController : ApiController
   {
        private ApplicationDbContext _context;
        public SubjectsController()
    {
        _context = new ApplicationDbContext();

    }

        ////GET /api/subjects
        [HttpGet]
        public IHttpActionResult GetSubjects()
        {
            var subjects = _context.Subjects.ToList().Select(Mapper.Map<Subject, SubjectDto>);
            return Ok(subjects);
        }

        //GET /api/subjects/{id}

        [HttpGet]
        public IHttpActionResult GetSubjects(int id)
        {
            var subject = _context.Subjects.SingleOrDefault(c => c.Id == id);

            if (subject == null)
                return NotFound();

            return Ok(Mapper.Map<Subject, SubjectDto>(subject));
        }


        //POST /api/subjects
        [HttpPost]
        public IHttpActionResult CreateSubject(SubjectDto subjectDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.Subjects.SingleOrDefault(c => c.SubjectName == subjectDto.SubjectName);

            if (isExists != null)
                return BadRequest();

            var newsubject = Mapper.Map<SubjectDto, Subject>(subjectDto);

            _context.Subjects.Add(newsubject);
            _context.SaveChanges();

            subjectDto.Id = newsubject.Id;

            return Created(new Uri(Request.RequestUri + "/" + subjectDto.Id), subjectDto);
        }


       
        //PUT /api/subjects/{id}

        [HttpPut]
        public IHttpActionResult UpdateSubjects(int id, SubjectDto subjectDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var isExists = _context.Subjects.SingleOrDefault(c => c.SubjectName == subjectDto.SubjectName && c.Id != subjectDto.Id);

            if (isExists != null)
                return BadRequest();

            var subjectInDb = _context.Subjects.SingleOrDefault(c => c.Id == id);

            if (subjectInDb == null)
                return NotFound();

            Mapper.Map(subjectDto, subjectInDb);

            _context.SaveChanges();

            return Ok(new { });
        }


        //DELETE /api/subjects/{id}
        [HttpDelete]
        public IHttpActionResult DeleteSubjects(int id)
        {
            var subject = _context.Subjects.SingleOrDefault(c => c.Id == id);

            if (subject == null)
                return NotFound();

            _context.Subjects.Remove(subject);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
