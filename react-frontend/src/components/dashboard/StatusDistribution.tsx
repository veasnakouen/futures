import React from 'react';
import { Card } from 'flowbite-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface StatusDistributionProps {
  data: any[];
  total: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const StatusDistribution: React.FC<StatusDistributionProps> = ({ data, total }) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 border-none shadow-xl shadow-gray-200/50 dark:shadow-none p-8 rounded-lg">
      <h4 className="text-xl font-black text-gray-900 dark:text-white mb-8">Client Status</h4>
      <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={10}
              dataKey="value"
            >
              {data?.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-4xl font-black text-gray-900 dark:text-white">{total}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate</p>
        </div>
      </div>
      <div className="mt-8 space-y-4">
         {data?.map((item: any, idx: number) => (
           <div key={idx} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                 <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.name}</span>
              </div>
              <span className="text-sm font-black text-gray-900 dark:text-white">{item.value}</span>
           </div>
         ))}
      </div>
    </Card>
  );
};

export default StatusDistribution;
