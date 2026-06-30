import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Badge,
} from '@/lib/flowbite-compat';
import {
  FileText,
  Download,
  FileSpreadsheet,
  FileIcon,
  Filter,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

const ReportsModule: React.FC = () => {
  const [reports] = useState([
    {
      id: "REP-101",
      name: "Monthly Payroll Summary",
      type: "Financial",
      format: "CSV",
      date: "May 01, 2026",
      size: "2.4 MB",
    },
    {
      id: "REP-102",
      name: "Q1 Employee Attrition",
      type: "HR Analytics",
      format: "PDF",
      date: "Apr 15, 2026",
      size: "5.1 MB",
    },
    {
      id: "REP-103",
      name: "Leave Balance Audit",
      type: "Compliance",
      format: "Excel",
      date: "May 10, 2026",
      size: "1.2 MB",
    },
    {
      id: "REP-104",
      name: "Training Completion Log",
      type: "Development",
      format: "PDF",
      date: "May 12, 2026",
      size: "3.8 MB",
    },
    {
      id: "REP-105",
      name: "Asset Assignment Register",
      type: "Inventory",
      format: "CSV",
      date: "May 18, 2026",
      size: "890 KB",
    },
  ]);

  const handleDownload = (name: string) => {
    toast.success(`Downloading ${name}...`, { icon: "⬇️" });
  };

  const handleGenerate = () => {
    toast.success("Compiling new custom report...", { icon: "⚙️" });
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "csv":
      case "excel":
        return <FileSpreadsheet size={16} className="text-emerald-500" />;
      case "pdf":
        return <FileIcon size={16} className="text-rose-500" />;
      default:
        return <FileText size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Enterprise Reports Hub
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Data Extracts, Compliance Logs & Archival Records
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            color="light"
            size="sm"
            className="rounded-md shadow-sm font-black uppercase tracking-widest text-[10px] transition-all hover:bg-gray-100 dark:hover:bg-gray-700 border-none"
          >
            <Filter size={14} className="mr-2" /> Filter Reports
          </Button>
          <Button
            color="blue"
            size="sm"
            onClick={handleGenerate}
            className="rounded-md shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105"
          >
            <FileText size={14} className="mr-2" /> Generate Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => toast.success("Initializing Payroll Export")}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-md group-hover:scale-110 transition-transform">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">
                Payroll Export
              </h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                Full Cycle CSV
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => toast.success("Generating Audit Log")}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-md group-hover:scale-110 transition-transform">
              <FileIcon size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">
                Compliance Audit
              </h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                Official PDF Record
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => toast.success("Exporting Attendance")}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-md group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">
                Time & Attendance
              </h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                Monthly Timesheets
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => toast.success("Exporting Directory")}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 text-purple-500 rounded-md group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">
                Team Roster
              </h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                Complete HR Matrix
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Ledger */}
      <Card className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
        <h4 className="font-black text-lg dark:text-white flex items-center gap-2 uppercase tracking-tight mb-6">
          <FileText size={20} className="text-blue-600" /> Recent Generated
          Reports
        </h4>

        <div className="overflow-x-auto">
          <Table hoverable className="border-none w-full">
            <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <TableHeadCell className="py-4 w-12"></TableHeadCell>
              <TableHeadCell className="py-4">Report Name</TableHeadCell>
              <TableHeadCell className="py-4">Category</TableHeadCell>
              <TableHeadCell className="py-4">Date Generated</TableHeadCell>
              <TableHeadCell className="py-4">File Size</TableHeadCell>
              <TableHeadCell className="py-4 text-right">Action</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y dark:divide-gray-700">
              {reports.map((report) => (
                <TableRow
                  key={report.id}
                  className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                >
                  <TableCell className="py-4">
                    {getFormatIcon(report.format)}
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="font-black dark:text-white text-xs">
                      {report.name}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                      ID: {report.id} • {report.format}
                    </p>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      color="info"
                      className="w-fit text-[9px] font-black uppercase tracking-widest px-3 rounded-md"
                    >
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs text-gray-500 py-4 uppercase tracking-tight">
                    {report.date}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-400 py-4">
                    {report.size}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <Button
                      size="xs"
                      color="light"
                      onClick={() => handleDownload(report.name)}
                      className="rounded-md shadow-sm font-black uppercase tracking-widest text-[9px] ml-auto"
                    >
                      <Download size={14} className="mr-2 text-blue-500" />{" "}
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsModule;
