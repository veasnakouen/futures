import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Avatar, Dropdown, DropdownItem } from '@/lib/flowbite-compat';
import ModernPagination from "@/components/common/ModernPagination";
import { Users, MapPin, Trash2, MoreVertical, LayoutGrid, List, UserPlus, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

interface RecruitmentCandidatesTabProps {
  candidates: any[];
  searchQuery: string;
  onDeleteCandidate: (id: number) => void;
}

const RecruitmentCandidatesTab: React.FC<RecruitmentCandidatesTabProps> = ({
  candidates,
  searchQuery,
  onDeleteCandidate,
}) => {
  const [candidatePage, setCandidatePage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerRow, setItemsPerRow] = useState("4");
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const candidatesPerPage = 10;

  const filteredCandidates = candidates.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.clientCode || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCandidates = filteredCandidates.slice(
    (candidatePage - 1) * candidatesPerPage,
    candidatePage * candidatesPerPage
  );

  const handleToggleRequest = (cId: number) => {
    if (sentRequests.includes(cId)) {
      setSentRequests((prev) => prev.filter((id) => id !== cId));
      toast.success("Request cancelled");
    } else {
      setSentRequests((prev) => [...prev, cId]);
      toast.success("Friend request sent!");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Talent Network</h3>
        <div className="flex items-center gap-3">
          {viewMode === "grid" && (
            <select
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-xs h-9 border-none px-3 font-bold cursor-pointer"
              value={itemsPerRow}
              onChange={(e) => setItemsPerRow(e.target.value)}
            >
              <option value="3">3 per row</option>
              <option value="4">4 per row</option>
              <option value="5">5 per row</option>
            </select>
          )}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden p-0">
          <Table hoverable className="w-full">
            <TableHead className="bg-gray-50 dark:bg-gray-700">
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Node Identity</TableHeadCell>
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Status</TableHeadCell>
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Branch</TableHeadCell>
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase text-right">Action</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y dark:divide-gray-700">
              {paginatedCandidates.map((c) => (
                <TableRow key={c.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar img={c.photo} rounded size="sm" />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs uppercase">{c.firstName} {c.lastName}</span>
                        <span className="text-[9px] text-gray-400 uppercase">{c.clientCode}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3"><Badge color={c.status === "Searching" ? "info" : "success"}>{c.status}</Badge></TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500"><MapPin size={12} className="inline mr-1 text-rose-500" />{c.branch}</TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <button onClick={() => onDeleteCandidate(c.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={15} /></button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className={`grid gap-4 ${itemsPerRow === "3" ? "grid-cols-1 md:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1 md:grid-cols-4"}`}>
          {paginatedCandidates.map((c) => (
            <div key={c.id} className="shadow-sm bg-white dark:bg-gray-800 rounded-md p-4 relative group hover:shadow-md transition-shadow flex flex-col items-center">
              <div className="absolute right-2 top-2">
                <button onClick={() => onDeleteCandidate(c.id)} className="p-1 text-gray-400 hover:text-rose-600"><Trash2 size={16} /></button>
              </div>
              <div className="w-14 h-14 mb-2 rounded-md overflow-hidden ring-2 ring-gray-100 bg-indigo-50 flex items-center justify-center">
                {c.photo ? <img src={c.photo} alt={c.firstName} className="w-full h-full object-cover" /> : <Users size={28} className="text-indigo-600" />}
              </div>
              <h5 className="text-base font-bold dark:text-white text-center">{c.firstName} {c.lastName}</h5>
              <span className="text-[10px] text-gray-400 font-bold uppercase mb-2">{c.clientCode}</span>
              <div className="flex gap-2 mb-3">
                <Badge color={c.status === "Searching" ? "info" : "success"} className="text-[8px] uppercase">{c.status}</Badge>
                <Badge color="gray" className="text-[8px] uppercase">{c.branch}</Badge>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleToggleRequest(c.id)} className={`!p-1.5 text-xs ${sentRequests.includes(c.id) ? "bg-emerald-100 text-emerald-600" : "bg-blue-600 text-white"}`}>
                  <UserPlus size={14} />
                </Button>
                <Button onClick={() => c.email && (window.location.href = `mailto:${c.email}`)} className="!p-1.5 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <MessageSquare size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {filteredCandidates.length > candidatesPerPage && (
        <ModernPagination currentPage={candidatePage} totalPages={Math.ceil(filteredCandidates.length / candidatesPerPage)} onPageChange={setCandidatePage} totalItems={filteredCandidates.length} pageSize={candidatesPerPage} onPageSizeChange={() => {}} />
      )}
    </motion.div>
  );
};

export default RecruitmentCandidatesTab;
