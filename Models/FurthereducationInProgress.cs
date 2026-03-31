using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class FurthereducationInProgress
    {
        public int Id { get; set; }
        [Required]
        public int MonitoringId { get; set; }
        public Monitoring Monitoring { get; set; }
        [Required]
        [StringLength(50)]
        public String Ontraining { get; set; }
        public DateTime? GraduateDate { get; set; }
        public DateTime? DropoutDate { get; set; }
        [Required]
        [StringLength(250)]
        public string Reason { get; set; }
    }
}