using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class BusinessInProgress
    {
        public int Id { get; set; }
        [Required]
        public int MonitoringId { get; set; }
        public Monitoring Monitoring { get; set; }
        [Required]
        public int BusinessSetUpCategoryId { get; set; }
        public BusinessSetUpCategory BusinessSetUpCategory { get; set; }
         [Required]
        public String StillInbusiness { get; set; }
         [Required]
         [StringLength(50)]
        public string BusinessType { get; set; }
         [Required]
         [StringLength(50)]
        public string Expense { get; set; }
         [Required]
         [StringLength(50)]
        public string Income { get; set; }
         [StringLength(255)]
        public string Note { get; set; }
    }
}