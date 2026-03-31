using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class Employer
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        [Display(Name = "Company Name")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Sector")]
        public int JobCategoryId { get; set; }

        public JobCategory JobCategory { get; set; }

        [StringLength(510)]
        public string Address { get; set; }

        [Required]
        [StringLength(255)]
        [Display(Name = "Contact Person ")]
        public string ContactPerson { get; set; }

        [StringLength(255)]
        [Display(Name = "Contact Phone")]
        public string ContactPhone { get; set; }    

        [StringLength(255)]
        public string Email { get; set; }

        [StringLength(255)]
        public string Website { get; set; }

        [StringLength(510)]
        public string Note { get; set; }

        [StringLength(255)]
        public string Branch { get; set; }

        public DateTime CorporateDate { get; set; }

        public string Status { get; set; }
    }
}