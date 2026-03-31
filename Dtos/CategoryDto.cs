using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class CategoryDto
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Category")]
        [StringLength(255)]
        public string Name { get; set; }
    }
}