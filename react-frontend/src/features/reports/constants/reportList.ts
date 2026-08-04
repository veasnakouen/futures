export interface ReportItem {
  key: string;
  label: string;
}

export const REPORT_LIST: ReportItem[] = [
  {
    key: "EmployeeEvaluationReport",
    label: "Employee Evaluation (Salary Increase)",
  },
  { key: "ClientSummaryReport", label: "Client Summary Report" },
  { key: "AttendanceReport", label: "Attendance Summary" },
  { key: "EmployeeSeekerListreport", label: "Employee Seeker List" },
  { key: "PlacementSummaryReport", label: "Placement Summary" },
  { key: "EmployersReport", label: "Employers" },
  { key: "JobVancancyAvailable", label: "Job Vacancies Available" },
  { key: "BeneficiariesReport", label: "Beneficiaries Report" },
  { key: "Businesssetupmonitoiring", label: "Business Monitoring" },
  { key: "BusinessSetUpReport", label: "Business Set Up" },
  { key: "ClientLookforbussinesssSetupReport", label: "Business Setup Search" },
  { key: "ClientReferralFromMTProgramReport", label: "Client Referrals" },
  { key: "ClientsRemainingInPlacementReport", label: "Remaining in Placement" },
  { key: "CurriculumVitaeByClientReport", label: "Curriculum Vitae (CV)" },
  {
    key: "FurtherEuducationseekerListReport",
    label: "Further Education Seekers",
  },
  { key: "JobReadinessReport", label: "Job Readiness" },
  { key: "LogBookReport", label: "Log Book" },
  { key: "PlacementMonitoringAndDropoutReport", label: "Monitoring & Dropout" },
  { key: "SocialSupportCaseReport", label: "Social Support Case" },
  { key: "VtcStudentlReport", label: "VTC Students" },
];
