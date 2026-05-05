import React from 'react';
import { Card } from 'flowbite-react';
import { Search } from 'lucide-react';

interface VacancyFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const VacancyFilters: React.FC<VacancyFiltersProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <Card className="border-none shadow-sm dark:bg-gray-800 rounded-lg p-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search vacancies, companies, or positions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all text-sm font-medium"
        />
      </div>
    </Card>
  );
};

export default VacancyFilters;
