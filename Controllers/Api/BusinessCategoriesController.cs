using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BusinessCategoriesController : ControllerBase
    {
         private readonly ApplicationDbContext _context;
         private readonly IMapper _mapper;

         public BusinessCategoriesController(ApplicationDbContext context, IMapper mapper)
         {
             _context = context;
             _mapper = mapper;
         }

         // GET /api/businesscategories
         [HttpGet]
         public IActionResult GetBusinessCategories()
         {
             var businessCategories = _context.BusinessSetUpCategories
                 .Where(c => c.IsDeleted != "Active")
                 .Select(c => _mapper.Map<BusinessSetUpCateogryDto>(c));

             return Ok(businessCategories);
         }

         // GET /api/businesscategories/{id}
         [HttpGet("{id}")]
         public IActionResult GetBusinessCategory(int id)
         {
             var businessCategoryInDb = _context.BusinessSetUpCategories.SingleOrDefault(c => c.IsDeleted != "Active" && c.Id == id);

             if (businessCategoryInDb == null)
                 return NotFound();

             return Ok(_mapper.Map<BusinessSetUpCateogryDto>(businessCategoryInDb));
         }

         // POST /api/businesscategories
         [HttpPost]
         public IActionResult CreateBusinesscategory([FromBody] BusinessSetUpCateogryDto businessSetUpCateogryDto)
         {
             if (!ModelState.IsValid)
                 return BadRequest();

             var businessCategoryInDb = _context.BusinessSetUpCategories.FirstOrDefault(c => c.BusCategoryName == businessSetUpCateogryDto.BusCategoryName);

             if (businessCategoryInDb != null)
                 return BadRequest();

             var businessSetUpCategory = _mapper.Map<BusinessSetUpCategory>(businessSetUpCateogryDto);

             _context.BusinessSetUpCategories.Add(businessSetUpCategory);
             _context.SaveChanges();

             businessSetUpCateogryDto.Id = businessSetUpCategory.Id;

             return CreatedAtAction(nameof(GetBusinessCategory), new { id = businessSetUpCateogryDto.Id }, businessSetUpCateogryDto);
         }

         // PUT /api/businesscategories/{id}
         [HttpPut("{id}")]
         public IActionResult UpdateBusinesscategory(int id, [FromBody] BusinessSetUpCateogryDto businessSetUpCateogryDto)
         {
             if (!ModelState.IsValid)
                 return BadRequest();

             var businessCategory = _context.BusinessSetUpCategories.FirstOrDefault(c => c.Id != id && c.BusCategoryName == businessSetUpCateogryDto.BusCategoryName);

             if (businessCategory != null)
                 return BadRequest();

             var businessCategoryInDb = _context.BusinessSetUpCategories.SingleOrDefault(c => c.Id == id);

             if (businessCategoryInDb == null)
                 return NotFound();

             _mapper.Map(businessSetUpCateogryDto, businessCategoryInDb);
             _context.SaveChanges();
             return Ok(new { });
         }

         // DELETE /api/businesscategories/{id}
         [HttpDelete("{id}")]
         public IActionResult DeleteBusinesscategory(int id)
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

