using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class CvReference
    {
        public int Id { get; set; }
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        public string Description { get; set; }

        [Required]
        public int ClientId { get; set; }
        public Client Client { get; set; }

        public int JobPositionId { get; set; }

        public JobPosition JobPositions { get; set; }
        public string Organization { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

    }
}