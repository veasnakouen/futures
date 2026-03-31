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
    public class CategoriesController : ApiController
    {
        private ApplicationDbContext _context;

        public CategoriesController()
        {
            _context = new ApplicationDbContext();
        }

        //GET /api/categories
        [HttpGet]
        public IHttpActionResult GetCategories()
        {
            var categories = _context.Categories.ToList().Select(Mapper.Map<Category, CategoryDto>);
            return Ok(categories);
        }

        //GET /api/categories
        [HttpGet]
        public IHttpActionResult GetCategory(int id)
        {
            var categoryInDb = _context.Categories.SingleOrDefault(c => c.Id == id);

            if (categoryInDb == null)
                return NotFound();

            return Ok(Mapper.Map<Category, CategoryDto>(categoryInDb));
        }

        //POST /api/categories
        [HttpPost]
        public IHttpActionResult CreateCategory(CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var category = Mapper.Map<CategoryDto, Category>(categoryDto);

            _context.Categories.Add(category);
            _context.SaveChanges();

            categoryDto.Id = category.Id;

            return Created(new Uri(Request.RequestUri + "/" + categoryDto.Id), categoryDto);
        }

        //PUT /api/categories/{id}
        [HttpPut]
        public IHttpActionResult UpdateCategory(int id, CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var categoryInDb = _context.Categories.SingleOrDefault(c => c.Id == id);

            if (categoryInDb == null)
                return NotFound();

            Mapper.Map(categoryDto, categoryInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/categories/{id}
        [HttpDelete]
        public IHttpActionResult DeleteCategory(int id)
        {
            var category = _context.Categories.SingleOrDefault(c => c.Id == id);

            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}
