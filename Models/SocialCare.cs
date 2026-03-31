using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class SocialCare
    {
        public int Id { get; set; }
        [Required]
        public int ClientId { get; set; }
        public bool SocialSupportNeeded { get; set; }
        public bool MeetingFuture { get; set; }
        public bool Problem { get; set; }
    }
}