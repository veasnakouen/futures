using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MtpApp.ViewModels
{
    public class JobsViewModel
    {
        public IEnumerable<JobsByCategoryViewModel> JobsByCategory { get; set; }

        public IEnumerable<JobsByEmployerViewModel> JobsByEmployer { get; set; }
    }
}