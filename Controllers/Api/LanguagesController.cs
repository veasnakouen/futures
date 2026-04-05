using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public class LanguagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public LanguagesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /api/languages?clientId={id}
        [HttpGet]
        public IActionResult GetLanguages([FromQuery] int clientId)
        {
            var languages = _context.Languages
                .Where(c => c.ClientId == clientId)
                .ToList()
                .Select(_mapper.Map<Language, LanguageDto>);

            return Ok(languages);
        }

        // GET: /api/languages/{id}
        [HttpGet("{id}")]
        public IActionResult GetLanguage([FromRoute] int id)
        {
            var language = _context.Languages.SingleOrDefault(c => c.Id == id);

            if (language == null)
                return NotFound();

            return Ok(_mapper.Map<Language, LanguageDto>(language));
        }

        // POST: /api/languages
        [HttpPost]
        public IActionResult CreateLanguage(LanguageDto languageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var language = _mapper.Map<LanguageDto, Language>(languageDto);

            _context.Languages.Add(language);
            _context.SaveChanges();

            languageDto.Id = language.Id;

            return CreatedAtAction(nameof(GetLanguage), new { id = languageDto.Id }, languageDto);
        }

        // PUT: /api/languages/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateLanguage([FromRoute] int id, [FromBody] LanguageDto languageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var languageInDb = _context.Languages.SingleOrDefault(c => c.Id == id);

            if (languageInDb == null)
                return NotFound();

            _mapper.Map(languageDto, languageInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/languages/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteLanguage([FromRoute] int id)
        {
            var languageInDb = _context.Languages.SingleOrDefault(c => c.Id == id);

            if (languageInDb == null)
                return NotFound();
                
            _context.Languages.Remove(languageInDb);
            _context.SaveChanges();

            return Ok();
        }
    }
}

