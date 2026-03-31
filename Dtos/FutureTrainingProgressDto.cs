using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class FutureTrainingProgressDto
    {
        public int Id { get; set; }
        [Required]
        public int MonitoringId { get; set; }
        public Monitoring Monitoring { get; set; }
        [Required]
        public int LessionId { get; set; }
        public Lession Lession { get; set; }
        [Required]
        [StringLength(50)]
        public String Ontraining { get; set; }
        public DateTime? GraduateDate { get; set; }
        public DateTime? DropoutDate { get; set; }

        [StringLength(250)]
        public string Reason { get; set; }
    }
}