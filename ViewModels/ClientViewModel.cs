using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MtpApp.Dtos;
using MtpApp.Models;

namespace MtpApp.ViewModels
{
    public class ClientViewModel
    {
        public IEnumerable<Client> Clients { get; set; }

        public IEnumerable<EducationReferralSource> EducationReferralSources { get; set; }

        public IEnumerable<JobCategory> JobCategories { get; set; }

        public IEnumerable<JobPosition> JobPositions { get; set; }
        public IEnumerable<BusinessSetUpCategory> BusinessSetUpCategories { get; set; }
        public IEnumerable<CaseWorker> CaseWorkers { get; set; }
        public IEnumerable<Case> Cases { get; set; }
        public IEnumerable<Subject> Subjects { get; set; }
    }
}