using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class VacancyDto
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Posting Date")]
        public DateTime PostingDate { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        [Required]
        [Display(Name = "Employer")]
        public int EmployerId { get; set; }
        public Employer Employers { get; set; }

        [Required]
        [Display(Name = "Job Position")]
        public int JobPositionId { get; set; }
        public JobPosition JobPositions { get; set; }

        [Required]
        [Display(Name = "Job Category")]
        public int JobCategoryId { get; set; }
        public JobCategory JobCategories { get; set; }

        [Required]
        [Display(Name = "Position Available")]
        public int PositionAvailable { get; set; }

        [Display(Name = "Contract Type")]
        [StringLength(255)]
        public string ContractType { get; set; }

        [StringLength(255)]
        public string Schedule { get; set; }

        [Required]
        public double Salary{ get; set; }

        [Required]
        public double Salarymax { get; set; }

        [StringLength(510)]
        public string Location { get; set; }

        public string Responsibilities { get; set; }

        public string Requirement { get; set; }

        public string ApplicationInformation { get; set; }

        [Required]
        public string Status { get; set; }

        public int ViewCount { get; set; }

        [StringLength(255)]
        public string Branch { get; set; }

        public VacancyDto()
        {
            ViewCount = ViewCount + 1;
        }
    }
}