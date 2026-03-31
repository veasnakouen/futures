using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MtpApp.Controllers.Api
{
     [Authorize]
    public class BeneficiariesController : ApiController
    {
        private ApplicationDbContext _context;
        public BeneficiariesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/beneficiaries?clientId={id}    
        [HttpGet]
        public IHttpActionResult GetBeneficiariesByClientId(int clientId)
        {
            var beneficiaries = _context.Beneficiaries.Select(Mapper.Map<Beneficiary, BeneficiaryDto>).Where(c => c.ClientId == clientId);

            return Ok(beneficiaries);
        }

        // GET: /api/beneficiaries/{id}
        [HttpGet]
        public IHttpActionResult GetBeneficiary(int id)
        {
            var beneficiary = _context.Beneficiaries.SingleOrDefault(c => c.Id == id);

            if (beneficiary == null)
                return NotFound();

            return Ok(Mapper.Map<Beneficiary, BeneficiaryDto>(beneficiary));
        }

        // POST: /api/beneficiaries
        [HttpPost]
        public IHttpActionResult CreateBeneficiary(BeneficiaryDto beneficiaryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var beneficiary = Mapper.Map<BeneficiaryDto, Beneficiary>(beneficiaryDto);

            _context.Beneficiaries.Add(beneficiary);
            _context.SaveChanges();

            beneficiaryDto.Id = beneficiary.Id;

            return Created(new Uri(Request.RequestUri + "/" + beneficiaryDto.Id), beneficiaryDto);
        }

        // GET: /api/beneficiaries/{id}
        [HttpPut]
        public IHttpActionResult UpdateBeneficiary(int id, BeneficiaryDto beneficiaryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var beneficiaryInDb = _context.Beneficiaries.SingleOrDefault(c => c.Id == id);

            if (beneficiaryInDb == null)
                return NotFound();

            Mapper.Map(beneficiaryDto, beneficiaryInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        //DELETE /api/beneficiaries/{id}
        [HttpDelete]
        public IHttpActionResult DeleteBeneficiary(int id)
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
