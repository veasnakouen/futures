import { useState, useEffect, useRef } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  disabled,
  className,
  label,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const yearContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showYearPicker && yearContainerRef.current) {
      setTimeout(() => {
        const activeBtn = yearContainerRef.current?.querySelector(
          '[data-active="true"]',
        );
        if (activeBtn) {
          activeBtn.scrollIntoView({ block: "center" });
        }
      }, 10);
    }
  }, [showYearPicker]);

  useEffect(() => {
    if (value) setViewDate(value);
  }, [value]);

  const handleDayClick = (day: Date) => {
    onChange(day);
    setOpen(false);
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

  const buildCalendarDays = () => {
    const start = startOfWeek(startOfMonth(viewDate));
    const end = endOfWeek(endOfMonth(viewDate));
    const days: Date[] = [];
    let cur = start;
    while (cur <= end) {
      days.push(cur);
      cur = addDays(cur, 1);
    }
    return days;
  };

  const systemCurrentYear = new Date().getFullYear();
  const yearRange = Array.from(
    { length: 151 },
    (_, i) => systemCurrentYear - 100 + i,
  );

  const calendarDays = buildCalendarDays();

  const popupContent = (
    <div className="bg-white/95 backdrop-blur-xl dark:bg-gray-800/95 /60 rounded-xl shadow-xl shadow-blue-500/10 overflow-hidden w-full min-w-[290px] max-h-[85vh] sm:max-h-[none] overflow-y-auto custom-scrollbar flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b /50 bg-gray-50/50 dark:bg-gray-900/30">
        <button
          type="button"
          onClick={() => setViewDate(subMonths(viewDate, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {/* Month selector */}
          <button
            type="button"
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-bold text-gray-900 dark:text-white transition-colors"
          >
            {MONTHS[viewDate.getMonth()]}
            <ChevronDown size={12} />
          </button>
          {/* Year selector */}
          <button
            type="button"
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-bold text-gray-900 dark:text-white transition-colors"
          >
            {viewDate.getFullYear()}
            <ChevronDown size={12} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Month Picker Overlay */}
      {showMonthPicker && (
        <div className="p-3 grid grid-cols-3 gap-1.5">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setViewDate(new Date(viewDate.getFullYear(), i, 1));
                setShowMonthPicker(false);
              }}
              className={`px-2 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${i === viewDate.getMonth() ?"bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/30":"text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {/* Year Picker Overlay */}
      {showYearPicker && (
        <div
          ref={yearContainerRef}
          className="p-3 grid grid-cols-3 gap-1.5 max-h-[260px] flex-1 min-h-0 overflow-y-auto custom-scrollbar"
        >
          {yearRange.map((y) => {
            const isActive = y === viewDate.getFullYear();
            return (
              <button
                key={y}
                type="button"
                data-active={isActive}
                onClick={() => {
                  setViewDate(new Date(y, viewDate.getMonth(), 1));
                  setShowYearPicker(false);
                }}
                className={`px-2 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${isActive ?"bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/30":"text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                {y}
              </button>
            );
          })}
        </div>
      )}

      {/* Calendar Days */}
      {!showMonthPicker && !showYearPicker && (
        <div className="p-3">
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 py-1"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {calendarDays.map((day, idx) => {
              const isSelected = value && isSameDay(day, value);
              const isCurrentMonth = isSameMonth(day, viewDate);
              const isCurrentDay = isToday(day);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 hover:scale-110 active:scale-95 ${isSelected ?"bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold shadow-md shadow-blue-500/30": isCurrentDay && isCurrentMonth ?"bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold border-blue-200 dark:border-blue-700/50": isCurrentMonth ?"text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700":"text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30"}`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      {!showMonthPicker && !showYearPicker && (
        <div className="px-3 pb-3 flex justify-between items-center">
          <button
            type="button"
            onClick={() => handleDayClick(new Date())}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`relative w-full ${className ??""}`}>
      {label && (
        <label className="mb-1 block text-[10px] uppercase font-black text-gray-400">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`flex items-center gap-2 w-full px-3 py-2.5 bg-white dark:bg-gray-800 rounded-xl cursor-pointer select-none transition-all duration-200 ease-out ${disabled ?"opacity-50 cursor-not-allowed":"hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5"} ${open ?"border-blue-500 ring-4 ring-blue-500/10 dark:border-blue-500":""}`}
          >
            <Calendar
              size={16}
              className={`shrink-0 transition-colors ${open ?"text-blue-500":"text-gray-400"}`}
            />
            <span
              className={`text-sm flex-1 whitespace-nowrap truncate text-left ${value ?"text-gray-900 dark:text-white font-medium":"text-gray-400"}`}
            >
              {value ? format(value, "MMM dd, yyyy") : placeholder}
            </span>
            <ChevronDown
              size={14}
              className={`shrink-0 text-gray-400 transition-transform duration-150 ${open ?"rotate-180":""}`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="p-0 border-none shadow-none bg-transparent w-auto"
          style={{ maxHeight: "var(--radix-popover-content-available-height)" }}
        >
          {popupContent}
        </PopoverContent>
      </Popover>
    </div>
  );
}
