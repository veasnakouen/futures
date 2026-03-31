using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MtpApp.Dtos;

namespace MtpApp.Models
{
    public class businessInProgressMonitorIngMulObj
    {
        public BusinessInProgressDto businessInProgressDto { get; set; }
        public MonitoringDto monitoringDto { get; set; }
    }
}