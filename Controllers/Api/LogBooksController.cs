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
using Microsoft.AspNet.Identity;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class LogBooksController : ApiController
    {
         private ApplicationDbContext _context;

         public LogBooksController()
        {
            _context = new ApplicationDbContext();
        }


         ////GET /api/LogBook
         [HttpGet]
         public IHttpActionResult Getlogbooks()
         {
             var logbooks = _context.LogBooks.ToList().Select(Mapper.Map<LogBook, LogBookDto>);
             return Ok(logbooks);
         }

         //GET /api/LogBook/{id}

         [HttpGet]
         public IHttpActionResult GetLogBook(int id)
         {
             var logbooks = _context.LogBooks.SingleOrDefault(c => c.Id == id);

             if (logbooks == null)
                 return NotFound();

             return Ok(Mapper.Map<LogBook, LogBookDto>(logbooks));
         }

         //POST /api/LogBook
         [HttpPost]
         public IHttpActionResult CreateLogBooks(LogBookDto logBookDto)
         {

            var userId = User.Identity.GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            logBookDto.User = user.FirstName + " " + user.LastName;
            logBookDto.EnrollDate = DateTime.Now;

             if (!ModelState.IsValid)
                 return BadRequest();

             var newLogbook = Mapper.Map<LogBookDto, LogBook>(logBookDto);

             _context.LogBooks.Add(newLogbook);
             _context.SaveChanges();

             logBookDto.Id = newLogbook.Id;

             return Created(new Uri(Request.RequestUri + "/" + logBookDto.Id), logBookDto);
         }

         //PUT /api/LogBook/{id}

         [HttpPut]
         public IHttpActionResult UpdateLogBooks(LogBookDto logBookDto)
         {
             var userId = User.Identity.GetUserId();
             var user = _context.Users.SingleOrDefault(c => c.Id == userId);

             logBookDto.User = user.FirstName + " " + user.LastName;
             logBookDto.EnrollDate = DateTime.Now;

             if (!ModelState.IsValid)
                 return BadRequest();

             var logbookinDb = _context.LogBooks.SingleOrDefault(c => c.Id == logBookDto.Id);

             if (logbookinDb == null)
                 return NotFound();

             Mapper.Map(logBookDto, logbookinDb);

             _context.SaveChanges();

             return Ok(new { });
         }

         //DELETE /api/LogBook/{id}
         [HttpDelete]
         public IHttpActionResult DeleteLogbook(int id)
         {
             var logBook = _context.LogBooks.SingleOrDefault(c => c.Id == id);

             if (logBook == null)
                 return NotFound();

             _context.LogBooks.Remove(logBook);
             _context.SaveChanges();

             return Ok(new { });
         }
    }
}
