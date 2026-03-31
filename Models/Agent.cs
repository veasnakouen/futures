using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class Agent
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Agent name")]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Agent Photo")]
        [StringLength(510)]
        public string Photo { get; set; }
    }
}