import React, { useState, useEffect } from "react";
import {Button, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Spinner} from '@/lib/flowbite-compat';
import {
  CalendarCheck,
  ShieldCheck,
  ChevronRight,
  Activity,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import api from '@/services/api';

const SchedulingModule: React.FC = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hr/scheduling/current");
      setShifts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch schedule data", err);
      toast.error("Failed to connect to scheduling node");
    } finally {
      setLoading(false);
    }
  };

  const getShiftBadgeColor = (shift: string) => {
    if (!shift) return "gray";
    switch (shift.toLowerCase()) {
      case "morning":
        return "success";
      case "afternoon":
        return "info";
      case "night":
        return "purple";
      default:
        return "gray";
    }
  };

  // Calculate coverage
  const calcCoverage = (shiftType: string) => {
    if (shifts.length === 0) return 0;
    let count = 0;
    shifts.forEach((s) => {
      if (s.mondayShift === shiftType) count++;
      if (s.tuesdayShift === shiftType) count++;
      if (s.wednesdayShift === shiftType) count++;
      if (s.thursdayShift === shiftType) count++;
      if (s.fridayShift === shiftType) count++;
    });
    // simple mock metric: count / (total slots possible / 4)
    const maxSlots = shifts.length * 5;
    if (maxSlots === 0) return 0;
    const coverage = (count / (maxSlots / 3)) * 100;
    return Math.min(Math.round(coverage), 100);
  };

  const mCoverage = calcCoverage("Morning");
  const aCoverage = calcCoverage("Afternoon");
  const nCoverage = calcCoverage("Night");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Syncing Scheduling Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Shift Scheduling & Roster Planner
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Weekly Workforce Coverage & Rotation Node
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            color="light"
            size="sm"
            className="rounded-md text-xs font-black uppercase shadow-sm border-none transition-all hover:bg-gray-100 dark:hover:bg-gray-700 h-12"
          >
            <Activity size={14} className="mr-2" /> View Roster Patterns
          </Button>
          <Button
            color="blue"
            size="sm"
            className="rounded-md shadow-lg shadow-blue-500/20 text-xs font-black uppercase transition-all hover:scale-105"
            onClick={() =>
              toast.success("New roster slot created", { icon: "📅" })
            }
          >
            <Plus size={14} className="mr-2" /> Add Slot
          </Button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Shifts table */}
        <div className="lg:col-span-3 p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <CalendarCheck size={20} className="text-blue-600" /> Weekly Shift
            Plan (Mon - Fri)
          </h4>
          <div className="overflow-x-auto">
            <Table hoverable className="border-none">
              <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <TableHeadCell className="py-4">Staff Member</TableHeadCell>
                <TableHeadCell className="py-4">Mon</TableHeadCell>
                <TableHeadCell className="py-4">Tue</TableHeadCell>
                <TableHeadCell className="py-4">Wed</TableHeadCell>
                <TableHeadCell className="py-4">Thu</TableHeadCell>
                <TableHeadCell className="py-4">Fri</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {shifts.map((shift, idx) => {
                  const empName = shift.employee
                    ? `${shift.employee.firstNameEnglish} ${shift.employee.lastNameEnglish}`
                    : "Unknown";
                  const empRole =
                    shift.employee?.position?.name ||
                    shift.employee?.title ||
                    "Staff";
                  return (
                    <TableRow
                      key={shift.id || idx}
                      className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                    >
                      <TableCell className="font-black dark:text-white text-xs py-4">
                        <div>
                          <p className="leading-none uppercase tracking-tight">
                            {empName}
                          </p>
                          <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 block">
                            {empRole}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          color={getShiftBadgeColor(shift.mondayShift)}
                          className="w-fit px-3 rounded-md text-[9px] font-black uppercase"
                        >
                          {shift.mondayShift || "Off"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          color={getShiftBadgeColor(shift.tuesdayShift)}
                          className="w-fit px-3 rounded-md text-[9px] font-black uppercase"
                        >
                          {shift.tuesdayShift || "Off"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          color={getShiftBadgeColor(shift.wednesdayShift)}
                          className="w-fit px-3 rounded-md text-[9px] font-black uppercase"
                        >
                          {shift.wednesdayShift || "Off"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          color={getShiftBadgeColor(shift.thursdayShift)}
                          className="w-fit px-3 rounded-md text-[9px] font-black uppercase"
                        >
                          {shift.thursdayShift || "Off"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          color={getShiftBadgeColor(shift.fridayShift)}
                          className="w-fit px-3 rounded-md text-[9px] font-black uppercase"
                        >
                          {shift.fridayShift || "Off"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Coverage stats */}
        <div className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <ShieldCheck size={20} className="text-emerald-500" /> Coverage
            Metrics
          </h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                <span className="text-gray-400">Morning Shift Coverage</span>
                <span
                  className={
                    mCoverage >= 90 ? "text-emerald-500" : "text-amber-500"
                  }
                >
                  {mCoverage}% {mCoverage >= 90 ? "Optimal" : "Caution"}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  style={{ width: `${mCoverage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                <span className="text-gray-400">Afternoon Shift Coverage</span>
                <span
                  className={
                    aCoverage >= 90 ? "text-blue-500" : "text-amber-500"
                  }
                >
                  {aCoverage}% {aCoverage >= 90 ? "Optimal" : "Caution"}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  style={{ width: `${aCoverage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                <span className="text-gray-400">Night Shift Coverage</span>
                <span
                  className={
                    nCoverage >= 90 ? "text-purple-500" : "text-amber-500"
                  }
                >
                  {nCoverage}% {nCoverage >= 90 ? "Optimal" : "Caution"}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                  style={{ width: `${nCoverage}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-6 border-t space-y-3">
              <p className="text-xs text-gray-400 font-bold leading-relaxed">
                System coverage is evaluated. Ensure backup nodes are on standby
                for sudden rotation request adjustments.
              </p>
              <Button
                color="light"
                size="xs"
                onClick={() =>
                  toast.success("Running AI Optimizer on Roster", {
                    icon: "🤖",
                  })
                }
                className="w-full rounded-md shadow-sm font-black uppercase tracking-widest text-[10px] border-none hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Launch Roster Optimizer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingModule;
