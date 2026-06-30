import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  Badge,
  Button,
} from '@/lib/flowbite-compat';
import {
  TrendingUp,
  Users,
  Activity,
  Calendar,
  DollarSign,
  X,
} from "lucide-react";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <ModalHeader className="border-none p-0" />
      <ModalBody className="p-0 dark:bg-gray-800">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-md shadow-lg">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black dark:text-white leading-tight">
                  Workforce Intelligence
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  Real-time Performance Metrics
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: "Headcount",
                val: "142",
                change: "+4%",
                icon: <Users size={20} />,
                color: "blue",
              },
              {
                label: "Turnover",
                val: "5.2%",
                change: "-1.2%",
                icon: <Activity size={20} />,
                color: "rose",
              },
              {
                label: "Hiring Speed",
                val: "18d",
                change: "-2d",
                icon: <Calendar size={20} />,
                color: "emerald",
              },
              {
                label: "Budget Util",
                val: "92%",
                change: "+5%",
                icon: <DollarSign size={20} />,
                color: "amber",
              },
            ].map((kpi, i) => (
              <div
                key={i}
                className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-md border dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`text-${kpi.color}-600`}>{kpi.icon}</div>
                  <Badge
                    color={kpi.change.startsWith("+") ? "success" : "failure"}
                    size="sm"
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  {kpi.label}
                </p>
                <p className="text-xl font-black dark:text-white tabular-nums">
                  {kpi.val}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Preview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-none bg-gray-50 dark:bg-gray-700/30">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                Staff Growth Curve
              </h4>
              <div className="h-40 flex items-end gap-2 px-2">
                {[30, 45, 35, 60, 55, 80, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-600/20 rounded-t-sm relative group"
                  >
                    <div
                      className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm transition-all"
                      style={{ height: `${h}%` }}
                    ></div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] font-black dark:text-white transition-all">
                      {h}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 px-2 text-[8px] font-black text-gray-400">
                <span>JAN</span>
                <span>MAR</span>
                <span>MAY</span>
                <span>JUL</span>
                <span>SEP</span>
                <span>NOV</span>
              </div>
            </Card>

            <Card className="p-6 border-none bg-gray-50 dark:bg-gray-700/30">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                Department Load
              </h4>
              <div className="space-y-4">
                {[
                  { label: "Operations", val: 75, color: "blue" },
                  { label: "Technical", val: 40, color: "indigo" },
                  { label: "Administration", val: 90, color: "emerald" },
                ].map((d, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                      <span className="dark:text-gray-300">{d.label}</span>
                      <span className="dark:text-white">{d.val}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-md overflow-hidden">
                      <div
                        className={`h-full bg-${d.color}-600`}
                        style={{ width: `${d.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button color="light" onClick={onClose} className="rounded-md h-12">
              Close Dashboard
            </Button>
            <Button
              color="blue"
              onClick={() => (window.location.href = "/reports")}
              className="rounded-md shadow-lg shadow-blue-500/20 font-black uppercase text-[10px]"
            >
              Generate Full Report
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AnalyticsModal;
