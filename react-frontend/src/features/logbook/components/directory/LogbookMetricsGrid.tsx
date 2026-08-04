import React from "react";
import { History, Monitor, Library, Briefcase } from "lucide-react";

interface Props {
  state: any;
}

export default function LogbookMetricsGrid({ state }: Props) {
  const { t, logs } = state;

  const stats = [
    {
      label: t("todayEntries"),
      count: logs.length,
      icon: <History className="text-blue-500" />,
    },
    {
      label: t("computerLab"),
      count: logs.filter((l: any) => l.usingComputer).length,
      icon: <Monitor className="text-emerald-500" />,
    },
    {
      label: t("libraryUse"),
      count: logs.filter((l: any) => l.library).length,
      icon: <Library className="text-orange-500" />,
    },
    {
      label: t("jobGuidance"),
      count: logs.filter((l: any) => l.jobinformation).length,
      icon: <Briefcase className="text-indigo-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-700">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-xl font-black dark:text-white">
                {stat.count}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
