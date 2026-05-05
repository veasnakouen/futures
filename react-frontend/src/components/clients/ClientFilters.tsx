import React from 'react';
import { Search } from 'lucide-react';

interface ClientFiltersProps {
  filters: { search: string; branch: string; status: string };
  setFilters: (filters: any) => void;
  setPage: (page: number) => void;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({ filters, setFilters, setPage }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="md:col-span-2 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search name or registration code..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-medium"
        />
      </div>
      <select
        value={filters.branch}
        onChange={(e) => { setFilters({ ...filters, branch: e.target.value }); setPage(0); }}
        className="bg-gray-50 dark:bg-gray-700/50 border-none rounded-lg px-5 py-3 outline-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest"
      >
        <option value="">All Branches</option>
        <option value="Phnom Penh">Phnom Penh</option>
        <option value="Battambang">Battambang</option>
        <option value="Siem Reap">Siem Reap</option>
      </select>
      <select
        value={filters.status}
        onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(0); }}
        className="bg-gray-50 dark:bg-gray-700/50 border-none rounded-lg px-5 py-3 outline-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Pending">Pending</option>
        <option value="Closed">Closed</option>
      </select>
    </div>
  );
};

export default ClientFilters;
