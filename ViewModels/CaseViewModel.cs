using MtpApp.Models;
using System.Collections.Generic;

namespace MtpApp.ViewModels
{
    public class CaseViewModel
    {
        public IEnumerable<Client> Clients { get; set; }
        public IEnumerable<CaseWorker> CaseWorkers { get; set; }
        public IEnumerable<Subject> Subjects { get; set; }
    }
}