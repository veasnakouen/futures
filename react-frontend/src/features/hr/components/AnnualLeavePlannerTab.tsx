import React, { useState, useEffect } from "react";
import { Button, Spinner } from '@/lib/flowbite-compat';
import { CalendarDays, Save, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAnnualLeavePlan, useSaveAnnualLeavePlan, useLeaveBalance } from "../../../hooks/useLeaves";

interface AnnualLeavePlannerTabProps {
  employeeId: number | null;
  employeeIdNo: string | null;
}

const AnnualLeavePlannerTab: React.FC<AnnualLeavePlannerTabProps> = ({ employeeId, employeeIdNo }) => {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: balance, isLoading: isLoadingBalance } = useLeaveBalance(employeeId, year);
  const { data: plan, isLoading: isLoadingPlan } = useAnnualLeavePlan(employeeIdNo, year);
  const { mutateAsync: savePlan, isPending: isSaving } = useSaveAnnualLeavePlan();

  const [formData, setFormData] = useState({
    janDays: 0, febDays: 0, marDays: 0, aprDays: 0,
    mayDays: 0, junDays: 0, julDays: 0, augDays: 0,
    sepDays: 0, octDays: 0, novDays: 0, decDays: 0
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        janDays: plan.janDays || 0,
        febDays: plan.febDays || 0,
        marDays: plan.marDays || 0,
        aprDays: plan.aprDays || 0,
        mayDays: plan.mayDays || 0,
        junDays: plan.junDays || 0,
        julDays: plan.julDays || 0,
        augDays: plan.augDays || 0,
        sepDays: plan.sepDays || 0,
        octDays: plan.octDays || 0,
        novDays: plan.novDays || 0,
        decDays: plan.decDays || 0
      });
    }
  }, [plan]);

  const totalPlanned = Object.values(formData).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const totalAllowed = balance?.totalAnnualLeave || 18; // Default 18 if balance not loaded
  const isOverLimit = totalPlanned > totalAllowed;

  const handleInputChange = (month: string, value: string) => {
    const num = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [month]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const handleSave = async () => {
    if (isOverLimit) {
      toast.error(`You cannot plan more than your allowed balance of ${totalAllowed} days.`);
      return;
    }

    if (!employeeIdNo) {
      toast.error("Employee ID not found.");
      return;
    }

    try {
      await savePlan({
        employeeId: employeeIdNo,
        planYear: year,
        ...formData
      });
      toast.success("Annual Leave Plan saved successfully!");
    } catch (err) {
      toast.error("Failed to save plan.");
    }
  };

  if (isLoadingBalance || isLoadingPlan) {
    return <div className="flex justify-center p-12"><Spinner size="xl" /></div>;
  }

  const months = [
    { key: "janDays", label: "January" },
    { key: "febDays", label: "February" },
    { key: "marDays", label: "March" },
    { key: "aprDays", label: "April" },
    { key: "mayDays", label: "May" },
    { key: "junDays", label: "June" },
    { key: "julDays", label: "July" },
    { key: "augDays", label: "August" },
    { key: "sepDays", label: "September" },
    { key: "octDays", label: "October" },
    { key: "novDays", label: "November" },
    { key: "decDays", label: "December" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CalendarDays size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 tracking-tight">Annual Leave Planner</h2>
          <p className="text-blue-100 font-medium max-w-xl">
            Forecast your annual leave for the entire year. This helps management ensure proper staffing coverage.
          </p>

          <div className="mt-8 flex items-center gap-4 bg-white/10 backdrop-blur-md w-max px-6 py-3 rounded-xl border border-white/20">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-200">Planning Year</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-transparent border-none text-xl font-black text-white focus:ring-0 p-0 cursor-pointer"
            >
              {[year - 1, year, year + 1].map(y => (
                <option key={y} value={y} className="text-gray-900">{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Monthly Forecast</h3>
            <p className="text-sm text-gray-500">Enter the number of days you plan to take off each month.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Planned</p>
              <p className={`text-2xl font-black ${isOverLimit ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                {totalPlanned} <span className="text-sm text-gray-400 font-bold">/ {totalAllowed} days</span>
              </p>
            </div>
            <Button
              color="blue"
              onClick={handleSave}
              disabled={isSaving || isOverLimit}
              className="h-12 px-6 font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              {isSaving ? <Spinner size="sm" /> : <Save size={18} />}
              Save Plan
            </Button>
          </div>
        </div>

        {isOverLimit && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-800/30 font-medium">
            <AlertCircle size={20} className="shrink-0" />
            <p>You have planned {totalPlanned - totalAllowed} days more than your annual allowance.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {months.map(m => (
            <div key={m.key} className="bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">{m.label}</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="31"
                  step="0.5"
                  className="w-full bg-white dark:bg-gray-800 border-none rounded-lg shadow-sm h-12 text-center text-lg font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={(formData as any)[m.key] || ''}
                  onChange={(e) => handleInputChange(m.key, e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">days</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnualLeavePlannerTab;
