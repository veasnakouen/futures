using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MtpApp.ViewModels
{
    public class FuturesTrainingViewModel
    {
       
        public IEnumerable<FuturesTraining> FuturesTrainings { get; set; }

        public IEnumerable<Subject> Subjects { get; set; }

    }
}