import React, { useState, useEffect } from "react";
import { Button, Spinner } from '@/lib/flowbite-compat';
import { CalendarDays, Save, AlertCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAnnualLeavePlan, useSaveAnnualLeavePlan, useLeaveBalance } from "../../../hooks/useLeaves";
import { parseISO, isAfter } from "date-fns";

interface AnnualLeavePlannerTabProps {
  employeeId: number | null;
  employeeIdNo: string | null;
}

interface DateRange {
  id?: number;
  startDate: string;
  endDate: string;
  calculatedDays: number;
}

const AnnualLeavePlannerTab: React.FC<AnnualLeavePlannerTabProps> = ({ employeeId, employeeIdNo }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: balance } = useLeaveBalance(employeeId, year);
  const { data: plan } = useAnnualLeavePlan(employeeIdNo, year);
  const { mutateAsync: savePlan, isPending: isSaving } = useSaveAnnualLeavePlan();

  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (plan && plan.dateRanges) setDateRanges(plan.dateRanges);
    else setDateRanges([]);
  }, [plan]);

  const totalPlanned = dateRanges.reduce((sum, range) => sum + range.calculatedDays, 0);
  const totalAllowed = balance?.totalAnnualLeave || 18;
  const isOverLimit = totalPlanned > totalAllowed;

  const handleSave = async () => {
    if (isOverLimit) return toast.error(`Cannot exceed allowed balance of ${totalAllowed} days.`);
    if (!employeeIdNo) return toast.error("Employee ID not found.");
    try {
      await savePlan({
        employeeId: employeeIdNo,
        planYear: year,
        janDays: 0, febDays: 0, marDays: 0, aprDays: 0, mayDays: 0, junDays: 0,
        julDays: 0, augDays: 0, sepDays: 0, octDays: 0, novDays: 0, decDays: 0,
        dateRanges
      });
      toast.success("Annual Leave Plan saved successfully!");
    } catch {
      toast.error("Failed to save plan.");
    }
  };

  const handleAddRange = () => {
    if (!startDate || !endDate) return toast.error("Select both dates.");
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (isAfter(start, end)) return toast.error("Start date cannot be after end date.");

    let calcDays = 0;
    let curr = new Date(start);
    while (curr <= end) {
      if (curr.getDay() !== 0 && curr.getDay() !== 6) calcDays++;
      curr.setDate(curr.getDate() + 1);
    }

    if (calcDays === 0) return toast.error("Selected range contains no working days.");

    setDateRanges([...dateRanges, { startDate, endDate, calculatedDays: calcDays }]);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black mb-1">Annual Leave Planner</h2>
          <p className="text-xs text-blue-100">Forecast your annual leave date blocks for coverage planning.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
          <span className="text-xs font-bold uppercase text-blue-200">Year</span>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-transparent font-black text-white text-lg border-none focus:ring-0 p-0">
            {[year - 1, year, year + 1].map((y) => (<option key={y} value={y} className="text-gray-900">{y}</option>))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="font-bold text-base dark:text-white">Planned Leave Blocks</h3>
            <p className="text-xs text-gray-400">Add date ranges you plan to take off.</p>
          </div>
          <div className="flex items-center gap-4">
            <p className={`text-xl font-black ${isOverLimit ? "text-red-500" : "text-blue-600"}`}>
              {totalPlanned} <span className="text-xs text-gray-400 font-bold">/ {totalAllowed} days</span>
            </p>
            <Button color="blue" onClick={handleSave} disabled={isSaving || isOverLimit} className="h-10 px-4 font-bold">
              {isSaving ? <Spinner size="sm" /> : <Save size={16} className="mr-1" />} Save Plan
            </Button>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-3 gap-4 items-end bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full text-xs rounded-lg border-gray-300 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full text-xs rounded-lg border-gray-300 dark:bg-gray-700 dark:text-white" />
          </div>
          <Button color="indigo" size="xs" onClick={handleAddRange} className="h-9 font-bold uppercase text-[10px]">
            <Plus size={14} className="mr-1" /> Add Block
          </Button>
        </div>

        {/* List of Blocks */}
        <div className="space-y-2">
          {dateRanges.map((r, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-xl border text-xs font-bold">
              <div>
                <span className="dark:text-white">{r.startDate}</span> <span className="text-gray-400">to</span> <span className="dark:text-white">{r.endDate}</span>
                <span className="ml-3 text-blue-600 font-mono">({r.calculatedDays} working days)</span>
              </div>
              <button onClick={() => setDateRanges(dateRanges.filter((_, i) => i !== idx))} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnualLeavePlannerTab;
