using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class Position
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Job Position")]
        [StringLength(255)]
        public string Name { get; set; }
    }
}