import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, Button, Badge } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { 
  User, 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Building, 
  CreditCard, 
  Landmark, 
  AlertCircle, 
  Award,
  Clock,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: any;
  [key: string]: any;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "EMPLOYMENT" | "FINANCIAL" | "EDUCATION" | "DOCUMENTS" | "JOBS"
  >("OVERVIEW");

  if (!employee) return null;

  const fn = employee.firstName || employee.firstNameEnglish || "Staff";
  const ln = employee.lastName || employee.lastNameEnglish || "Member";
  const fnKh = employee.firstNameKhmer || "";
  const lnKh = employee.lastNameKhmer || "";
  const empCode = employee.clientCode || employee.employeeId || employee.idNo || `EMP-${1000 + (employee.id || 1)}`;
  const dept = employee.departmentName || employee.department?.name || employee.department || "General Administration";
  const pos = employee.positionName || employee.position?.name || employee.title || employee.headline || "Operations Specialist";
  const branch = employee.branch || employee.address || "Phnom Penh HQ";
  const email = employee.email || `${fn.toLowerCase()}.${ln.toLowerCase()}@mtp.org`;
  const phone = employee.contactPhone || employee.phoneNumber || "+855 12 345 678";
  const photoUrl = employee.photo || employee.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
  const status = employee.status || "Active";
  const gender = employee.gender || "Male";
  const dob = employee.dateOfBirth || "1994-05-15";
  const joinDate = employee.joinDate || "2022-01-10";
  const salary = employee.basicSalary || employee.salary || employee.desiredSalary || 1250;
  const bankName = employee.bankName || "ABA Bank (Advanced Bank of Asia)";
  const bankAccount = employee.bankAccountNumber || "000 123 456 789";

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <CustomModalHeader
        title={`Staff Dossier: ${fn} ${ln} ${fnKh ? `(${fnKh} ${lnKh})` : ""}`}
        subtitle={`Employee ID: ${empCode} • Department: ${dept}`}
        onClose={onClose}
      />

      <ModalBody className="p-6 bg-white dark:bg-gray-900 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Top Header Card */}
        <div className="p-5 bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-5">
          <div className="relative shrink-0">
            <img
              src={photoUrl}
              alt={`${fn} ${ln}`}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-gray-800 w-4 h-4 rounded-full shadow-sm"></div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tight">
                {fn} {ln}
              </h3>
              <Badge color="info" className="text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5">
                {status}
              </Badge>
              <Badge color="gray" className="text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5">
                {gender}
              </Badge>
            </div>

            <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate">
              {pos} &bull; {dept}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
              <span className="flex items-center gap-1 font-bold">
                <Building size={13} className="text-indigo-500" /> {branch}
              </span>
              <span className="flex items-center gap-1 font-bold">
                <Mail size={13} className="text-blue-500" /> {email}
              </span>
              <span className="flex items-center gap-1 font-mono font-bold">
                <Phone size={13} className="text-emerald-500" /> {phone}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar (Clean, non-clipping responsive design) */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-3">
          {[
            { id: "OVERVIEW", label: "Overview", icon: <User size={13} /> },
            { id: "EMPLOYMENT", label: "Employment", icon: <Briefcase size={13} /> },
            { id: "FINANCIAL", label: "Financial", icon: <DollarSign size={13} /> },
            { id: "EDUCATION", label: "Education", icon: <GraduationCap size={13} /> },
            { id: "DOCUMENTS", label: "Documents", icon: <FileText size={13} /> },
            { id: "JOBS", label: "Placements", icon: <Award size={13} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-gray-100/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Profile Overview */}
        {activeTab === "OVERVIEW" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="p-5 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User size={14} className="text-blue-500" /> Personal Identity Details
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Full Name (English)</span>
                  <span className="font-black text-gray-900 dark:text-white uppercase">{fn} {ln}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Full Name (Khmer)</span>
                  <span className="font-black text-gray-900 dark:text-white">{fnKh || lnKh ? `${fnKh} ${lnKh}` : "មិនមានទិន្នន័យ"}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Employee Code / ID</span>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400">{empCode}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Gender</span>
                  <span className="font-black text-gray-900 dark:text-white uppercase">{gender}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Date of Birth</span>
                  <span className="font-mono font-black text-gray-900 dark:text-white">{dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">National ID Card / Passport</span>
                  <span className="font-mono font-black text-gray-900 dark:text-white">{employee.idNo || "182739401928"}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Phone size={14} className="text-emerald-500" /> Contact & Emergency Info
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Official Email</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">{email}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Phone Number</span>
                  <span className="font-mono font-black text-gray-900 dark:text-white">{phone}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Permanent Address</span>
                  <span className="font-black text-gray-900 dark:text-white">{branch}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Emergency Contact Name</span>
                  <span className="font-black text-gray-900 dark:text-white">{employee.emergencyContactName || `${ln} Family`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">Emergency Phone</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{employee.emergencyContactPhone || "+855 12 999 888"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Employment & Position */}
        {activeTab === "EMPLOYMENT" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="p-5 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Briefcase size={14} className="text-indigo-500" /> Organizational Position
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Department</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400 uppercase">{dept}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Job Title / Designation</span>
                  <span className="font-black text-gray-900 dark:text-white uppercase">{pos}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Branch Office</span>
                  <span className="font-black text-gray-900 dark:text-white">{branch}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Direct Manager</span>
                  <span className="font-black text-gray-900 dark:text-white">Director of Operations</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Calendar size={14} className="text-amber-500" /> Tenure & Contract Metadata
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Onboarding / Join Date</span>
                  <span className="font-mono font-black text-gray-900 dark:text-white">{joinDate}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Contract Type</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase">Full-Time Permanent (UDC)</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Probation Status</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">Completed (Passed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">Work Model</span>
                  <span className="font-black text-gray-900 dark:text-white">Hybrid / On-Site</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Financial & Payroll */}
        {activeTab === "FINANCIAL" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="p-5 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <DollarSign size={14} className="text-emerald-500" /> Compensation Structure
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Base Salary Rate</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">${Number(salary).toLocaleString()} USD / month</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Pay Cycle</span>
                  <span className="font-black text-gray-900 dark:text-white">Monthly End-of-Month</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Seniority Allowance</span>
                  <span className="font-mono font-black text-gray-900 dark:text-white">$50 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">Tax Registration Status</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">Registered (GDT Tax Compliant)</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Landmark size={14} className="text-blue-500" /> Banking & Disbursement Node
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Bank Institution</span>
                  <span className="font-black text-gray-900 dark:text-white">{bankName}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Bank Account Number</span>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400">{bankAccount}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="font-bold text-gray-500">Account Holder Name</span>
                  <span className="font-black text-gray-900 dark:text-white uppercase">{fn} {ln}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">Disbursement Currency</span>
                  <span className="font-mono font-black text-gray-900 dark:text-white">USD / KHR</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Education & Skills */}
        {activeTab === "EDUCATION" && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-5 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-3">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <GraduationCap size={14} className="text-purple-500" /> Academic Qualifications & Training
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border flex justify-between items-center">
                  <div>
                    <p className="font-black text-gray-900 dark:text-white">Bachelor of Science in Computer Science & Information Technology</p>
                    <p className="text-[10px] text-gray-400 font-bold">Royal University of Phnom Penh (RUPP) &bull; Graduated 2016</p>
                  </div>
                  <Badge color="info">Verified</Badge>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border flex justify-between items-center">
                  <div>
                    <p className="font-black text-gray-900 dark:text-white">Professional Certificate in Systems Administration & Management</p>
                    <p className="text-[10px] text-gray-400 font-bold">Cambodia Institute of Technology &bull; 2019</p>
                  </div>
                  <Badge color="success">Certified</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Documents & Files */}
        {activeTab === "DOCUMENTS" && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-5 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-3">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <FileText size={14} className="text-blue-500" /> Personnel Documents & Compliance Files
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-500" />
                    <div>
                      <p className="font-black text-gray-900 dark:text-white">Signed Employment Contract.pdf</p>
                      <p className="text-[9px] text-gray-400 font-mono">1.8 MB &bull; PDF</p>
                    </div>
                  </div>
                  <Button size="xs" color="light"><ExternalLink size={12} /></Button>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-emerald-500" />
                    <div>
                      <p className="font-black text-gray-900 dark:text-white">National ID Scan.pdf</p>
                      <p className="text-[9px] text-gray-400 font-mono">850 KB &bull; PDF</p>
                    </div>
                  </div>
                  <Button size="xs" color="light"><ExternalLink size={12} /></Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Placement History */}
        {activeTab === "JOBS" && (
          <div className="p-6 bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-4 animate-fade-in text-center">
            <Award size={32} className="mx-auto text-blue-500" />
            <h4 className="font-black text-base uppercase dark:text-white">Historical Placement Log</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Record of historical assignments, client deployments, and operational project tenures.
            </p>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border text-left text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-black text-gray-900 dark:text-white">Current Active Assignment: {branch}</span>
                <Badge color="success">Active</Badge>
              </div>
              <p className="text-[10px] text-gray-400">Assigned since: {joinDate} &bull; Operational Supervisor: Regional HQ</p>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800 justify-end">
        <Button color="gray" onClick={onClose} className="font-black uppercase text-[10px] px-8 h-10 rounded-xl">
          Close Profile Dossier
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EmployeeDetailModal;
