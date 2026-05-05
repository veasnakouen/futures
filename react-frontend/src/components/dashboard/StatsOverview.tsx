import React from 'react';
import { Card } from 'flowbite-react';
import { Users, TrendingUp, Package, FileBarChart } from 'lucide-react';

interface StatsOverviewProps {
  stats: any;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const items = [
    { label: 'Total Clients', value: stats?.totalClients, icon: <Users />, color: 'blue', link: '/clients' },
    { label: 'Active Placements', value: stats?.activePlacements, icon: <TrendingUp />, color: 'blue', link: '/placements' },
    { label: 'Inventory Assets', value: '128+', icon: <Package />, color: 'blue', link: '/inventory' },
    { label: 'Monthly Reports', value: stats?.monthlyReports, icon: <FileBarChart />, color: 'blue', link: '/reports' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <Card 
          key={idx} 
          onClick={() => item.link && (window.location.href = item.link)} 
          className="dark:bg-gray-800 dark:border-gray-700 border-none shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-lg"
        >
          <div className="flex items-center gap-6">
            <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
              {item.icon}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">{item.value}</p>
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Operational</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
