using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class JobCategory
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        [Display(Name = "Job Category")]
        public string Name { get; set; }
    }
}