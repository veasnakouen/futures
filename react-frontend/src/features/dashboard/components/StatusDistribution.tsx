import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import ScrollReveal from "./ScrollReveal";

interface StatusDistributionProps {
  data: any[];
  total: number;
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const StatusDistribution: React.FC<StatusDistributionProps> = ({
  data,
  total,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollReveal
      className="h-full"
      animation="fade-in-up"
      delay={200}
      duration={600}
      triggerOnce={true}
    >
      <div className="h-full flex flex-col bg-white dark:bg-gray-800/40 dark:backdrop-blur-md border border-gray-100 dark:border-gray-800/80 p-8 rounded-md shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Client Status
          </h4>
          <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 px-2.5 py-0.5 rounded-md font-bold">
            {total} Total
          </span>
        </div>

        {/* Render solid PieChart centered */}
        <div className="h-[300px] w-full flex items-center justify-center relative shrink-0">
          {isMounted ? (
            <PieChart width={280} height={280}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {data?.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.05)",
                }}
                wrapperClassName="dark:!bg-gray-800/80 dark:!border-gray-700/50 dark:backdrop-blur-md"
              />
            </PieChart>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-md animate-spin"></span>
            </div>
          )}
        </div>

        <div className="flex-1 mt-8 space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {data?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 border border-gray-50 dark:border-transparent hover:border-gray-100 dark:hover:border-gray-700/50 rounded-md transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></div>
                <span className="text-xs font-black text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 uppercase tracking-widest transition-colors duration-200">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-black text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-sm border border-gray-100/50 dark:border-gray-700/50 group-hover:shadow group-hover:border-blue-500/20 transition-all duration-200">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default StatusDistribution;
