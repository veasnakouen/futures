import React, { useState, useEffect } from "react";
import { Button, Spinner } from '@/lib/flowbite-compat';
import { CalendarDays, Save, AlertCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAnnualLeavePlan, useSaveAnnualLeavePlan, useLeaveBalance } from "../../../hooks/useLeaves";
import { parseISO, isAfter, format } from "date-fns";
import DatePicker from "@/components/common/DatePicker";

interface AnnualLeavePlannerTabProps {
  employeeId: number | null;
  employeeIdNo: string | null;
}

export type LeaveDayType = "FULL" | "HALF_AM" | "HALF_PM";

interface DateRange {
  id?: number;
  startDate: string;
  endDate: string;
  calculatedDays: number;
  leaveType?: LeaveDayType;
}

const AnnualLeavePlannerTab: React.FC<AnnualLeavePlannerTabProps> = ({ employeeId, employeeIdNo }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: balance } = useLeaveBalance(employeeId, year);
  const { data: plan } = useAnnualLeavePlan(employeeIdNo, year);
  const { mutateAsync: savePlan, isPending: isSaving } = useSaveAnnualLeavePlan();

  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState<LeaveDayType>("FULL");

  const startDateObj = startDate ? parseISO(startDate) : null;
  const endDateObj = endDate ? parseISO(endDate) : null;

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
    if (!startDate) return toast.error("Select start date.");
    const targetEnd = endDate || startDate;

    const start = parseISO(startDate);
    const end = parseISO(targetEnd);
    if (isAfter(start, end)) return toast.error("Start date cannot be after end date.");

    let workingDaysCount = 0;
    let curr = new Date(start);
    while (curr <= end) {
      if (curr.getDay() !== 0 && curr.getDay() !== 6) workingDaysCount++;
      curr.setDate(curr.getDate() + 1);
    }

    if (workingDaysCount === 0) return toast.error("Selected range contains no working days.");

    const calcDays = leaveType !== "FULL" ? workingDaysCount * 0.5 : workingDaysCount;

    setDateRanges([...dateRanges, { startDate, endDate: targetEnd, calculatedDays: calcDays, leaveType }]);
    setStartDate("");
    setEndDate("");
    setLeaveType("FULL");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black mb-1">Annual Leave Planner</h2>
          <p className="text-xs text-blue-100">Forecast your annual leave date blocks & half-day shifts for coverage planning.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
          <span className="text-xs font-bold uppercase text-blue-200">Year</span>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-transparent font-black text-white text-lg border-none focus:ring-0 p-0">
            {[year - 1, year, year + 1].map((y) => (<option key={y} value={y} className="text-gray-900">{y}</option>))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-0 p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700/60">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Planned Leave Blocks</h3>
            <p className="text-xs text-gray-400">Add full-day or half-day leave blocks for coverage forecasting.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black ${isOverLimit ? "text-rose-500" : "text-blue-600 dark:text-blue-400"}`}>
                {totalPlanned}
              </span>
              <span className="text-xs text-gray-400 font-bold">/ {totalAllowed} days</span>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || isOverLimit}
              className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 text-white ${
                isOverLimit
                  ? "bg-gray-400 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
              }`}
            >
              {isSaving ? <Spinner size="sm" /> : <Save size={15} />} Save Plan
            </button>
          </div>
        </div>

        {/* Styled Input Form Block */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/40 dark:from-gray-900/60 dark:to-gray-800/80 p-4 rounded-2xl shadow-inner border-0 space-y-3">
          {/* Shift / Duration Segmented Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
            <span className="text-[11px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider">
              Select Leave Shift Duration:
            </span>
            <div className="flex p-0.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <button
                type="button"
                onClick={() => setLeaveType("FULL")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  leaveType === "FULL"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                ☀️ Full Day (1.0d)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaveType("HALF_AM");
                  if (startDate) setEndDate(startDate);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  leaveType === "HALF_AM"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-amber-500"
                }`}
              >
                🌅 Half Day - Morning (0.5d)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaveType("HALF_PM");
                  if (startDate) setEndDate(startDate);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  leaveType === "HALF_PM"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                }`}
              >
                🌆 Half Day - Afternoon (0.5d)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-1.5 flex items-center gap-1">
                <CalendarDays size={13} className="text-blue-500" /> Start Date
              </label>
              <DatePicker
                value={startDateObj}
                onChange={(d) => {
                  if (!d) {
                    setStartDate("");
                    return;
                  }
                  const newStart = format(d, "yyyy-MM-dd");
                  setStartDate(newStart);
                  if (leaveType !== "FULL" || (endDate && isAfter(d, parseISO(endDate)))) {
                    setEndDate(newStart);
                  }
                }}
                placeholder="Select start date..."
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-1.5 flex items-center gap-1">
                <CalendarDays size={13} className="text-indigo-500" /> End Date
              </label>
              <DatePicker
                value={endDateObj}
                minDate={startDateObj}
                onChange={(d) => setEndDate(d ? format(d, "yyyy-MM-dd") : "")}
                placeholder="Select end date..."
              />
            </div>

            <div className="sm:col-span-4">
              <button
                type="button"
                onClick={handleAddRange}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus size={16} /> Add Block
              </button>
            </div>
          </div>
        </div>

        {/* List of Planned Leave Blocks */}
        <div className="space-y-2.5">
          {dateRanges.map((r, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-3.5 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm text-xs font-bold transition-all hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
            >
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 rounded-lg">
                  <CalendarDays size={14} />
                </span>
                <div>
                  <span className="text-gray-900 dark:text-white font-mono">{r.startDate}</span>
                  {r.startDate !== r.endDate && (
                    <>
                      <span className="text-gray-400 mx-2 font-normal">to</span>
                      <span className="text-gray-900 dark:text-white font-mono">{r.endDate}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 font-mono text-[11px] font-black rounded-lg border ${
                  r.leaveType === "HALF_AM" ? "bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-900/40" :
                  r.leaveType === "HALF_PM" ? "bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-900/40" :
                  "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-900/40"
                }`}>
                  {r.calculatedDays} {r.calculatedDays === 0.5 ? `days (${r.leaveType === "HALF_AM" ? "Half Day - Morning AM" : "Half Day - Afternoon PM"})` : "working days"}
                </span>
                <button
                  type="button"
                  onClick={() => setDateRanges(dateRanges.filter((_, i) => i !== idx))}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-all"
                  title="Remove Block"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {dateRanges.length === 0 && (
            <div className="p-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
              <CalendarDays size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-xs font-bold text-gray-400">No leave blocks planned yet.</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Select a shift duration and dates above to add your first leave block.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnualLeavePlannerTab;
