using System;
using System.ComponentModel.DataAnnotations;

namespace MtpApp.Dtos
{
    public class JobPositionDto
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Job Position")]
        [StringLength(255)]
        public string Name { get; set; }

        public int? JobCategoryId { get; set; }
        public JobCategoryDto JobCategory { get; set; }

        public bool IsDeleted { get; set; }

        public JobPositionDto()
        {
            IsDeleted = false;
        }
    }
}