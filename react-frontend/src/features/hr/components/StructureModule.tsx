import React, { useState } from "react";
import { Button, TextInput } from '@/lib/flowbite-compat';
import { Building2, Search, Plus } from "lucide-react";

import DepartmentsTab from "./structure/DepartmentsTab";

interface StructureModuleProps {
  departments?: any[];
  employees?: any;
  positions?: any[];
  onAddDepartment?: () => void;
  onDeleteDepartment?: (id: number) => void;
  [key: string]: any;
}

const StructureModule: React.FC<StructureModuleProps> = ({
  departments = [],
  onAddDepartment,
  onDeleteDepartment,
}) => {
  const [search, setSearch] = useState("");

  const defaultDepts = departments.length > 0 ? departments : [
    { id: 1, name: "Engineering & IT", code: "DEPT-ENG" },
    { id: 2, name: "Human Resources & Recruitment", code: "DEPT-HR" },
    { id: 3, name: "Point of Sale & Retail Operations", code: "DEPT-POS" },
    { id: 4, name: "Clinic & Hospital Systems", code: "DEPT-CLINIC" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-2">
          <Building2 size={18} className="text-blue-600" />
          <h4 className="font-black text-sm uppercase dark:text-white">Organization Structure</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput
              sizing="sm"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      <DepartmentsTab
        departments={defaultDepts}
        searchQuery={search}
        onAddDepartment={onAddDepartment || (() => {})}
        onDeleteDepartment={onDeleteDepartment || (() => {})}
      />
    </div>
  );
};

export default StructureModule;
