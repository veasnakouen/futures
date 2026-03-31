using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class Client
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Branch { get; set; }

        [Required]
        [StringLength(255)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(255)]
        public string LastName { get; set; }

        [StringLength(6)]
        public string Gender { get; set; }

        [Display(Name = "Date of birth")]
        public DateTime? DateOfBirth { get; set; }

        [StringLength(255)]
        [Display(Name = "Contact Phone")]
        public string ContactPhone { get; set; }

        [StringLength(255)]
        [Display(Name = "Relative Phone")]
        public string RelativePhone { get; set; }

        [StringLength(10)]
        [Display(Name = "Marital Status")]
        public string MaritalStatus { get; set; }

        [StringLength(255)]
        public string Email { get; set; }

        [StringLength(255)]
        public string Address { get; set; }

        [StringLength(255)]
        public string Province { get; set; }

        [StringLength(255)]
        public string Photo { get; set; }

        [StringLength(255)]
        public string IdCard { get; set; }

        [StringLength(255)]
        [Display(Name = "Current Situation")]
        public string CurrentSituation { get; set; }

        [Display(Name = "Further Education")]
        public bool FurtherEducation { get; set; }

        [Display(Name = "Placement")]
        public bool Placement { get; set; }

        [Display(Name = "Training From Futures")]
        public bool TrainingFromFutures { get; set; }

        [Display(Name = "Social Support Required")]
        public bool SocialSupportRequired { get; set; }

        [StringLength(255)]
        [Display(Name = "Where did you hear about us?")]
        public string HearBy { get; set; }
        [StringLength(255)]
        public string ExpectedSupport { get; set; }
        [Required]
        public string AspUserId { get; set; }

        [Required]
        [StringLength(50)]
        public string ClientCode { get; set; }

        public DateTime? RegisterDate { get; set; }
        public DateTime? RegisterDateNd { get; set; }
        public DateTime? RegisterDateRd { get; set; }

        public DateTime? EnrollDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string PlaceOfBirth { get; set; }
        public string Nationality { get; set; }
        public string Citizenship { get; set; }
        public string Height { get; set; }
        public string Weight { get; set; }
        public string UpdateBy { get; set; }
        public string SocialSupportProblem { get; set; }
        [StringLength(50)]
        public string IdpoorStatus { get; set; }
        public DateTime? IdpoorValiddate { get; set; }
        public string IdpoorLevel { get; set; }
        [StringLength(255)]
        public string IdpoorAccountNumber { get; set; }
        [StringLength(255)]
        public string Status { get; set; }
    }
}