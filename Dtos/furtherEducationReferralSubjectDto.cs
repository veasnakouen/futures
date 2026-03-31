using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class furtherEducationReferralSubjectDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(255)]
        public string Subject { get; set; }
    }
}