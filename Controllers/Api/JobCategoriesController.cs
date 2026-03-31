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
    public class JobCategoriesController : ApiController
    {
        private ApplicationDbContext _context;
        public JobCategoriesController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/jobcategories
        [HttpGet]
        public IHttpActionResult GetJobCategories()
        {
            var jobCategories = _context.JobCategory.ToList().Select(Mapper.Map<JobCategory, JobCategoryDto>);
            return Ok(jobCategories);
        }

        //GET /api/jobCategories/{id}
        [HttpGet]
        public IHttpActionResult GetJobCategory(int id)
        {
            var jobCategory = _context.JobCategory.SingleOrDefault(c => c.Id == id);

            if (jobCategory == null)
                return NotFound();

            return Ok(Mapper.Map<JobCategory, JobCategoryDto>(jobCategory));
        }

        //POST /api/jobCategories
        [HttpPost]
        public IHttpActionResult CreateJobCategory(JobCategoryDto jobCategoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.JobCategory.SingleOrDefault(c => c.Name == jobCategoryDto.Name);

            if (isExists != null)
                return BadRequest();

            var newJobCategory = Mapper.Map<JobCategoryDto, JobCategory>(jobCategoryDto);

            _context.JobCategory.Add(newJobCategory);
            _context.SaveChanges();

            jobCategoryDto.Id = newJobCategory.Id;
            
            return Created(new Uri(Request.RequestUri + "/" + newJobCategory.Id), newJobCategory);
        }

        //PUT /api/jobCategory/{id}
        [HttpPut]
        public IHttpActionResult UpdateJobCategory(int id, JobCategoryDto jobCategoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.JobCategory.SingleOrDefault(c => c.Id != jobCategoryDto.Id && c.Name == jobCategoryDto.Name);

            if (isExists != null)
                return BadRequest();

            var jobCategoryInDb = _context.JobCategory.SingleOrDefault(c => c.Id == id);

            Mapper.Map(jobCategoryDto, jobCategoryInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/jobCategory/{id}
        [HttpDelete]
        public IHttpActionResult DeleteJobCategory(int id)
        {
            var jobCategoryInDb = _context.JobCategory.SingleOrDefault(c => c.Id == id);

            if (jobCategoryInDb == null)
                return NotFound();

            _context.JobCategory.Remove(jobCategoryInDb);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
