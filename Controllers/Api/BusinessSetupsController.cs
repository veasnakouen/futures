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
    public class BusinessSetupsController : ApiController
    {
        private ApplicationDbContext _context;
        public BusinessSetupsController()
        {
            _context = new ApplicationDbContext();
        }
        // GET: /api/BusinessSetups/id
        [HttpGet]
        public IHttpActionResult GetbusinessSetup(int id)
        {

            var BusinessSetUp = _context.BusinessSetUps.Include(c => c.Client).Include(c => c.BusinessSetUpCategory).Select(Mapper.Map<BusinessSetUp, BusinessSetUpDto>).SingleOrDefault(c => c.Id == id);
            return Ok(BusinessSetUp);
        }

        // GET: /api/BusinessSetups?clientId={id}
        [HttpGet]
        public IHttpActionResult GetbusinessSetupByClientid(int clientId)
        {
            
            var BusinessSetUp = _context.BusinessSetUps.Include(c => c.Client).Include(c => c.BusinessSetUpCategory).Select(Mapper.Map<BusinessSetUp, BusinessSetUpDto>).Where(c => c.ClientId == clientId);
            return Ok(BusinessSetUp);
        }
        // POST: /api/BusinessSetups
        public IHttpActionResult CreateBusinessSetup(BusinessSetUpDto businessSetUpDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var BusinessSetUp = Mapper.Map<BusinessSetUpDto, BusinessSetUp>(businessSetUpDto);

            _context.BusinessSetUps.Add(BusinessSetUp);
            _context.SaveChanges();

            businessSetUpDto.Id = BusinessSetUp.Id;

            return Created(new Uri(Request.RequestUri + "/" + businessSetUpDto.Id), businessSetUpDto);
        }

        // PUT: /api/BusinessSetups/{id}
        [HttpPut]
        public IHttpActionResult UpdateBusinessSetup(int id, BusinessSetUpDto businessSetUpDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var businessSetUpInDb = _context.BusinessSetUps.SingleOrDefault(c => c.Id == id);

            if (businessSetUpInDb == null)
                return NotFound();

            Mapper.Map(businessSetUpDto, businessSetUpInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/BusinessSetups/{id}
        [HttpDelete]
        public IHttpActionResult DeleteBusinessSetup(int id)
        {
            var businessSetupInDb = _context.BusinessSetUps.SingleOrDefault(c => c.Id == id);

            if (businessSetupInDb == null)
                return NotFound();

            _context.BusinessSetUps.Remove(businessSetupInDb);
            _context.SaveChanges();

            return Ok();
        }
    }
}
