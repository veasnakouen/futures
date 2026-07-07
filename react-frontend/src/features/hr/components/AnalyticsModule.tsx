import React from "react";
import {Button, Badge, Progress} from '@/lib/flowbite-compat';
import {
  Award,
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Download,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AnalyticsModuleProps {
  data: {
    stats: any;
    demographics: any;
    deptDist: any[];
  };
}

const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ data }) => {
  const { stats, demographics, deptDist } = data;

  const COLORS = [
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#f43f5e",
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(deptDist);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Department Distribution",
    );
    XLSX.writeFile(
      workbook,
      `HR_Report_${new Date().toLocaleDateString()}.xlsx`,
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Enterprise HR Analytics Report", 20, 10);
    autoTable(doc, {
      head: [["Department", "Staff Count"]],
      body: deptDist.map((d) => [d.name, d.value]),
    });
    doc.save(`HR_Executive_Report_${new Date().getTime()}.pdf`);
  };

  const ageData = Object.entries(demographics.ageGroups || {}).map(
    ([name, value]) => ({ name, value }),
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Live Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm relative overflow-hidden group hover:shadow-md transition-all border-t-4 border-t-blue-600">
          <Users
            size={80}
            className="absolute -right-4 -bottom-4 opacity-5 text-blue-600"
          />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Headcount
          </p>
          <h4 className="text-4xl font-black dark:text-white mb-2">
            {stats.totalHeadcount || 0}
          </h4>
          <Badge
            color="success"
            className="w-fit rounded-md px-3 py-1 text-[9px] font-black uppercase tracking-widest"
          >
            Live Sync
          </Badge>
        </div>
        <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm border-t-4 border-t-emerald-600">
          <Activity
            size={80}
            className="absolute -right-4 -bottom-4 opacity-5 text-emerald-600"
          />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Active Workforce
          </p>
          <h4 className="text-4xl font-black dark:text-white mb-2">
            {stats.activeEmployees || 0}
          </h4>
          <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
            <TrendingUp size={12} /> Operational Stability
          </div>
        </div>
        <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm border-t-4 border-t-amber-600">
          <Calendar
            size={80}
            className="absolute -right-4 -bottom-4 opacity-5 text-amber-600"
          />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            New Hires (MTD)
          </p>
          <h4 className="text-4xl font-black dark:text-white mb-2">
            +{stats.newHiresThisMonth || 0}
          </h4>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Growth Velocity: Normal
          </p>
        </div>
        <div className="p-8 rounded-md bg-gradient-to-br from-indigo-600 to-blue-800 text-white border-none shadow-md shadow-blue-500/20">
          <TrendingUp
            size={80}
            className="absolute -right-4 -bottom-4 opacity-10"
          />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">
            Turnover Rate
          </p>
          <h4 className="text-4xl font-black mb-4">5.2%</h4>
          <div className="h-1.5 bg-white/20 rounded-md overflow-hidden">
            <div className="h-full bg-white w-[5.2%]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Distribution Chart */}
        <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                Department Distribution
              </h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                Personnel density by division
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md">
              <PieIcon size={20} />
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptDist}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {deptDist.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {deptDist.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-md"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {d.name}: {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Age Demographics */}
        <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                Age Demographics
              </h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                Generational workforce breakdown
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-md">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="h-80 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reporting Command Hub */}
      <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md border-t-8 border-t-indigo-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h4 className="text-2xl font-black dark:text-white uppercase tracking-tight">
              Executive Report Generator
            </h4>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
              Export comprehensive workforce audits in high-fidelity formats
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={exportToExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-md shadow-lg shadow-emerald-500/20 border-none"
            >
              <Download size={16} className="mr-2" /> Export to Excel
            </Button>
            <Button
              onClick={exportToPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-md shadow-lg shadow-blue-500/20 border-none"
            >
              <FileText size={16} className="mr-2" /> Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Workforce Audit 2024",
              size: "2.4 MB",
              type: "PDF",
              icon: <FileText className="text-blue-500" />,
            },
            {
              title: "Financial Load Summary",
              size: "1.1 MB",
              type: "XLSX",
              icon: <TrendingUp className="text-emerald-500" />,
            },
            {
              title: "Department Diversity Pulse",
              size: "840 KB",
              type: "PDF",
              icon: <Users className="text-indigo-500" />,
            },
          ].map((doc, i) => (
            <div
              key={i}
              className="p-6 bg-gray-50 dark:bg-gray-700/40 rounded-md flex items-center gap-4 transition-all cursor-pointer group shadow-sm"
            >
              <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                {doc.icon}
              </div>
              <div className="flex-1">
                <h5 className="font-black dark:text-white text-sm">
                  {doc.title}
                </h5>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  {doc.type} • {doc.size}
                </p>
              </div>
              <Download
                size={16}
                className="text-gray-300 group-hover:text-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;
