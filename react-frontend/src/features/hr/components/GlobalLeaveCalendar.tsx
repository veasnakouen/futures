import React, { useState, useMemo } from "react";
import { format, getDaysInMonth, startOfMonth, parseISO, isWithinInterval, endOfDay } from "date-fns";
import { useAllEmployees } from "../../../hooks/useHR";
import { useAllAnnualLeavePlans } from "../../../hooks/useLeaves";
import { Avatar, Spinner } from "@/lib/flowbite-compat";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface GlobalLeaveCalendarProps {
  globalLeaves: any[];
}

export const GlobalLeaveCalendar: React.FC<GlobalLeaveCalendarProps> = ({ globalLeaves }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: employees = [], isLoading: isLoadingEmp } = useAllEmployees();
  const { data: alPlans = [], isLoading: isLoadingAl } = useAllAnnualLeavePlans(year);

  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = startOfMonth(currentDate).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getLeaveStatusForDay = (employeeIdNo: string, day: number) => {
    const targetDate = new Date(year, month, day);
    
    // Check AL Plans
    const alPlan = alPlans.find(p => p.employeeId === employeeIdNo);
    if (alPlan && alPlan.dateRanges) {
      const isAL = alPlan.dateRanges.some(range => {
        const start = parseISO(range.startDate);
        const end = parseISO(range.endDate);
        return isWithinInterval(targetDate, { start, end: endOfDay(end) });
      });
      if (isAL) return { type: "AL", label: "Annual Leave", color: "bg-blue-500" };
    }

    // Check Leave Requests (Sick, Personal, etc)
    const activeLeaves = globalLeaves.filter(
      l => (l.employee?.idNo === employeeIdNo || l.employeeId === employeeIdNo) && l.status === "APPROVED"
    );
    
    const request = activeLeaves.find(l => {
      const start = parseISO(l.startDate);
      const end = parseISO(l.endDate);
      return isWithinInterval(targetDate, { start, end: endOfDay(end) });
    });

    if (request) {
      const isSick = request.leaveType === "Sick";
      return { 
        type: request.leaveType, 
        label: request.leaveType, 
        color: isSick ? "bg-red-500" : "bg-amber-500" 
      };
    }

    return null;
  };

  if (isLoadingEmp || isLoadingAl) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Spinner size="xl" />
      </div>
    );
  }

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-fade-in border border-gray-100 dark:border-gray-700 mt-8">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
            <CalendarIcon size={20} />
          </div>
          <h3 className="text-lg font-black dark:text-white">Global Leave Calendar</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-500">
              <ChevronLeft size={16} />
            </button>
            <span className="font-bold text-sm min-w-[120px] text-center dark:text-white">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-500">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500"></div> Planned AL</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500"></div> Sick Leave (Approved)</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-500"></div> Other Leave (Approved)</div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto custom-scrollbar relative">
        <div className="min-w-max pb-4">
          {/* Days Header */}
          <div className="flex border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div className="w-64 shrink-0 px-6 py-3 font-bold text-xs text-gray-500 uppercase tracking-widest sticky left-0 bg-white dark:bg-gray-800 z-20 border-r border-gray-100 dark:border-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
              Staff Member
            </div>
            {daysArray.map((day) => {
              const date = new Date(year, month, day);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
              
              return (
                <div key={day} className={`w-8 shrink-0 flex flex-col items-center justify-center py-2 border-r border-gray-50 dark:border-gray-700/50 ${isWeekend ? 'bg-gray-50 dark:bg-gray-900/50' : ''} ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <span className={`text-[9px] font-bold uppercase ${isWeekend ? 'text-gray-400' : 'text-gray-500'}`}>
                    {format(date, "EE").charAt(0)}
                  </span>
                  <span className={`text-xs font-black ${isToday ? 'text-blue-600 dark:text-blue-400' : (isWeekend ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300')}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Employee Rows */}
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-[500px] overflow-y-auto custom-scrollbar">
            {employees.map((emp) => (
              <div key={emp.idNo} className="flex hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors group">
                <div className="w-64 shrink-0 px-6 py-2 flex items-center gap-3 sticky left-0 bg-white group-hover:bg-gray-50 dark:bg-gray-800 dark:group-hover:bg-gray-800/90 z-20 border-r border-gray-100 dark:border-gray-700 transition-colors">
                  <Avatar rounded size="xs" />
                  <div className="truncate">
                    <p className="text-xs font-bold dark:text-white truncate">
                      {emp.firstNameEnglish} {emp.lastNameEnglish}
                    </p>
                    <p className="text-[9px] font-medium text-gray-400">{emp.idNo}</p>
                  </div>
                </div>
                
                {daysArray.map((day) => {
                  const date = new Date(year, month, day);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const status = getLeaveStatusForDay(emp.idNo, day);
                  
                  return (
                    <div key={day} className={`w-8 shrink-0 border-r border-gray-50 dark:border-gray-700/50 flex items-center justify-center p-0.5 ${isWeekend ? 'bg-gray-50 dark:bg-gray-900/50' : ''}`}>
                      {status && (
                        <div 
                          className={`w-full h-full min-h-[24px] rounded-sm shadow-sm ${status.color} flex items-center justify-center group/cell relative cursor-help`}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/cell:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">
                            {status.label}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
