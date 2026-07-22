import React, { useState, useEffect } from "react";
import { Button, Spinner, Modal, TextInput, Datepicker } from '@/lib/flowbite-compat';
import { CalendarDays, Save, AlertCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAnnualLeavePlan, useSaveAnnualLeavePlan, useLeaveBalance } from "../../../hooks/useLeaves";
import { format, differenceInBusinessDays, parseISO, isAfter, isBefore } from "date-fns";

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

  const { data: balance, isLoading: isLoadingBalance } = useLeaveBalance(employeeId, year);
  const { data: plan, isLoading: isLoadingPlan } = useAnnualLeavePlan(employeeIdNo, year);
  const { mutateAsync: savePlan, isPending: isSaving } = useSaveAnnualLeavePlan();

  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"single" | "multiple">("single");
  const [halfDayType, setHalfDayType] = useState<"none" | "morning" | "afternoon">("none");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  useEffect(() => {
    if (plan && plan.dateRanges) {
      setDateRanges(plan.dateRanges);
    } else {
      setDateRanges([]);
    }
  }, [plan]);

  const totalPlanned = dateRanges.reduce((sum, range) => sum + range.calculatedDays, 0);
  const totalAllowed = balance?.totalAnnualLeave || 18;
  const isOverLimit = totalPlanned > totalAllowed;

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
        janDays: 0, febDays: 0, marDays: 0, aprDays: 0,
        mayDays: 0, junDays: 0, julDays: 0, augDays: 0,
        sepDays: 0, octDays: 0, novDays: 0, decDays: 0,
        dateRanges: dateRanges
      });
      toast.success("Annual Leave Plan saved successfully!");
    } catch (err) {
      toast.error("Failed to save plan.");
    }
  };

  const handleAddRange = () => {
    if (modalMode === "single") {
      if (!newStartDate) {
        toast.error("Please select a date.");
        return;
      }
      const start = parseISO(newStartDate);
      if (start.getFullYear() !== year) {
        toast.error(`Date must fall within the selected planning year (${year}).`);
        return;
      }
      const day = start.getDay();
      if (day === 0 || day === 6) {
        toast.error("Selected date is a weekend.");
        return;
      }
      
      const calcDays = halfDayType === "none" ? 1 : 0.5;
      
      const newBlock = {
        startDate: newStartDate,
        endDate: newStartDate,
        calculatedDays: calcDays
      };
      
      setDateRanges(prev => {
        if (editIndex !== null) {
          const next = [...prev];
          next[editIndex] = newBlock;
          return next;
        }
        return [...prev, newBlock];
      });
    } else {
      if (!newStartDate || !newEndDate) {
        toast.error("Please select both start and end dates.");
        return;
      }
      
      const start = parseISO(newStartDate);
      const end = parseISO(newEndDate);
      
      if (isAfter(start, end)) {
        toast.error("Start date cannot be after end date.");
        return;
      }
      
      if (start.getFullYear() !== year || end.getFullYear() !== year) {
        toast.error(`Dates must fall within the selected planning year (${year}).`);
        return;
      }

      let calcDays = 0;
      let curr = new Date(start);
      while (curr <= end) {
        const day = curr.getDay();
        if (day !== 0 && day !== 6) {
          calcDays++;
        }
        curr.setDate(curr.getDate() + 1);
      }

      if (calcDays === 0) {
        toast.error("Selected range does not contain any working days.");
        return;
      }

      const newBlock = {
        startDate: newStartDate,
        endDate: newEndDate,
        calculatedDays: calcDays
      };

      setDateRanges(prev => {
        if (editIndex !== null) {
          const next = [...prev];
          next[editIndex] = newBlock;
          return next;
        }
        return [...prev, newBlock];
      });
    }
    
    setNewStartDate("");
    setNewEndDate("");
    setHalfDayType("none");
    setEditIndex(null);
    setIsModalOpen(false);
  };

  const handleEditRange = (index: number) => {
    const range = dateRanges[index];
    setEditIndex(index);
    setNewStartDate(range.startDate);
    if (range.startDate === range.endDate) {
      setModalMode("single");
      setHalfDayType(range.calculatedDays === 0.5 ? "morning" : "none");
    } else {
      setModalMode("multiple");
      setNewEndDate(range.endDate);
    }
    setIsModalOpen(true);
  };

  const removeRange = (index: number) => {
    setDateRanges(prev => prev.filter((_, i) => i !== index));
  };

  const isInitialLoading = (isLoadingBalance && !balance) || (isLoadingPlan && !plan);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CalendarDays size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 tracking-tight">Annual Leave Planner</h2>
          <p className="text-blue-100 font-medium max-w-xl">
            Forecast your annual leave by selecting specific date blocks. Management uses this to guarantee proper staffing coverage.
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Planned Leave Blocks</h3>
            <p className="text-sm text-gray-500">Add the date ranges you plan to take off. Weekends are automatically excluded.</p>
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

        <div className="mb-6">
          <Button color="light" onClick={() => {
            setEditIndex(null);
            setNewStartDate("");
            setNewEndDate("");
            setHalfDayType("none");
            setIsModalOpen(true);
          }} className="w-full border-dashed border-2 border-gray-300 dark:border-gray-600 py-4 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-bold text-gray-500">
            <Plus size={20} />
            Add Leave Block
          </Button>
        </div>

        {isInitialLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
            <div className="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
          </div>
        ) : dateRanges.length > 0 ? (
          <div className="space-y-3">
            {dateRanges.map((range, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-lg group">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-md">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {range.startDate === range.endDate 
                        ? format(parseISO(range.startDate), 'MMM dd, yyyy') 
                        : `${format(parseISO(range.startDate), 'MMM dd, yyyy')} — ${format(parseISO(range.endDate), 'MMM dd, yyyy')}`}
                    </p>
                    <p className="text-xs font-medium text-gray-500">
                      {range.calculatedDays} working day{range.calculatedDays !== 1 ? 's' : ''} {range.calculatedDays === 0.5 ? '(Half Day)' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditRange(idx)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>
                  <button onClick={() => removeRange(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No leave blocks planned yet. Click above to add one.</p>
          </div>
        )}
      </div>

      <Modal show={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setEditIndex(null);
      }} size="md">
        <Modal.Header>{editIndex !== null ? "Edit Leave Block" : "Add Leave Block"}</Modal.Header>
        <Modal.Body>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-4">
            <button
              onClick={() => setModalMode("single")}
              className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${modalMode === "single" ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-700"}`}
            >
              Single Day
            </button>
            <button
              onClick={() => setModalMode("multiple")}
              className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${modalMode === "multiple" ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-700"}`}
            >
              Multiple Days
            </button>
          </div>

          <div className="space-y-4">
            {modalMode === "single" ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                  <Datepicker value={newStartDate} onChange={(e: any) => setNewStartDate(e.target.value)} placeholder="Pick a date..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                  <select
                    value={halfDayType}
                    onChange={(e: any) => setHalfDayType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="none">Full Day (1 day)</option>
                    <option value="morning">Half Day - Morning (0.5 days)</option>
                    <option value="afternoon">Half Day - Afternoon (0.5 days)</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                  <Datepicker value={newStartDate} onChange={(e: any) => setNewStartDate(e.target.value)} placeholder="Select start date..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                  <Datepicker value={newEndDate} onChange={(e: any) => setNewEndDate(e.target.value)} placeholder="Select end date..." />
                </div>
              </>
            )}
            <p className="text-xs text-gray-500 font-medium pt-2">
              Weekends will be automatically excluded from your total days. Public holidays will need to be manually accounted for.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button color="gray" onClick={() => {
            setIsModalOpen(false);
            setEditIndex(null);
          }}>Cancel</Button>
          <Button color="blue" onClick={handleAddRange}>{editIndex !== null ? "Save Changes" : "Add Block"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AnnualLeavePlannerTab;
