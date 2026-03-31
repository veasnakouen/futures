using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class BusinessSetUpCategory
    {
        public int Id { get; set; }
        [Required]
        [StringLength(255)]
        public string BusCategoryName { get; set; }
        public string IsDeleted { get; set; }

    }
}