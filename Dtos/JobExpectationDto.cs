using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class JobExpectationDto
    {
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }

        public int? JobCategoryIdOne { get; set; }

        public int? JobCategoryIdTwo { get; set; }

        public int? JobCategoryIdThree { get; set; }

        public int? JobPositionIdOne { get; set; }

        public int? JobPositionIdTwo { get; set; }

        public int? JobPositionIdThree { get; set; }

        public bool Permanent { get; set; }

        public bool Temporary { get; set; }

        public bool Seasonal { get; set; }

        [StringLength(255)]
        public string EmploymentType { get; set; }

        [StringLength(255)]
        public string AvailableTime { get; set; }

        [StringLength(255)]
        public string SalaryExpectation { get; set; }

        [StringLength(510)]
        public string Note { get; set; }
        public string Candidate { get; set; }
        public string Hobby { get; set; }
        public string SelfEmployment { get; set; }
        public int? BusinessSetUpCategoryId { get; set; }
        public string BusinessType { get; set; }
        [StringLength(50)]
        public string ExpectationStatus { get; set; }
    }
}