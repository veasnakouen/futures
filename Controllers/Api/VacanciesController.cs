using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Linq;
using System.Security.Claims;

namespace MtpApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VacanciesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public VacanciesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpGet]
        public IActionResult GetVacancies([FromQuery] string employerId)
        {
            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            if (employerId == "all")
            {
                var vacancies = _context.Vacancies
                    .Include(c => c.JobPositions)
                    .Include(c => c.JobCategories)
                    .Include(c => c.Employers)
                    .Where(c => c.Branch == user.Branch && c.Deadline >= DateTime.Today.Date)
                    .ToList()
                    .Select(v => _mapper.Map<Vacancy, VacancyDto>(v));
                return Ok(vacancies);
            }
            else if (employerId == "over")
            {
                var vacancies = _context.Vacancies
                    .Include(c => c.JobPositions)
                    .Include(c => c.JobCategories)
                    .Include(c => c.Employers)
                    .Where(c => c.Branch == user.Branch && c.Deadline < DateTime.Today.Date)
                    .ToList()
                    .Select(v => _mapper.Map<Vacancy, VacancyDto>(v));
                return Ok(vacancies);
            }
            else
            {
                var vacancies = _context.Vacancies
                    .Include(c => c.JobPositions)
                    .Include(c => c.JobCategories)
                    .Include(c => c.Employers)
                    .Where(c => c.Branch == user.Branch && c.EmployerId == int.Parse(employerId) && c.Deadline >= DateTime.Today.Date)
                    .ToList()
                    .Select(v => _mapper.Map<Vacancy, VacancyDto>(v));
                return Ok(vacancies);
            }
        }

        [HttpGet("byemployer")]
        public IActionResult GetVacanciesByEmployer([FromQuery] string employerName)
        {
            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            var vacancies = _context.Vacancies
                .Include(c => c.JobPositions)
                .Include(c => c.JobCategories)
                .Include(c => c.Employers)
                .Where(c => c.Branch == user.Branch && c.Deadline >= DateTime.Today.Date && c.Employers.Name == employerName)
                .ToList()
                .Select(v => _mapper.Map<Vacancy, VacancyDto>(v));
            return Ok(vacancies);
        }

        [HttpGet("{id}")]
        public IActionResult GetVacancy(int id)
        {
            var vacancy = _context.Vacancies
                .Include(c => c.JobPositions)
                .Include(c => c.JobCategories)
                .Include(c => c.Employers)
                .SingleOrDefault(c => c.Id == id && c.Deadline >= DateTime.Today.Date);

            if (vacancy == null)
                return NotFound();

            return Ok(_mapper.Map<Vacancy, VacancyDto>(vacancy));
        }

        [HttpGet("overdeadline/{jobId}")]
        public IActionResult GetVacancyOverDeadline(int jobId)
        {
            var vacancy = _context.Vacancies
                .Include(c => c.JobPositions)
                .Include(c => c.JobCategories)
                .Include(c => c.Employers)
                .SingleOrDefault(c => c.Id == jobId && c.Deadline < DateTime.Today.Date);

            if (vacancy == null)
                return NotFound();

            return Ok(_mapper.Map<Vacancy, VacancyDto>(vacancy));
        }

        [HttpGet("bycategory")]
        public IActionResult GetVacancyByJobCategory([FromQuery] string job)
        {
            var vacancy = _context.Vacancies
                .Include(c => c.JobPositions)
                .Include(c => c.JobCategories)
                .Include(c => c.Employers)
                .Where(c => c.JobCategories.Name == job && c.Deadline >= DateTime.Today.Date)
                .ToList()
                .Select(v => _mapper.Map<Vacancy, VacancyDto>(v));

            return Ok(vacancy);
        }

        [HttpGet("bysalary")]
        public IActionResult GetVacanciesBySalary([FromQuery] int start, [FromQuery] int end)
        {
            var vacancy = _context.Vacancies
                .Include(c => c.JobPositions)
                .Include(c => c.JobCategories)
                .Include(c => c.Employers)
                .Where(c => c.Salary >= start && c.Salary <= end)
                .ToList()
                .Select(v => _mapper.Map<Vacancy, VacancyDto>(v));

            return Ok(vacancy);
        }

        [HttpPost]
        public IActionResult CreateVacancy([FromBody] VacancyDto vacancyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            vacancyDto.Branch = user.Branch;

            var vacancy = _mapper.Map<VacancyDto, Vacancy>(vacancyDto);

            _context.Vacancies.Add(vacancy);
            _context.SaveChanges();

            vacancyDto.Id = vacancy.Id;

            return CreatedAtAction(nameof(GetVacancy), new { id = vacancyDto.Id }, vacancyDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateVacancy(int id, [FromBody] VacancyDto vacancyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var vacancyInDb = _context.Vacancies.SingleOrDefault(c => c.Id == id);

            if (vacancyInDb == null)
                return NotFound();

            var userId = GetUserId();
            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            vacancyDto.Branch = user.Branch;

            _mapper.Map(vacancyDto, vacancyInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteVacancy(int id)
        {
            var vacancyInDb = _context.Vacancies.SingleOrDefault(c => c.Id == id);

            if (vacancyInDb == null)
                return NotFound();

            _context.Vacancies.Remove(vacancyInDb);
            _context.SaveChanges();

            return Ok(new { });
        }
    }
}

