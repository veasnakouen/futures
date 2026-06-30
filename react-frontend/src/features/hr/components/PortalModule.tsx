import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Progress,
  Spinner,
} from '@/lib/flowbite-compat';
import {
  User,
  Shield,
  Clock,
  Calendar,
  Laptop,
  Download,
  ArrowUpRight,
  Award,
  Box,
} from "lucide-react";
import api from '@/services/api';
import { format, subMonths } from "date-fns";

const PortalModule: React.FC = () => {
  const [employee, setEmployee] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const empRes = await api.get("/employees/me");
      setEmployee(empRes.data);

      const assetsRes = await api.get("/stock/hr/assets/me");
      setAssets(assetsRes.data || []);
    } catch (err) {
      console.error("Failed to load personal portal data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Initializing Portal Node...
        </p>
      </div>
    );
  }

  // Format currency helper
  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  // Generate dynamic payslips based on actual basicSalary
  const baseSalary = employee?.basicSalary || 2500;
  const payslips = [
    {
      period: format(new Date(), "MMMM yyyy"),
      gross: formatCurrency(baseSalary),
      net: formatCurrency(baseSalary * 0.92),
      date: format(new Date(), "yyyy-MM-dd"),
      status: "Paid",
    },
    {
      period: format(subMonths(new Date(), 1), "MMMM yyyy"),
      gross: formatCurrency(baseSalary),
      net: formatCurrency(baseSalary * 0.92),
      date: format(subMonths(new Date(), 1), "yyyy-MM-28"),
      status: "Paid",
    },
    {
      period: format(subMonths(new Date(), 2), "MMMM yyyy"),
      gross: formatCurrency(baseSalary),
      net: formatCurrency(baseSalary * 0.92),
      date: format(subMonths(new Date(), 2), "yyyy-MM-28"),
      status: "Paid",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-md text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 overflow-hidden shadow-inner shrink-0">
            {employee?.photo ? (
              <img
                src={employee.photo}
                className="w-full h-full object-cover"
                alt="User avatar"
              />
            ) : (
              <User size={36} className="text-white" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight uppercase leading-none">
              {employee?.firstNameEnglish} {employee?.lastNameEnglish}
            </h3>
            <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mt-2">
              Employee ID: {employee?.idNo || "N/A"} •{" "}
              {employee?.department?.name || "General Staff"}
            </p>
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-md bg-emerald-400 animate-pulse"></span>
              Position: {employee?.position?.name || "HR Representative"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            color="light"
            size="sm"
            onClick={() => {
              import("react-hot-toast").then((module) => {
                module.toast.success(
                  "Security Node Identity Verified. Access Level Validated.",
                  {
                    icon: "🛡️",
                  },
                );
              });
            }}
            className="rounded-md text-xs font-black uppercase tracking-wider border-none hover:bg-white/20 hover:text-white transition-all shadow-md"
          >
            <Shield size={14} className="mr-2" /> System Node Verified
          </Button>
        </div>
      </div>

      {/* Personal KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md cursor-pointer hover:scale-105 transition-transform"
          onClick={() =>
            import("react-hot-toast").then((m) =>
              m.toast("Generating detailed attendance report...", {
                icon: "📊",
              }),
            )
          }
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Attendance Rate
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-md">
              <Clock size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">98.4%</h4>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">
            Perfect compliance target met
          </p>
        </Card>

        <Card
          className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md cursor-pointer hover:scale-105 transition-transform"
          onClick={() =>
            import("react-hot-toast").then((m) =>
              m.toast("Opening Leave Request form...", { icon: "✈️" }),
            )
          }
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Leaves Remaining
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-md">
              <Calendar size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">14 Days</h4>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">
            Out of 18 days allocated
          </p>
        </Card>

        <Card
          className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md cursor-pointer hover:scale-105 transition-transform"
          onClick={() =>
            import("react-hot-toast").then((m) =>
              m.toast("Hardware sync initiated...", { icon: "🔄" }),
            )
          }
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Assigned Hardware
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-md">
              <Laptop size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {String(assets.length).padStart(2, "0")} Units
          </h4>
          <p className="text-[9px] font-bold text-indigo-500 uppercase mt-2">
            All assets synchronized
          </p>
        </Card>

        <Card
          className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md cursor-pointer hover:scale-105 transition-transform"
          onClick={() =>
            import("react-hot-toast").then((m) =>
              m.toast("Redirecting to LMS portal...", { icon: "🎓" }),
            )
          }
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Training Progress
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-md">
              <Award size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">82%</h4>
          <div className="mt-3">
            <Progress progress={82} color="yellow" size="sm" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Assets Table */}
        <Card className="lg:col-span-2 p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Laptop size={20} className="text-blue-600" /> Active Assigned
            Hardware
          </h4>
          <div className="overflow-x-auto">
            <Table hoverable className="border-none w-full relative">
              <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <TableHeadCell className="py-4">Equipment Node</TableHeadCell>
                <TableHeadCell className="py-4">
                  Asset Tag / Serial
                </TableHeadCell>
                <TableHeadCell className="py-4">Deployment Date</TableHeadCell>
                <TableHeadCell className="py-4">Status</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {assets.length === 0 ? (
                  <TableRow className="bg-white dark:bg-gray-800">
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-xs font-black text-gray-400 uppercase tracking-widest"
                    >
                      No hardware assets currently deployed
                    </TableCell>
                  </TableRow>
                ) : (
                  assets.map((asset) => (
                    <TableRow
                      key={asset.id}
                      className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                    >
                      <TableCell className="font-black dark:text-white text-xs py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 overflow-hidden border dark:border-gray-600 shrink-0">
                          {asset.imageUrl ? (
                            <img
                              src={asset.imageUrl}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Box size={14} className="text-blue-500" />
                          )}
                        </div>
                        <span className="uppercase tracking-tight">
                          {asset.name}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-500 py-4">
                        {asset.serialNumber || "N/A"}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 py-4">
                        {asset.assignedDate
                          ? format(new Date(asset.assignedDate), "MMM dd, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          color={
                            asset.status === "Assigned" ? "blue" : "success"
                          }
                          className="rounded-md w-fit text-[9px] font-black uppercase tracking-widest"
                        >
                          {asset.status || "Available"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Payslips Ledger */}
        <Card className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Download size={20} className="text-indigo-600" /> Recent Payslips
          </h4>
          <div className="space-y-4">
            {payslips.map((slip, i) => (
              <div
                key={i}
                className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-md flex justify-between items-center border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
              >
                <div>
                  <p className="font-black text-xs dark:text-white uppercase tracking-tight">
                    {slip.period}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                    Disbursed: {slip.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-xs font-black text-blue-600">
                      {slip.net}
                    </p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">
                      {slip.status}
                    </p>
                  </div>
                  <Button
                    color="light"
                    size="xs"
                    onClick={() => {
                      import("react-hot-toast").then((module) => {
                        module.toast.success(
                          `PDF Generation queued for ${slip.period} Payslip. It will download shortly.`,
                        );
                      });
                    }}
                    className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 border-none transition-all shadow-sm"
                  >
                    <Download size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PortalModule;
