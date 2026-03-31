using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class SocialSupport
    {
        public int Id { get; set; }
        [Required]
        public int ClientId { get; set; }
        public Client Client { get; set; }
        [Required]
        public int CaseId { get; set; }
        public Case Cases { get; set; }
        public bool HealthProblembool { get; set; }
        [StringLength(255)]
        public String HealthProblem { get; set; }
        public bool DrugProblembool { get; set; }
        [StringLength(255)]
        public String DrugProblem { get; set; }
        public bool BabyProblembool { get; set; }
        [StringLength(255)]
        public String BabyProblem { get; set; }
        public bool PersonalProblembool { get; set; }
        [StringLength(255)]
        public String PersonalProblem { get; set; }
        public bool LegalProblembool { get; set; }
        [StringLength(255)]
        public String LegalProblem { get; set; }
        public bool OtherProblembool { get; set; }
        [StringLength(510)]
        public String OtherProblem { get; set; }
    }
}