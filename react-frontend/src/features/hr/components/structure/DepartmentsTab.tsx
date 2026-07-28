import React from "react";
import { Badge, Button, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell } from '@/lib/flowbite-compat';
import { Building2, Plus, Trash2 } from "lucide-react";

interface DepartmentsTabProps {
  departments: any[];
  searchQuery: string;
  onAddDepartment: () => void;
  onDeleteDepartment: (id: number) => void;
}

const DepartmentsTab: React.FC<DepartmentsTabProps> = ({
  departments,
  searchQuery,
  onAddDepartment,
  onDeleteDepartment,
}) => {
  const filtered = departments.filter((d) =>
    (d.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div>
          <h4 className="font-black text-sm uppercase dark:text-white">Organization Departments</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Define corporate structure and department nodes</p>
        </div>
        <Button color="blue" size="xs" onClick={onAddDepartment} className="font-black uppercase text-[9px] rounded-lg">
          <Plus size={14} className="mr-1" /> New Department
        </Button>
      </div>

      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Department Name</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Code</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase text-right">Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-xs font-bold text-gray-400 uppercase">
                  No departments found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d, idx) => (
                <TableRow key={d.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase flex items-center gap-2">
                    <Building2 size={16} className="text-blue-500" /> {d.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono font-bold">{d.code || `DEPT-${idx + 101}`}</TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <button onClick={() => onDeleteDepartment(d.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                      <Trash2 size={15} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepartmentsTab;
