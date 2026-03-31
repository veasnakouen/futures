using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MtpApp.Models;
using MtpApp.Dtos;

namespace MtpApp.ViewModels
{
    public class EmployeeViewModel
    {
        public EmployeeDto EmployeeDto { get; set; }
        public IEnumerable<Position> Positions { get; set; }
        public IEnumerable<Department> Departments { get; set; }
    }
}