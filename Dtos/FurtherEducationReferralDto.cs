using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class FurtherEducationReferralDto
    {
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }
        public Client Clients { get; set; }

        [Display(Name = "Referral Date")]
        public DateTime? ReferralDate { get; set; }

        [Required]
        public int furtherEducationReferralSubjectId { get; set; }
        public furtherEducationReferralSubject furtherEducationReferralSubject { get; set; }

        public string Provider { get; set; }

        public string Duration { get; set; }

        [Display(Name = "Referral By")]
        public string ReferralBy { get; set; }

        [Required]
        [Display(Name = "Referral To")]
        public int EducationReferralSourceId { get; set; }

        public EducationReferralSource EducationReferralSource { get; set; }

        [Required]
        public string clientType { get; set; }
    }
}