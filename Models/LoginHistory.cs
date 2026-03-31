using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class LoginHistory
    {
        public int Id { get; set; }

        public string LoggedBy { get; set; }

        public DateTime? LoggedDate { get; set; }

        public string IPAddress { get; set; }

        public string HostName { get; set; }
    }
}