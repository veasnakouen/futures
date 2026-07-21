import React, { useState, useEffect } from "react";
import { Modal, Button } from "@/lib/flowbite-compat";

interface MonthlyALCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alString: string) => void;
  year: number;
  monthIndex: number; // 0 for Jan, 11 for Dec
  initialAlString: string;
}

type DayStatus = "None" | "Full" | "AM" | "PM";

export const MonthlyALCalendarModal: React.FC<MonthlyALCalendarModalProps> = ({
  isOpen,
  onClose,
  onSave,
  year,
  monthIndex,
  initialAlString,
}) => {
  const [selectedDays, setSelectedDays] = useState<Record<number, DayStatus>>({});

  useEffect(() => {
    if (isOpen) {
      const parsed: Record<number, DayStatus> = {};
      if (initialAlString) {
        const parts = initialAlString.split(",").map((s) => s.trim());
        parts.forEach((p) => {
          if (!p) return;
          const match = p.match(/^(\d+)(?:\((AM|PM)\))?$/i);
          if (match) {
            const day = parseInt(match[1]);
            const modifier = match[2]?.toUpperCase();
            if (modifier === "AM") parsed[day] = "AM";
            else if (modifier === "PM") parsed[day] = "PM";
            else parsed[day] = "Full";
          }
        });
      }
      setSelectedDays(parsed);
    }
  }, [isOpen, initialAlString]);

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const monthName = new Date(year, monthIndex, 1).toLocaleString('default', { month: 'long' });

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => {
      const current = prev[day] || "None";
      const next: DayStatus =
        current === "None" ? "Full" :
          current === "Full" ? "AM" :
            current === "AM" ? "PM" : "None";

      const updated = { ...prev };
      if (next === "None") {
        delete updated[day];
      } else {
        updated[day] = next;
      }
      return updated;
    });
  };

  const calculateTotal = () => {
    return Object.values(selectedDays).reduce((sum, status) => {
      if (status === "Full") return sum + 1;
      if (status === "AM" || status === "PM") return sum + 0.5;
      return sum;
    }, 0);
  };

  const handleSave = () => {
    const days = Object.keys(selectedDays)
      .map(Number)
      .sort((a, b) => a - b);

    const parts = days.map((day) => {
      const status = selectedDays[day];
      if (status === "Full") return `${day}`;
      return `${day}(${status})`;
    });

    onSave(parts.join(", "));
    onClose();
  };

  const getStatusColor = (status?: DayStatus) => {
    switch (status) {
      case "Full": return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30 border-blue-400";
      case "AM": return "bg-gradient-to-br from-cyan-300 to-blue-400 text-blue-900 shadow-sm border-blue-300";
      case "PM": return "bg-gradient-to-br from-indigo-300 to-indigo-400 text-indigo-900 shadow-sm border-indigo-300";
      default: return "bg-white/50 text-gray-700 hover:bg-white dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700 border-gray-100 dark:border-gray-700 shadow-sm";
    }
  };

  const getStatusLabel = (status?: DayStatus) => {
    switch (status) {
      case "Full": return "Full";
      case "AM": return "AM";
      case "PM": return "PM";
      default: return "";
    }
  };

  // Build calendar grid
  const blanks = Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`blank-${i}`} className="p-2" />);
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const status = selectedDays[day];
    return (
      <div
        key={day}
        onClick={() => toggleDay(day)}
        className={`h-10 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:shadow-md hover:scale-110 active:scale-95 ${getStatusColor(status)} relative overflow-hidden group`}
      >
        <span className="font-black text-xs z-10 leading-tight">{day}</span>
        {status && status !== "None" && (
          <span className="text-[7px] font-black uppercase z-10 tracking-wider opacity-90 leading-tight mt-0.5">{getStatusLabel(status)}</span>
        )}

        {/* Subtle hover effect for unselected items */}
        {(!status || status === "None") && (
          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>
    );
  });

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <Modal.Header className="border-b border-gray-100 dark:border-gray-700">
        <span className="font-black text-xl text-gray-800 dark:text-white">Plan AL - {monthName} {year}</span>
      </Modal.Header>
      <Modal.Body className="bg-gray-50/30 dark:bg-gray-900/30 p-6 animate-in fade-in zoom-in duration-500">
        <div className="mb-6 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2">
          <span className="animate-pulse">👆</span> Click a day to toggle: <span className="font-black text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Full AL &rarr; Half (AM) &rarr; Half (PM) &rarr; Off</span>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-black uppercase text-gray-400">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {blanks}
          {days}
        </div>

        <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
          <span className="font-black text-gray-700 dark:text-gray-300">Total AL:</span>
          <span className="text-xl font-black text-blue-600">{calculateTotal()} Days</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave} color="blue">Confirm</Button>
        <Button onClick={onClose} color="gray">Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};
