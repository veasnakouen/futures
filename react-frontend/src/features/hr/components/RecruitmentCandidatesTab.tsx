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
      `${c.firstName} ${c.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (c.clientCode || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCandidates = filteredCandidates.slice(
    (candidatePage - 1) * candidatesPerPage,
    candidatePage * candidatesPerPage
  );

  return (
    <motion.div
      key="candidates"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
          Talent Network
        </h3>
        <div className="flex items-center gap-3">
          {viewMode === "grid" && (
            <div className="flex-shrink-0">
              <select
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-0 focus:border-transparent transition-all duration-200 text-xs h-9 border-none outline-none px-3 min-w-[100px] font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                value={itemsPerRow}
                onChange={(e) => setItemsPerRow(e.target.value)}
              >
                <option value="3">3 per row</option>
                <option value="4">4 per row</option>
                <option value="5">5 per row</option>
              </select>
            </div>
          )}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden p-0">
          <div className="overflow-x-auto overflow-y-auto custom-scrollbar w-full max-h-[65vh]">
            <Table hoverable className="w-full min-w-[800px] relative">
              <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20 shadow-sm border-b">
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                  Node Identity
                </TableHeadCell>
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                  Status
                </TableHeadCell>
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                  Current Branch
                </TableHeadCell>
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6 text-right">
                  Action
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {paginatedCandidates.map((c) => (
                  <TableRow
                    key={c.id}
                    className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                  >
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar img={c.photo} rounded size="sm" />
                        <div className="flex flex-col">
                          <span className="font-black dark:text-white uppercase tracking-tight">
                            {c.firstName} {c.lastName}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {c.clientCode}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <Badge
                        color={c.status === "Searching" ? "info" : "success"}
                        className="rounded-md px-4 py-1 text-[9px] font-black uppercase tracking-widest"
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <MapPin size={14} className="text-rose-500" />{" "}
                        {c.branch}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4 text-right">
                      <div className="flex justify-end">
                        <Dropdown
                          label={
                            <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                              <MoreVertical size={16} />
                            </div>
                          }
                          arrowIcon={false}
                          inline
                          className="bg-white dark:bg-gray-800 shadow-sm !rounded-md"
                        >
                          <DropdownItem
                            onClick={() => onDeleteCandidate(c.id)}
                            className="font-bold text-xs text-rose-600"
                          >
                            <div className="flex items-center gap-2">
                              <Trash2 size={14} />
                              <span>Purge Record</span>
                            </div>
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className={`grid gap-4 p-4 ${itemsPerRow === "3" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
          {paginatedCandidates.map((c) => (
            <div
              key={c.id}
              className="shadow-sm bg-white dark:bg-gray-800 rounded-md focus-within:z-30 p-4 relative group hover:shadow-md transition-shadow"
            >
              <div className="absolute right-2 top-2">
                <Dropdown
                  inline
                  label={
                    <div className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                      <MoreVertical size={20} />
                    </div>
                  }
                  arrowIcon={false}
                  className="bg-white dark:bg-gray-800 shadow-sm !rounded-md"
                >
                  <DropdownItem
                    onClick={() => onDeleteCandidate(c.id)}
                    className="text-red-500"
                  >
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-2 rounded-md overflow-hidden ring-4 ring-gray-50 dark:ring-gray-700/50 shadow-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  {c.photo ? (
                    <img
                      src={c.photo}
                      alt={c.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users size={32} className="text-indigo-600" />
                  )}
                </div>

                <h5 className="mb-1 text-lg font-black text-gray-900 dark:text-white text-center px-4">
                  {c.firstName} {c.lastName}
                </h5>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-center px-4 mb-2">
                  {c.clientCode}
                </span>

                <div className="flex flex-wrap justify-center gap-2 mb-3 px-4">
                  <Badge
                    color={c.status === "Searching" ? "info" : "success"}
                    className="rounded-md px-3 py-1 font-black text-[8px] uppercase tracking-widest"
                  >
                    {c.status}
                  </Badge>
                  <Badge
                    color="gray"
                    className="rounded-md px-3 py-1 font-black text-[8px] uppercase tracking-widest"
                  >
                    {c.branch}
                  </Badge>
                </div>

                <div className="flex gap-2 mt-0">
                  <Button
                    onClick={() => {
                      if (sentRequests.includes(c.id)) {
                        setSentRequests((prev) =>
                          prev.filter((id) => id !== c.id)
                        );
                        toast.success("Request cancelled");
                      } else {
                        setSentRequests((prev) => [...prev, c.id]);
                        toast.success("Friend request sent!");
                      }
                    }}
                    title={
                      sentRequests.includes(c.id)
                        ? "Cancel request"
                        : "Add friend"
                    }
                    className={`!rounded transition-all w-9 h-9 flex items-center justify-center !p-0 ${sentRequests.includes(c.id) ? "border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "border-blue-600 bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    <UserPlus size={16} />
                  </Button>
                  <Button
                    onClick={() => {
                      if (c.email) {
                        window.location.href = `mailto:${c.email}`;
                      } else {
                        toast.error(
                          "No email address available for this contact"
                        );
                      }
                    }}
                    title="Message"
                    className="!rounded border-blue-500 bg-white hover:bg-blue-50 text-blue-600 transition-all w-9 h-9 flex items-center justify-center !p-0 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
                  >
                    <MessageSquare size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filteredCandidates.length > candidatesPerPage && (
        <div className="mt-8">
          <ModernPagination
            currentPage={candidatePage}
            totalPages={Math.ceil(
              filteredCandidates.length / candidatesPerPage
            )}
            onPageChange={setCandidatePage}
            totalItems={filteredCandidates.length}
            pageSize={candidatesPerPage}
            onPageSizeChange={() => {}}
          />
        </div>
      )}
    </motion.div>
  );
};

export default RecruitmentCandidatesTab;
