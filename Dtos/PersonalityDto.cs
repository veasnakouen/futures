using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class PersonalityDto
    {
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }

        [StringLength(510)]
        public string Strength { get; set; }

        [StringLength(510)]
        public string Weakness { get; set; }
    }
}