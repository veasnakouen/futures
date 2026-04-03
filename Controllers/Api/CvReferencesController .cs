using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CvReferencesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CvReferencesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetCvReferences()
        {
            var cvReferences = _context.CvReferenceS
                .Include(c => c.JobPositions)
                .ToList()
                .Select(c => _mapper.Map<CvReference, CvReferenceDto>(c));
            return Ok(cvReferences);
        }

        [HttpGet("byclient/{clientId}")]
        public IActionResult GetCvReferencesByClient(int clientId)
        {
            var cvReferences = _context.CvReferenceS
                .Include(c => c.JobPositions)
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<CvReference, CvReferenceDto>(c));
            return Ok(cvReferences);
        }

        [HttpGet("{id}")]
        public IActionResult GetCvReference(int id)
        {
            var cvReference = _context.CvReferenceS
                .Include(c => c.JobPositions)
                .SingleOrDefault(c => c.Id == id);
            if (cvReference == null)
                return NotFound();
            return Ok(_mapper.Map<CvReference, CvReferenceDto>(cvReference));
        }

        [HttpPost]
        public IActionResult CreateCvReference([FromBody] CvReferenceDto cvReferenceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.CvReferenceS.SingleOrDefault(c => c.Name == cvReferenceDto.Name && c.ClientId == cvReferenceDto.ClientId);
            if (isExists != null)
                return BadRequest();

            var newCvReference = _mapper.Map<CvReferenceDto, CvReference>(cvReferenceDto);
            _context.CvReferenceS.Add(newCvReference);
            _context.SaveChanges();
            cvReferenceDto.Id = newCvReference.Id;
            return CreatedAtAction(nameof(GetCvReference), new { id = cvReferenceDto.Id }, cvReferenceDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCvReference(int id, [FromBody] CvReferenceDto cvReferenceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isExists = _context.CvReferenceS.SingleOrDefault(c => c.Name == cvReferenceDto.Name && c.ClientId == cvReferenceDto.ClientId && c.Id != cvReferenceDto.Id);
            if (isExists != null)
                return BadRequest();

            var cvReferenceInDb = _context.CvReferenceS.SingleOrDefault(c => c.Id == id);
            if (cvReferenceInDb == null)
                return NotFound();

            _mapper.Map(cvReferenceDto, cvReferenceInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCvReference(int id)
        {
            var cvReference = _context.CvReferenceS.SingleOrDefault(c => c.Id == id);
            if (cvReference == null)
                return NotFound();

            _context.CvReferenceS.Remove(cvReference);
            _context.SaveChanges();
            return Ok(new { });
        }
    }
}

