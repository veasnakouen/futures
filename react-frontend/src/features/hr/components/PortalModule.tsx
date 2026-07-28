import React, { useState } from "react";
import { Button, Badge } from '@/lib/flowbite-compat';
import { User, Calendar, DollarSign, Clock, FileText, Bell } from "lucide-react";

interface PortalModuleProps {
  currentUser?: any;
  leaveBalance?: any;
  payslips?: any[];
  announcements?: any[];
}

const PortalModule: React.FC<PortalModuleProps> = ({
  currentUser = { firstName: "Sokha", lastName: "Chan", role: "Software Architect", branch: "Phnom Penh" },
  leaveBalance = { totalAnnualLeave: 18, remainingLeave: 14 },
  payslips = [],
  announcements = [],
}) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* User Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-md">Self-Service Portal</span>
          <h2 className="text-2xl font-black mt-2">Welcome back, {currentUser.firstName}!</h2>
          <p className="text-xs opacity-90">{currentUser.role} &bull; {currentUser.branch}</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-black text-xl">
          {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
        </div>
      </div>

      {/* Quick Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Annual Leave Balance</p>
            <h4 className="text-2xl font-black text-blue-600">{leaveBalance.remainingLeave} / {leaveBalance.totalAnnualLeave} Days</h4>
          </div>
          <Calendar className="text-blue-500" size={28} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Latest Payslip Status</p>
            <h4 className="text-xl font-black text-emerald-600">Disbursed</h4>
          </div>
          <DollarSign className="text-emerald-500" size={28} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">System Notifications</p>
            <h4 className="text-xl font-black dark:text-white">2 Unread</h4>
          </div>
          <Bell className="text-amber-500" size={28} />
        </div>
      </div>
    </div>
  );
};

export default PortalModule;
