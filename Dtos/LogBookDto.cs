using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class LogBookDto
    {
        public int Id { get; set; }
        [StringLength(6)]
        public string Gender { get; set; }
        [StringLength(50)]
        public string Phone { get; set; }
         [StringLength(256)]
        public string Note { get; set; }
        public bool Jobinformation { get; set; }
        public bool Library { get; set; }
        public bool UsingComputer { get; set; }
        public bool FutureService { get; set; }
        public bool  InterviewTechic { get; set; }
        public bool ShortTraining { get; set; }
        public string User { get; set; }
        public DateTime? EnrollDate { get; set; }
    }
}