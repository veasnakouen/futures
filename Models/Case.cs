using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class Case
    {
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }

        public Client Client { get; set; }

        [Required]
        public int CaseWorkerId { get; set; }

        public CaseWorker CaseWorker { get; set; }

        [Required]
        [StringLength(50)]
        public string Priority { get; set; }

        [Required]
        [StringLength(50)]
        public string ServiceType { get; set; }

        [StringLength(255)]
        public string Subject { get; set; }

        [StringLength(510)]
        public string Description { get; set; }

        [Required]
        public DateTime OpenDate { get; set; }

        public DateTime? CloseDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; }
    }
}