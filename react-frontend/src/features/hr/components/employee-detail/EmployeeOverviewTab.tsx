import React from "react";
import { User, Phone, Mail, MapPin, Calendar, Briefcase, ShieldCheck } from "lucide-react";
import { Badge } from '@/lib/flowbite-compat';

interface EmployeeOverviewTabProps {
  employee: any;
}

const EmployeeOverviewTab: React.FC<EmployeeOverviewTabProps> = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border flex items-center gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-indigo-50 border-4 border-white shadow-md flex items-center justify-center">
          {employee.photo ? (
            <img src={employee.photo} alt={employee.firstName} className="w-full h-full object-cover" />
          ) : (
            <User size={36} className="text-indigo-600" />
          )}
        </div>
        <div>
          <h3 className="font-black text-xl dark:text-white uppercase">{employee.firstName} {employee.lastName}</h3>
          <p className="text-xs font-bold text-gray-500 uppercase">{employee.clientCode || `EMP-${employee.id}`} &bull; {employee.branch || "Phnom Penh"}</p>
          <div className="flex gap-2 mt-2">
            <Badge color="info" className="text-[8px] uppercase">{employee.status || "Active"}</Badge>
            <Badge color="gray" className="text-[8px] uppercase">{employee.gender || "Male"}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border space-y-3">
          <h4 className="font-black text-gray-400 uppercase tracking-widest text-[9px]">Contact Details</h4>
          <p className="font-bold dark:text-white flex items-center gap-2"><Phone size={14} className="text-blue-500" /> {employee.contactPhone || "N/A"}</p>
          <p className="font-bold dark:text-white flex items-center gap-2"><Mail size={14} className="text-blue-500" /> {employee.email || "N/A"}</p>
          <p className="font-bold dark:text-white flex items-center gap-2"><MapPin size={14} className="text-rose-500" /> {employee.province || "Phnom Penh"}</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border space-y-3">
          <h4 className="font-black text-gray-400 uppercase tracking-widest text-[9px]">Employment Meta</h4>
          <p className="font-bold dark:text-white flex items-center gap-2"><Briefcase size={14} className="text-indigo-500" /> {employee.headline || "Staff Member"}</p>
          <p className="font-bold dark:text-white flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Desired Salary: ${employee.desiredSalary || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOverviewTab;
