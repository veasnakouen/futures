import React from "react";
import { Button, TextInput, Select } from "@/lib/flowbite-compat";
import { Search, Plus, Tag, PieChart as PieIcon, LifeBuoy, FileText } from "lucide-react";

interface Props {
  state: any;
}

export default function SupportFiltersBar({ state }: Props) {
  const {
    search,
    setSearch,
    departmentTab,
    setDepartmentTab,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    activeSubTab,
    setActiveSubTab,
    canManageCategories,
    handleOpenCreate,
    setIsManageTypesOpen,
    ticketTypes,
  } = state;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab("TICKETS")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "TICKETS"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <LifeBuoy size={16} /> Helpdesk Tickets
          </button>
          <button
            onClick={() => setActiveSubTab("PIE_ANALYTICS")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "PIE_ANALYTICS"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <PieIcon size={16} /> Analytics & Pie Chart
          </button>
          <button
            onClick={() => setActiveSubTab("EVALUATION")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "EVALUATION"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <FileText size={16} /> Tech Evaluation
          </button>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {canManageCategories && (
            <Button
              color="light"
              onClick={() => setIsManageTypesOpen(true)}
              className="rounded-xl font-black uppercase text-xs tracking-wider"
            >
              <Tag size={16} className="mr-2 text-indigo-600" /> Categories ({ticketTypes.length})
            </Button>
          )}
          <Button
            color="blue"
            onClick={handleOpenCreate}
            className="rounded-xl font-black uppercase text-xs tracking-wider shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} className="mr-2" /> Submit Help Ticket
          </Button>
        </div>
      </div>

      {/* Filter Bar (Only visible when viewing TICKETS) */}
      {activeSubTab === "TICKETS" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="md:col-span-2">
            <TextInput
              icon={Search}
              placeholder="Search tickets by ID, subject, or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="UNASSIGNED">Status: Unassigned Queue</option>
            <option value="ALL">Status: All Tickets</option>
            <option value="OPEN font-bold">Status: Open</option>
            <option value="IN_PROGRESS">Status: In Progress</option>
            <option value="REPLACEMENT_APPROVED">Status: Replacement Approved</option>
            <option value="RESOLVED">Status: Resolved</option>
            <option value="CLOSED">Status: Closed</option>
          </Select>

          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Category: All Categories</option>
            <option value="IT Support">IT Support</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Outreach">Outreach</option>
            <option value="Clinic">Clinic / Medical</option>
            <option value="HR Support">HR Support</option>
          </Select>

          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">Priority: All Priorities</option>
            <option value="LOW">Priority: Low</option>
            <option value="NORMAL">Priority: Normal</option>
            <option value="HIGH">Priority: High</option>
            <option value="URGENT font-bold">Priority: Urgent</option>
          </Select>
        </div>
      )}

      {/* Department Filter Pills */}
      {activeSubTab === "TICKETS" && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
          {[
            { id: "ALL", label: "All Departments" },
            { id: "IT", label: "IT & Network" },
            { id: "MAINTENANCE", label: "Maintenance & HVAC" },
            { id: "OUTREACH", label: "Outreach & Field" },
            { id: "CLINIC", label: "Clinic & Health" },
            { id: "HR", label: "HR & People" },
          ].map((dept) => (
            <button
              key={dept.id}
              onClick={() => setDepartmentTab(dept.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                departmentTab === dept.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
