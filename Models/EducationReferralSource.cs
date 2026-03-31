using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class EducationReferralSource
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Referral Source")]
        public string ReferralSource { get; set; }

        [Required]
        [Display(Name = "Internal/External")]
        public string Status { get; set; }
    }
}