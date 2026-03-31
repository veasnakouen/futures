using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class BusinessSetUpDto
    {
        public int Id { get; set; }
        [Required]
        public int ClientId { get; set; }
        public Client Client { get; set; }
        [Required]
        public int BusinessSetUpCategoryId { get; set; }
        public BusinessSetUpCategory BusinessSetUpCategory { get; set; }
        [Required]
        [StringLength(255)]
        public string BusinessType { get; set; }
        [Required]
        [StringLength(255)]
        public string Income { get; set; }
        [Required]
        [StringLength(255)]
        public string Expense { get; set; }
        [Required]
        [StringLength(255)]
        public string CountTime { get; set; }
        public string JobPlaceBy { get; set; }
        public DateTime? StartBusinessSetUpDate { get; set; }
    }
}