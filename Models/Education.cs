using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class Education
    {
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }

        [Required]
        [StringLength(255)]
        public string Level { get; set; }

        [StringLength(255)]
        public string Grade { get; set; }

        [StringLength(255)]
        public string Subject { get; set; }

        [StringLength(255)]
        public string Year { get; set; }

        [StringLength(255)]
        public string SchoolName { get; set; }
        public string Description { get; set; }
    }
}