using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using AutoMapper;
using MtpApp.Dtos;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class FuturesTrainingsController : ApiController
    {
        private ApplicationDbContext _context;
        public FuturesTrainingsController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/futurestrainings?clientId={id}
        [HttpGet]
        public IHttpActionResult GetFuturesTrainings(int clientId)
        {
            var FuturesTrainings = _context.FuturesTrainings.Include(c => c.Client).Include(c => c.Subject).Select(Mapper.Map<FuturesTraining, FuturesTrainingDto>).Where(c => c.ClientId == clientId); 
            return Ok(FuturesTrainings);
        }

        // GET: /api/futurestrainings?clientId={id}
        [HttpGet]
        public IHttpActionResult GetFuturesTrainings(string futurestrainingsId, string status)
        {
            if (futurestrainingsId == "all")
            {
                var FuturesTrainings = _context.FuturesTrainings.Include(c => c.Client).Include(c => c.Subject).Select(Mapper.Map<FuturesTraining, FuturesTrainingDto>).Where(c => c.Status == status);
                return Ok(FuturesTrainings);
            }
            else
            {
                var FuturesTrainings = _context.FuturesTrainings.Include(c => c.Client).Include(c => c.Subject).Select(Mapper.Map<FuturesTraining, FuturesTrainingDto>).Where(c => c.ClientId == int.Parse(futurestrainingsId) && c.Status == status);
                return Ok(FuturesTrainings);
            }
        }
        // GET: /api/futurestrainings/{id}
        [HttpGet]
        public IHttpActionResult GetFuturesTraining(int id)
        {
            var FuturesTrainings = _context.FuturesTrainings.Include(c => c.Client).Include(c => c.Subject).SingleOrDefault(c => c.id == id);

            if (FuturesTrainings == null)
                return NotFound();
            return Ok(Mapper.Map<FuturesTraining, FuturesTrainingDto>(FuturesTrainings));
        }

        // POST: /api/futurestrainings
        [HttpPost]
        public IHttpActionResult Createfuturestraining(FuturesTrainingDto FuturesTrainingDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var newfuturestraining = Mapper.Map<FuturesTrainingDto, FuturesTraining>(FuturesTrainingDto);
            _context.FuturesTrainings.Add(newfuturestraining);
            _context.SaveChanges();

            FuturesTrainingDto.id = newfuturestraining.id;

            return Created(new Uri(Request.RequestUri + "/" + FuturesTrainingDto.id), FuturesTrainingDto);
        }

        // PUT: /api/futurestrainings/{id}
        [HttpPut]
        public IHttpActionResult Updatefuturestraining(int id, FuturesTrainingDto FuturesTrainingDto)
        {
            var futurestrainingsInDb = _context.FuturesTrainings.SingleOrDefault(c => c.id == id);
            if (futurestrainingsInDb == null)
                return NotFound();
            if (FuturesTrainingDto.id == 0)
            {
                futurestrainingsInDb.Status = FuturesTrainingDto.Status;
            }
            else
            {
                Mapper.Map(FuturesTrainingDto, futurestrainingsInDb);
            }
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/futurestrainings/{id}
        [HttpDelete]
        public IHttpActionResult Deletefuturestraining(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var futurestrainingsInDb = _context.FuturesTrainings.SingleOrDefault(c => c.id == id);

            if (futurestrainingsInDb == null)
                return NotFound();

            _context.FuturesTrainings.Remove(futurestrainingsInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

    }
}
