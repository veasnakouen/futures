using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MtpApp.Models;
using MtpApp.Dtos;

namespace MtpApp.ViewModels
{
    public class EmployerViewModel
    {
        public EmployerDto EmployerDto { get; set; }

        public IEnumerable<JobCategory> JobCategories { get; set; }
    }
}