using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class SocialSupportProblemDto
    {
        public int Id { get; set; }
        [Required]
        public int SocialSupportCaseId { get; set; }
        public SocialsupportCase socialsupportCases { get; set; }
        public bool HealthProblembool { get; set; }
        public bool DrugProblembool { get; set; }
        public bool BabyProblembool { get; set; }
        public bool PersonalProblembool { get; set; }
        public bool LegalProblembool { get; set; }
        public bool OtherProblembool { get; set; }
        [StringLength(510)]
        public String Note { get; set; }
        public String Status { get; set; }
    }
}