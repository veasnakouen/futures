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
    //use this to login before access this api
    [Authorize]
    public class SocialSupportsController : ApiController
    {
        private ApplicationDbContext _context;
        public SocialSupportsController()
        {
            // make constructor to create connection for  api
            _context = new ApplicationDbContext();
        }



        // GET: /api/socialsupports?clientId={id}
        [HttpGet]
        public IHttpActionResult GetSocialSupports(int clientId)
        {
            var Socialsupports = _context.SocialSupports
                                .Include(c => c.Client)
                                .Select(Mapper.Map<SocialSupport, SocialSupportDto>)
                                .Where(c => c.ClientId == clientId);
            if (Socialsupports == null)
                return NotFound();

            return Ok(Socialsupports);
        }

        // GET: /api/socialsupports
        [HttpGet]
        public IHttpActionResult GetSocialSupport()
        {
            var SocialSupport = _context.SocialSupports.Include(c => c.Client).Select(Mapper.Map<SocialSupport,SocialSupportDto>);
            return Ok(SocialSupport);
        }

        // GET: /api/socialsupports/{id}
        [HttpGet]
        public IHttpActionResult GetSocialSupport(int id)
        {
            var SocialSupportInDb = _context.SocialSupports.Include(c => c.Client).SingleOrDefault(c => c.Id == id);

            if (SocialSupportInDb == null)
                return NotFound();

            return Ok(Mapper.Map<SocialSupport, SocialSupportDto>(SocialSupportInDb));
        }

        // POST: /api/socialsupports
        [HttpPost]
        public IHttpActionResult CreateSocialSupport(SocialSupportDto socialSupportDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var newSocialSupport = Mapper.Map<SocialSupportDto, SocialSupport>(socialSupportDto);

            _context.SocialSupports.Add(newSocialSupport);
            _context.SaveChanges();
            socialSupportDto.Id = newSocialSupport.Id;
            return Created(new Uri(Request.RequestUri + "/" + socialSupportDto.Id), socialSupportDto);
        }

        // PUT: /api/socialsupports/{id}
        [HttpPut]
        public IHttpActionResult UpdateSocialSupport(int id, SocialSupportDto SocialSupportDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var socialSupportIndb = _context.SocialSupports.SingleOrDefault(c => c.Id == id);

            if (socialSupportIndb == null)
                return NotFound();

            Mapper.Map(SocialSupportDto, socialSupportIndb);
            _context.SaveChanges();
            return Ok(new { });
        }

        //// DELETE: /api/SocialSupports/{id}
        [HttpDelete]
        public IHttpActionResult DeleteSocialSupport(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var socialSupportIndb = _context.SocialSupports.SingleOrDefault(c => c.Id == id);

            if (socialSupportIndb == null)
                return NotFound();

            _context.SocialSupports.Remove(socialSupportIndb);
            _context.SaveChanges();

            return Ok(new { });
        }

    }
}
