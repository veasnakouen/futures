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
    public class BusinessSetupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public BusinessSetupsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public IActionResult GetbusinessSetup(int id)
        {
            var businessSetUp = _context.BusinessSetUps
                .Include(c => c.Client)
                .Include(c => c.BusinessSetUpCategory)
                .Where(c => c.Id == id)
                .Select(b => _mapper.Map<BusinessSetUp, BusinessSetUpDto>(b))
                .SingleOrDefault();

            if (businessSetUp == null)
                return NotFound();

            return Ok(businessSetUp);
        }

        [HttpGet]
        public IActionResult GetbusinessSetupByClientid([FromQuery] int clientId)
        {
            var businessSetUp = _context.BusinessSetUps
                .Include(c => c.Client)
                .Include(c => c.BusinessSetUpCategory)
                .ToList()
                .Select(b => _mapper.Map<BusinessSetUp, BusinessSetUpDto>(b))
                .Where(c => c.ClientId == clientId);

            return Ok(businessSetUp);
        }

        [HttpPost]
        public IActionResult CreateBusinessSetup([FromBody] BusinessSetUpDto businessSetUpDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var businessSetUp = _mapper.Map<BusinessSetUpDto, BusinessSetUp>(businessSetUpDto);

            _context.BusinessSetUps.Add(businessSetUp);
            _context.SaveChanges();

            businessSetUpDto.Id = businessSetUp.Id;

            return CreatedAtAction(nameof(GetbusinessSetup), new { id = businessSetUpDto.Id }, businessSetUpDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBusinessSetup(int id, [FromBody] BusinessSetUpDto businessSetUpDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var businessSetUpInDb = _context.BusinessSetUps.SingleOrDefault(c => c.Id == id);

            if (businessSetUpInDb == null)
                return NotFound();

            _mapper.Map(businessSetUpDto, businessSetUpInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBusinessSetup(int id)
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

