using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MtpApp.ViewModels
{
    public class CaseViewModel
    {
        public IEnumerable<Client> Clients { get; set; }

        public IEnumerable<CaseWorker> CaseWorkers { get; set; }

        public IEnumerable<Subject> Subjects { get; set; }
    }
}