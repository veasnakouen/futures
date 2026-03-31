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
    public class BusinessCategoriesController : ApiController
    {
         private ApplicationDbContext _context;
         public BusinessCategoriesController()
         {
             _context = new ApplicationDbContext();
         }

         // GET /api/businesscategories
         [HttpGet]
         public IHttpActionResult GetBusinessCategories()
         {

            //Api get  Create Variable = connnection . Model in dbset  .select  (  mapper  .  model to modeldto    )   . where condtion

             var BusinessCategories = _context.BusinessSetUpCategories.Select(Mapper.Map<BusinessSetUpCategory, BusinessSetUpCateogryDto>).Where(c => c.IsDeleted != "Active");

             return Ok(BusinessCategories);
         }

         // GET /api/businesscategories/{id}
         [HttpGet]
         public IHttpActionResult GetBusinessCategory(int id)
         {
             var businessCategoryInDb = _context.BusinessSetUpCategories.SingleOrDefault(c => c.IsDeleted != "Active" && c.Id == id);

             if (businessCategoryInDb == null)
                 return NotFound();

             return Ok(Mapper.Map<BusinessSetUpCategory, BusinessSetUpCateogryDto>(businessCategoryInDb));
         }

         // POST /api/businesscategories
         [HttpPost]
         public IHttpActionResult CreateBusinesscategory(BusinessSetUpCateogryDto businessSetUpCateogryDto)
         {
             if (!ModelState.IsValid)
                 return BadRequest();

             //Check if exist
             var businessCategoryInDb = _context.BusinessSetUpCategories.FirstOrDefault(c => c.BusCategoryName == businessSetUpCateogryDto.BusCategoryName);

             if (businessCategoryInDb != null)
                 return BadRequest();

             var BusinessSetUpCategory = Mapper.Map<BusinessSetUpCateogryDto, BusinessSetUpCategory>(businessSetUpCateogryDto);

             _context.BusinessSetUpCategories.Add(BusinessSetUpCategory);
             _context.SaveChanges();

             businessSetUpCateogryDto.Id = BusinessSetUpCategory.Id;

             return Created(new Uri(Request.RequestUri + "/" + businessSetUpCateogryDto.Id), businessSetUpCateogryDto);
         }

         // PUT /api/businesscategories/{id}
         [HttpPut]
         public IHttpActionResult UpdateBusinesscategory(int id, BusinessSetUpCateogryDto businessSetUpCateogryDto)
         {
             if (!ModelState.IsValid)
                 return BadRequest();

             //Check if exist
             var businessCategory = _context.BusinessSetUpCategories.FirstOrDefault(c => c.Id != id && c.BusCategoryName == businessSetUpCateogryDto.BusCategoryName);

             if (businessCategory != null)
                 return BadRequest();

             var businessCategoryInDb = _context.BusinessSetUpCategories.SingleOrDefault(c => c.Id == id);

             if (businessCategoryInDb == null)
                 return NotFound();

             Mapper.Map(businessSetUpCateogryDto, businessCategoryInDb);
             _context.SaveChanges();
             return Ok(new { });
         }

         // DELETE /api/businesscategories/{id}
         [HttpDelete]
         public IHttpActionResult DeleteBusinesscategory(int id)
         {
             var businessCategory = _context.BusinessSetUpCategories.SingleOrDefault(c => c.Id == id);

             if (businessCategory == null)
                 return NotFound();

             businessCategory.IsDeleted = "Active";
             _context.SaveChanges();

             return Ok(new { });
         }
    }
}
