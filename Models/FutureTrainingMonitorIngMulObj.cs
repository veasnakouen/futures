using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MtpApp.Dtos;

namespace MtpApp.Models
{
    public class FutureTrainingMonitorIngMulObj
    {
        public FutureTrainingProgressDto futureTrainingProgressDto { get; set; }
        public MonitoringDto monitoringDto { get; set; }
    }
}