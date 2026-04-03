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
    [Authorize]
    public class JobCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public JobCategoriesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //GET /api/jobcategories
        [HttpGet]
        public IActionResult GetJobCategories()
        {
            var jobCategories = _context.JobCategory.ToList().Select(_mapper.Map<JobCategory, JobCategoryDto>);
            return Ok(jobCategories);
        }

        //GET /api/jobCategories/{id}
        [HttpGet]
        public IActionResult GetJobCategory(int id)
        {
            var jobCategory = _context.JobCategory.SingleOrDefault(c => c.Id == id);

            if (jobCategory == null)
                return NotFound();

            return Ok(_mapper.Map<JobCategory, JobCategoryDto>(jobCategory));
        }

        //POST /api/jobCategories
        [HttpPost]
        public IActionResult CreateJobCategory(JobCategoryDto jobCategoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.JobCategory.SingleOrDefault(c => c.Name == jobCategoryDto.Name);

            if (isExists != null)
                return BadRequest();

            var newJobCategory = _mapper.Map<JobCategoryDto, JobCategory>(jobCategoryDto);

            _context.JobCategory.Add(newJobCategory);
            _context.SaveChanges();

            jobCategoryDto.Id = newJobCategory.Id;
            
            return CreatedAtAction(nameof(GetJobCategory), new { id = newJobCategory.Id }, newJobCategory);
        }

        //PUT /api/jobCategory/{id}
        [HttpPut]
        public IActionResult UpdateJobCategory(int id, JobCategoryDto jobCategoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.JobCategory.SingleOrDefault(c => c.Id != jobCategoryDto.Id && c.Name == jobCategoryDto.Name);

            if (isExists != null)
                return BadRequest();

            var jobCategoryInDb = _context.JobCategory.SingleOrDefault(c => c.Id == id);

            _mapper.Map(jobCategoryDto, jobCategoryInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/jobCategory/{id}
        [HttpDelete]
        public IActionResult DeleteJobCategory(int id)
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

