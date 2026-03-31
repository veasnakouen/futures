using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class CaseWorker
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }


        [Required]
        [StringLength(255)]
        public string Program { get; set; }

        [Required]
        [StringLength(10)]
        public string Status { get; set; }
    }
}