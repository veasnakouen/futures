import React from "react";
import { TextInput, Select, Button } from '@/lib/flowbite-compat';
import { Search, Filter } from "lucide-react";

interface InventoryFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  categories: string[];
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categories,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-8 border-b dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
      <div className="relative flex-1">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <TextInput
          placeholder="Search item name or SKU code..."
          className="pl-12 rounded-md border-none bg-gray-50 dark:bg-gray-700/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Select
        className="w-56 rounded-md border-none bg-gray-50 dark:bg-gray-700/50"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </Select>
      <Button
        color="gray"
        className="rounded-md px-6 h-12 flex items-center justify-center border-none bg-gray-50 dark:bg-gray-700/50"
      >
        <Filter size={18} className="text-gray-500" />
      </Button>
    </div>
  );
};

export default InventoryFilters;
