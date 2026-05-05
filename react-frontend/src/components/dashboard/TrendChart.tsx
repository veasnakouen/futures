import React from 'react';
import { Card } from 'flowbite-react';
import { Filter } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TrendChartProps {
  data: any[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 border-none shadow-xl shadow-gray-200/50 dark:shadow-none p-8 rounded-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-black text-gray-900 dark:text-white">Registration Trends</h4>
          <p className="text-sm text-gray-500 font-medium">Monthly new client intake overview</p>
        </div>
        <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
          <Filter size={20}/>
        </button>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold'}} />
            <Tooltip 
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px'}}
              cursor={{stroke: '#3B82F6', strokeWidth: 2}}
            />
            <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TrendChart;
