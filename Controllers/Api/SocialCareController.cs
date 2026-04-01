using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
     [Authorize]
    public class SocialCareController : ApiController
    {
          private ApplicationDbContext _context;
          public SocialCareController()
          {
              _context = new ApplicationDbContext();
          }

          // GET: /api/socialcare/{id}
          [HttpGet]
          public IHttpActionResult GetSocialCare(int id)
          {
              var socialCare = _context.SocialCare.SingleOrDefault(c => c.Id == id);

              if (socialCare == null)
                  return NotFound();

              return Ok(Mapper.Map<SocialCare, SocialCareDto>(socialCare));
          }

          // GET: /api/socialcare?clientId={id}
          [HttpGet]
          public IHttpActionResult GetGetSocialCareByClientId(int clientId)
          {
              var socialCare = _context.SocialCare.Select(Mapper.Map<SocialCare, SocialCareDto>).Where(c => c.ClientId == clientId);

              return Ok(socialCare);
          }

          // PUT: /api/socialcare/{id}
          [HttpPut]
          public IHttpActionResult UpdateSocialCare(int id)
          {
              if (!ModelState.IsValid)
                  return BadRequest();

              var socialCareInDb = _context.SocialCare.SingleOrDefault(c => c.ClientId == id);

              var socialCareDto = new SocialCareDto()
              {
                  ClientId = int.Parse(HttpContext.CurrentAccessor.HttpContext.Request.Form["ClientId"]),
                  SocialSupportNeeded = Boolean.Parse(HttpContext.Current.Request.Form["socialsupportNeeded"]),
                  MeetingFuture = Boolean.Parse(HttpContext.Current.Request.Form["Meetingfuture"]),
                  Problem = Boolean.Parse(HttpContext.Current.Request.Form["problems"])
              };

              if (socialCareInDb == null)
              {
                  var socialCare = Mapper.Map<SocialCareDto, SocialCare>(socialCareDto);

                  _context.SocialCare.Add(socialCare);
                  _context.SaveChanges();

                  socialCareDto.Id = socialCare.Id;

                  return Created(new Uri(Request.RequestUri + "/" + socialCareDto.Id), socialCareDto);
              }
              else
              {
                  Mapper.Map(socialCareDto, socialCareInDb);
                  _context.SaveChanges();

                  return Ok(new { });
              }
          }

          // DELETE: /api/socialcare/{id}
          [HttpDelete]
          public IHttpActionResult DeleteSocialCare(int id)
          {
              var socialCare = _context.SocialCare.SingleOrDefault(c => c.Id == id);

              if (socialCare == null)
                  return NotFound();

              _context.SocialCare.Remove(socialCare);
              _context.SaveChanges();

              return Ok(new { });
          }
    }
}
