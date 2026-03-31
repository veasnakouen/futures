using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using AutoMapper;
using MtpApp.Dtos;
using MtpApp.ViewModels;

namespace MtpApp.Controllers.Api
{
    [Authorize]
    public class VacanciesController : ApiController
    {
        private ApplicationDbContext _context;
        public VacanciesController()
        {
            _context = new ApplicationDbContext();
        }

        // GET /api/vacancies
        [HttpGet]
        public IHttpActionResult GetVacancies(string employerId)
        {
            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            if (employerId == "all")
            {
                var vacancies = _context.Vacancies
                                    .Include(c => c.JobPositions)
                                    .Include(c => c.JobCategories)
                                    .Include(c => c.Employers)
                                    .Select(Mapper.Map<Vacancy, VacancyDto>)
                                    .Where(c => c.Branch == user.Branch && c.Deadline >= DateTime.Today.Date);
                return Ok(vacancies);
            }
            else if (employerId == "over")
            {
                var vacancies = _context.Vacancies
                                    .Include(c => c.JobPositions)
                                    .Include(c => c.JobCategories)
                                    .Include(c => c.Employers)
                                    .Select(Mapper.Map<Vacancy, VacancyDto>)
                                    .Where(c => c.Branch == user.Branch && c.Deadline < DateTime.Today.Date);
                return Ok(vacancies);
            }
            else
            {
                var vacancies = _context.Vacancies
                                    .Include(c => c.JobPositions)
                                    .Include(c => c.JobCategories)
                                    .Include(c => c.Employers)
                                    .Select(Mapper.Map<Vacancy, VacancyDto>)
                                    .Where(c => c.Branch == user.Branch && c.EmployerId == int.Parse(employerId) && c.Deadline >= DateTime.Today.Date);
                return Ok(vacancies);
            }
        }

        // GET: /api/vacancies?employerName=
        [HttpGet]
        public IHttpActionResult GetVacanciesByEmployer(string employerName)
        {
            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            var vacancies = _context.Vacancies
                                    .Include(c => c.JobPositions)
                                    .Include(c => c.JobCategories)
                                    .Include(c => c.Employers)
                                    .Select(Mapper.Map<Vacancy, VacancyDto>)
                                    .Where(c => c.Branch == user.Branch && c.Deadline >= DateTime.Today.Date && c.Employers.Name == employerName);
            return Ok(vacancies);   
        }

        // GET /api/vacancies
        [HttpGet]
        public IHttpActionResult GetVacancy(int id)
        {
            var vacancy = _context.Vacancies
                            .Include(c => c.JobPositions)
                            .Include(c => c.JobCategories)
                            .Include(c => c.Employers)
                            .SingleOrDefault(c => c.Id == id && c.Deadline >= DateTime.Today.Date);

            if (vacancy == null)
                return NotFound();

            return Ok(Mapper.Map<Vacancy, VacancyDto>(vacancy));
        }

        // GET: /api/vacancies
        [HttpGet]
        public IHttpActionResult GetVacancyOverDeadline(int jobId)
        {
            var vacancy = _context.Vacancies
                            .Include(c => c.JobPositions)
                            .Include(c => c.JobCategories)
                            .Include(c => c.Employers)
                            .SingleOrDefault(c => c.Id == jobId && c.Deadline < DateTime.Today.Date);

            if (vacancy == null)
                return NotFound();

            return Ok(Mapper.Map<Vacancy, VacancyDto>(vacancy));
        }

        // GET: /api/vacancies?job={job}
        [HttpGet]
        public IHttpActionResult GetVacancyByJobCategory(string job)
        {
            var vacancy = _context.Vacancies
                            .Include(c => c.JobPositions)
                            .Include(c => c.JobCategories)
                            .Include(c => c.Employers)
                            .Select(Mapper.Map<Vacancy, VacancyDto>)
                            .Where(c => c.JobCategories.Name == job && c.Deadline >= DateTime.Today.Date);

            return Ok(vacancy);
        }

        //GET: /api/vacancies?start={start}&end={end}
        [HttpGet]
        public IHttpActionResult GetVacanciesBySalary(int start, int end)
        {
            var vacancy = _context.Vacancies
                            .Include(c => c.JobPositions)
                            .Include(c => c.JobCategories)
                            .Include(c => c.Employers)
                            .Select(Mapper.Map<Vacancy, VacancyDto>)
                            .Where(c => c.Salary >= start && c.Salary <= end);

            return Ok(vacancy);
        }

        // POST /api/vacancies
        [HttpPost]
        public IHttpActionResult CreateVacancy(VacancyDto vacancyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            vacancyDto.Branch = user.Branch;

            var vacancy = Mapper.Map<VacancyDto, Vacancy>(vacancyDto);

            _context.Vacancies.Add(vacancy);
            _context.SaveChanges();

            vacancyDto.Id = vacancy.Id;

            return Created(new Uri(Request.RequestUri + "/" + vacancyDto.Id), vacancyDto);
        }

        // PUT /api/vacancies/{id}
        [HttpPut]
        public IHttpActionResult UpdateVacancy(int id, VacancyDto vacancyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var vacancyInDb = _context.Vacancies.SingleOrDefault(c => c.Id == id);

            if (vacancyInDb == null)
                return NotFound();

            var userId = User.Identity.GetUserId();

            var user = _context.Users.SingleOrDefault(c => c.Id == userId);

            vacancyDto.Branch = user.Branch;

            Mapper.Map(vacancyDto, vacancyInDb);
            _context.SaveChanges();

            return Ok(new { });
        }

        // DELETE /api/vacancies/{id}
        [HttpDelete]
        public IHttpActionResult DeleteVacancy(int id)
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
