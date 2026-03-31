using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class SubjectDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(255)]
        public string SubjectName { get; set; }
    }
}