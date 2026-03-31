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
    public class CvReferencesController : ApiController
    {
        private ApplicationDbContext _context;
        public CvReferencesController()
        {
            _context = new ApplicationDbContext();

        }

        ////GET /api/CvReferences
        [HttpGet]
        public IHttpActionResult GetCvReferences()
        {
            var CvReferences = _context.CvReferenceS.Include(c => c.JobPositions).ToList().Select(Mapper.Map<CvReference, CvReferenceDto>);
            return Ok(CvReferences);
        }

        //GET /api/CvReferences/{id}

        [HttpGet]
        public IHttpActionResult GetCvReference(int id)
        {
            var CvReferences = _context.CvReferenceS.Include(c => c.JobPositions).ToList().Select(Mapper.Map<CvReference, CvReferenceDto>).Where(c => c.ClientId == id);

            if (CvReferences == null)
                return NotFound();

            return Ok(CvReferences);
        }

        [HttpGet]
        public IHttpActionResult GetCvReferenceById(int ReferenceId)
        {
            var CvReferences = _context.CvReferenceS.Include(c => c.JobPositions).SingleOrDefault(c => c.Id == ReferenceId);

            if (CvReferences == null)
                return NotFound();

            return Ok(Mapper.Map<CvReference, CvReferenceDto>(CvReferences));
        }


        //POST /api/CvReferences
        [HttpPost]
        public IHttpActionResult CreateCvReference(CvReferenceDto cvReferenceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.CvReferenceS.SingleOrDefault(c => c.Name == cvReferenceDto.Name && c.ClientId == cvReferenceDto.ClientId);

            if (isExists != null)
                return BadRequest();

            var newCvReferenceS = Mapper.Map<CvReferenceDto, CvReference>(cvReferenceDto);

            _context.CvReferenceS.Add(newCvReferenceS);
            _context.SaveChanges();

            cvReferenceDto.Id = newCvReferenceS.Id;

            return Created(new Uri(Request.RequestUri + "/" + cvReferenceDto.Id), cvReferenceDto);
        }



        //PUT /api/CvReferences/{id}

        [HttpPut]
        public IHttpActionResult UpdateSubjects(int id, CvReferenceDto cvReferenceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var isExists = _context.CvReferenceS.SingleOrDefault(c => c.Name == cvReferenceDto.Name && c.ClientId == cvReferenceDto.ClientId && c.Id != cvReferenceDto.Id);

            if (isExists != null)
                return BadRequest();

            var CvReferenceSInDb = _context.CvReferenceS.SingleOrDefault(c => c.Id == id);

            if (CvReferenceSInDb == null)
                return NotFound();

            Mapper.Map(cvReferenceDto, CvReferenceSInDb);

            _context.SaveChanges();

            return Ok(new { });
        }


        //DELETE /api/CvReferences/{id}
        [HttpDelete]
        public IHttpActionResult DeleteCvReference(int id)
        {
            var cvReferenceS = _context.CvReferenceS.SingleOrDefault(c => c.Id == id);

            if (cvReferenceS == null)
                return NotFound();

            _context.CvReferenceS.Remove(cvReferenceS);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
