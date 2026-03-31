using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using MtpApp.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace MtpApp.Models
{
    public class PlacementProgress
    {
        public int Id { get; set; }
        [Required]
        public string Completed { get; set; }
        [ForeignKey("Monitoring")]
        public int MonitoringId { get; set; }
        public Monitoring Monitoring { get; set; }
        [Required]
        public string PlacementStatus { get; set; }
        [Required]
        public string Salary { get; set; }
        public string Note { get; set; }     
    }
}