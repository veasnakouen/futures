using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FuturesTrainingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public FuturesTrainingsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /api/futurestrainings?clientId={id}
        [HttpGet]
        public IActionResult GetFuturesTrainings(int clientId)
        {
            var FuturesTrainings = _context.FuturesTrainings.Include(c => c.Client).Include(c => c.Subject).Select(_mapper.Map<FuturesTraining, FuturesTrainingDto>).Where(c => c.ClientId == clientId); 
            return Ok(FuturesTrainings);
        }

        // GET: /api/futurestrainings/bystatus?futurestrainingsId={id}&status={status}
        [HttpGet("bystatus")]
        public IActionResult GetFuturesTrainings(string futurestrainingsId, string status)
        {
            if (futurestrainingsId == "all")
            {
                var FuturesTrainings = _context.FuturesTrainings.Include(c => c.Client).Include(c => c.Subject).Select(_mapper.Map<FuturesTraining, FuturesTrainingDto>).Where(c => c.Status == status);
                return Ok(FuturesTrainings);
            }
            else
            {
                var FuturesTrainings = _context.FuturesTrainings.Include(c => c.Client).Include(c => c.Subject).Select(_mapper.Map<FuturesTraining, FuturesTrainingDto>).Where(c => c.ClientId == int.Parse(futurestrainingsId) && c.Status == status);
                return Ok(FuturesTrainings);
            }
        }
        // GET: /api/futurestrainings/{id}
        [HttpGet("{id}")]
        public IActionResult GetFuturesTraining(int id)
        {
            var FuturesTrainings = _context.FuturesTrainings.Include(c => c.Client).Include(c => c.Subject).SingleOrDefault(c => c.id == id);

            if (FuturesTrainings == null)
                return NotFound();
            return Ok(_mapper.Map<FuturesTraining, FuturesTrainingDto>(FuturesTrainings));
        }

        // POST: /api/futurestrainings
        [HttpPost]
        public IActionResult Createfuturestraining(FuturesTrainingDto FuturesTrainingDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var newfuturestraining = _mapper.Map<FuturesTrainingDto, FuturesTraining>(FuturesTrainingDto);
            _context.FuturesTrainings.Add(newfuturestraining);
            _context.SaveChanges();

            FuturesTrainingDto.id = newfuturestraining.id;

            return CreatedAtAction(nameof(GetFuturesTraining), new { id = FuturesTrainingDto.id }, FuturesTrainingDto);
        }

        // PUT: /api/futurestrainings/{id}
        [HttpPut("{id}")]
        public IActionResult Updatefuturestraining(int id, FuturesTrainingDto FuturesTrainingDto)
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
                _mapper.Map(FuturesTrainingDto, futurestrainingsInDb);
            }
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/futurestrainings/{id}
        [HttpDelete("{id}")]
        public IActionResult Deletefuturestraining(int id)
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

