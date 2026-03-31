using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MtpApp.Dtos;
using MtpApp.Models;
using AutoMapper;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class LanguagesController : ApiController
    {
        private ApplicationDbContext _context;
        public LanguagesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: /api/languages?clientId={id}
        [HttpGet]
        public IHttpActionResult GetLanguages(int clientId)
        {
            var languages = _context.Languages.Select(Mapper.Map<Language, LanguageDto>).Where(c => c.ClientId == clientId);

            return Ok(languages);
        }

        // GET: /api/languages/{id}
        [HttpGet]
        public IHttpActionResult GetLanguage(int id)
        {
            var language = _context.Languages.SingleOrDefault(c => c.Id == id);

            if (language == null)
                return NotFound();

            return Ok(Mapper.Map<Language, LanguageDto>(language));
        }

        // POST: /api/languages
        [HttpPost]
        public IHttpActionResult CreateLanguage(LanguageDto languageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var language = Mapper.Map<LanguageDto, Language>(languageDto);

            _context.Languages.Add(language);
            _context.SaveChanges();

            languageDto.Id = language.Id;

            return Created(new Uri(Request.RequestUri + "/" + languageDto.Id), languageDto);
        }

        // PUT: /api/languages/{id}
        [HttpPut]
        public IHttpActionResult UpdateLanguage(int id, LanguageDto languageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var languageInDb = _context.Languages.SingleOrDefault(c => c.Id == id);

            if (languageInDb == null)
                return NotFound();

            Mapper.Map(languageDto, languageInDb);

            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE: /api/languages/{id}
        [HttpDelete]
        public IHttpActionResult DeleteLanguage(int id)
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
