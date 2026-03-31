using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class MonitoringDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string MonitoringTime { get; set; }
        [Required]
        [StringLength(255)]
        public string Enroll { get; set; }
        [StringLength(255)]
        public string Type { get; set; }
        [Required]
        public int ClientId { get; set; }
        public Client Client { get; set; }
        [Required]
        public DateTime MonitoringDate { get; set; }
        [Required]
        public DateTime NextMonitoringDate { get; set; }
        [Required]
        [StringLength(255)]
        public string Monitoringtype { get; set; }
        public int? PlacementId { get; set; }
    }
}