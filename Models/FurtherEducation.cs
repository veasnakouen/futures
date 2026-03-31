using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class FurtherEducation
    {
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }

        public bool University { get; set; }

        public bool PublicSchool { get; set; }

        public bool VocationalTraining { get; set; }

        public bool ComputerSchool { get; set; }

        public bool EnglishSchool { get; set; }

        public bool ChineseSchool { get; set; }
        
        [StringLength(255)]
        public string AvailableTime { get; set; }
    }
}