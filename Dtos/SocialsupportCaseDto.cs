using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class SocialsupportCaseDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(10)]
        public string HaveCaseManager { get; set; }
        [Required]
        public int CaseWorkerId { get; set; }
        public CaseWorker CaseWorker { get; set; }
        public DateTime? OpenDate { get; set; }
        public DateTime? CloseDate { get; set; }
        [Required]
        [StringLength(10)]
        public string HaveProblem { get; set; }
        [Required]
        public int ClientId { get; set; }
        public Client Client { get; set; }
        [Required]
        public string Status { get; set; }
        public string AccessBy { get; set; }
        public DateTime? AccessDate { get; set; }
    }
}