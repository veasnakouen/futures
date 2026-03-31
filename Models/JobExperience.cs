using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class JobExperience
    {
        public int Id { get; set; }

        public int ClientId { get; set; }

        public int JobPositionId { get; set; }

        public JobPosition JobPositions { get; set; }

        [StringLength(255)]
        public string Employer { get; set; }
        
        public int JobCategoryId { get; set; }

        public JobCategory JobCategories { get; set; }

        [StringLength(255)]
        public string Duration { get; set; }

        [StringLength(255)]
        public string Salary { get; set; }
        public string Description { get; set; }
    }
}