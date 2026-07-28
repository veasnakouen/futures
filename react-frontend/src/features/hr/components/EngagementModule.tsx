import React, { useState } from "react";
import { Button, TextInput, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { Smile, Search, Plus, MessageSquare, Award } from "lucide-react";

interface EngagementModuleProps {
  surveys?: any[];
  onAddSurvey?: () => void;
}

const EngagementModule: React.FC<EngagementModuleProps> = ({
  surveys = [],
  onAddSurvey,
}) => {
  const [search, setSearch] = useState("");

  const defaultSurveys = surveys.length > 0 ? surveys : [
    { id: 1, title: "Q2 Employee Satisfaction & Workplace Pulse", responses: 42, score: "4.6 / 5.0", status: "Active" },
    { id: 2, title: "Remote & Hybrid Work Flexibility Feedback", responses: 38, score: "4.8 / 5.0", status: "Completed" },
    { id: 3, title: "Annual Leadership & Team Culture Review", responses: 55, score: "4.5 / 5.0", status: "Completed" },
  ];

  const filtered = defaultSurveys.filter((s) =>
    (s.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-2">
          <Smile size={18} className="text-yellow-500" />
          <h4 className="font-black text-sm uppercase dark:text-white">Employee Engagement & Feedback Pulse</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput sizing="sm" placeholder="Search engagement surveys..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} className="text-xs" />
          </div>
          {onAddSurvey && (
            <Button color="blue" size="xs" onClick={onAddSurvey} className="font-black uppercase text-[10px] rounded-lg">
              <Plus size={14} className="mr-1" /> Launch Pulse Survey
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Survey Title</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Staff Responses</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Satisfaction Score</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {filtered.map((s, idx) => (
              <TableRow key={s.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">{s.title}</TableCell>
                <TableCell className="px-4 py-3 text-xs font-mono font-bold">{s.responses} Submitted</TableCell>
                <TableCell className="px-4 py-3 text-xs font-bold text-emerald-600">{s.score}</TableCell>
                <TableCell className="px-4 py-3"><Badge color="success" className="text-[8px] uppercase">{s.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EngagementModule;
