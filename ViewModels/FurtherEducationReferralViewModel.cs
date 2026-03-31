using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MtpApp.Dtos;
using MtpApp.Models;

namespace MtpApp.ViewModels
{
    public class FurtherEducationReferralViewModel
    {
        public FurtherEducationReferralDto FurtherEducationReferralDto { get; set; }

        public IEnumerable<EducationReferralSource> EducationReferralSource { get; set; }
    }
}