using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MtpApp.Dtos
{
    public class EmployeeDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        [Display(Name = "Employee ID")]
        public string IdNo { get; set; }

        [Required]
        [StringLength(5)]
        [Display(Name = "Title")]
        public string Title { get; set; }

        [Required]
        [StringLength(255)]
        [Display(Name = "First Name (English)")]
        public string FirstNameEnglish { get; set; }

        [Required]
        [StringLength(255)]
        [Display(Name = "Last Name (English)")]
        public string LastNameEnglish { get; set; }

        [StringLength(255)]
        [Display(Name = "First Name (Khmer)")]
        public string FirstNameKhmer { get; set; }

        [StringLength(255)]
        [Display(Name = "First Name (Khmer)")]
        public string LastNameKhmer { get; set; }

        [StringLength(6)]
        public string Gender { get; set; }

        [Display(Name = "Date of birth")]
        public DateTime? DateOfBirth { get; set; }

        [StringLength(255)]
        [Display(Name = "Place of birth")]
        public string PlaceOfBirth { get; set; }

        [StringLength(255)]
        [Display(Name = "Address")]
        public string Address { get; set; }

        [StringLength(255)]
        public string Country { get; set; }

        [StringLength(255)]
        public string Nationality { get; set; }

        [StringLength(255)]
        public string Email { get; set; }

        [StringLength(255)]
        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; }

        [StringLength(255)]
        [Display(Name = "Blood Group")]
        public string BloodGroup { get; set; }

        [StringLength(255)]
        [Display(Name = "Bank Account Number")]
        public string BankAccountNumber { get; set; }

        [StringLength(255)]
        [Display(Name = "Bank Account")]
        public string BankAccount { get; set; }

        [Display(Name = "Contract Date")]
        public DateTime? ContractDate { get; set; }

        [StringLength(255)]
        [Display(Name = "Contract Type")]
        public string ContractType { get; set; }

        [Display(Name = "Contract Start Date")]
        public DateTime? ContractStartDate { get; set; }

        [Display(Name = "Contract End Date")]
        public DateTime? ContractEndDate { get; set; }

        [StringLength(255)]
        public string Manager { get; set; }

        [StringLength(255)]
        [Display(Name = "Marital Status")]
        public string MaritalStatus { get; set; }

        [StringLength(255)]
        public string Children { get; set; }

        [StringLength(255)]
        [Display(Name = "Emergency Contact")]
        public string EmergencyContact { get; set; }

        [StringLength(255)]
        [Display(Name = "Emergency Contact Name")]
        public string EmergencyContactName { get; set; }

        [StringLength(255)]
        [Display(Name = "Emergency Contact Phone")]
        public string EmergencyContactPhone { get; set; }

        [StringLength(255)]
        [Display(Name = "Identity Card Number")]
        public string IdentityCardNumber { get; set; }

        [StringLength(255)]
        [Display(Name = "Identity Card Type")]
        public string IdentityCardType { get; set; }

        [StringLength(255)]
        public string Note { get; set; }

        [StringLength(255)]
        public string Photo { get; set; }

        [StringLength(255)]
        public string Status { get; set; }

        [Required]
        [Display(Name = "Position")]
        public int PositionId { get; set; }

        public Position Position { get; set; }

        [Required]
        [Display(Name = "Position")]
        public int DepartmentId { get; set; }

        public Department Department { get; set; }
    }
}