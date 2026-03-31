using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MtpApp.Dtos;
using MtpApp.Models;

namespace MtpApp.ViewModels
{
    public class VacancyViewModel
    {
        public VacancyDto VacancyDto { get; set; }

        public IEnumerable<Employer> Employers { get; set; }

        public IEnumerable<JobPosition> JobPositions { get; set; }

        public IEnumerable<JobCategory> JobCategories { get; set; }
    }
}