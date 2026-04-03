using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BeneficiariesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public BeneficiariesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetBeneficiariesByClientId([FromQuery] int clientId)
        {
            var beneficiaries = _context.Beneficiaries
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(c => _mapper.Map<Beneficiary, BeneficiaryDto>(c));
            return Ok(beneficiaries);
        }

        [HttpGet("{id}")]
        public IActionResult GetBeneficiary(int id)
        {
            var beneficiary = _context.Beneficiaries.SingleOrDefault(c => c.Id == id);
            if (beneficiary == null)
                return NotFound();
            return Ok(_mapper.Map<Beneficiary, BeneficiaryDto>(beneficiary));
        }

        [HttpPost]
        public IActionResult CreateBeneficiary([FromBody] BeneficiaryDto beneficiaryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var beneficiary = _mapper.Map<BeneficiaryDto, Beneficiary>(beneficiaryDto);
            _context.Beneficiaries.Add(beneficiary);
            _context.SaveChanges();
            beneficiaryDto.Id = beneficiary.Id;
            return CreatedAtAction(nameof(GetBeneficiary), new { id = beneficiaryDto.Id }, beneficiaryDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBeneficiary(int id, [FromBody] BeneficiaryDto beneficiaryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var beneficiaryInDb = _context.Beneficiaries.SingleOrDefault(c => c.Id == id);
            if (beneficiaryInDb == null)
                return NotFound();

            _mapper.Map(beneficiaryDto, beneficiaryInDb);
            _context.SaveChanges();
            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBeneficiary(int id)
        {
            try
            {
                var beneficiary = _context.Beneficiaries.SingleOrDefault(c => c.Id == id);
                if (beneficiary == null)
                    return NotFound();

                _context.Beneficiaries.Remove(beneficiary);
                _context.SaveChanges();
                return Ok(new { });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}

