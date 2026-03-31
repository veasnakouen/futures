using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Models
{
    public class Placement
    {
        public int Id { get; set; }

        [Required]
        public string CountedTime { get; set; }

        [Required]
        public int ClientId { get; set; }

        public Client Clients { get; set; }

        [Required]
        public DateTime PlacementDate { get; set; }

        [Required]
        [StringLength(255)]
        public string PlacementType { get; set; }

        [Required]
        public int JobPositionId { get; set; }

        public JobPosition JobPosition { get; set; }

        [Required]
        [StringLength(255)]
        public string CompanyName { get; set; }

        [StringLength(255)]
        public string CompanyContactName { get; set; }

        [StringLength(255)]
        public string CompanyContactPhone { get; set; }

        [StringLength(255)]
        public string CompanyContactEmail { get; set; }

        [StringLength(255)]
        public string CompanyAddress { get; set; }

        [Required]
        [StringLength(255)]
        public string JobPlacedBy { get; set; }

        [StringLength(255)]
        public string Salary { get; set; }

        [StringLength(255)]
        public string Tips { get; set; }

        [StringLength(255)]
        public string TotalIncome { get; set; }

        [StringLength(255)]
        public string WorkTime { get; set; }

        [StringLength(255)]
        public string DayOff { get; set; }

        [StringLength(255)]
        public string NumberOfAnnualLeave { get; set; }

        public bool Health { get; set; }

        public bool Meal { get; set; }

        public bool Transport { get; set; }

        public bool Bonus { get; set; }

        public bool PublicHoliday { get; set; }

        public bool AccidentInsurance { get; set; }

        public bool Accommodation { get; set; }

        public bool Overtime { get; set; }

        public bool ThirteenMonthsSalary { get; set; }

        public bool AnnualLeave { get; set; }
        [StringLength(20)]
        public string Status { get; set; }
        public DateTime? DropfromDate { get; set; }
    }
}