"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import WorkforceDirectory from "@/features/hr/components/WorkforceDirectory";

export default function DirectoryPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [contractFilter, setContractFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { data, isLoading: queryLoading } = useQuery({
    queryKey: [
      "employees",
      search,
      deptFilter,
      statusFilter,
      contractFilter,
      currentPage,
      pageSize,
    ],
    queryFn: async () => {
      const response = await api.get(`/employees`, {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: search,
          dept: deptFilter,
          status: statusFilter,
          contract: contractFilter,
        },
      });
      return response.data;
    },
  });

  const employees = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const stats = {
    total: totalElements,
    active: Array.isArray(employees) ? employees.filter((e) => e?.status === "Active").length : 0,
    probation: Array.isArray(employees) ? employees.filter((e) => e?.status === "Probation").length : 0,
    fullTime: Array.isArray(employees) ? employees.filter((e) => e?.contractType === "Full-Time").length : 0,
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "success";
      case "on leave": return "warning";
      case "terminated": return "failure";
      default: return "info";
    }
  };

  // Stubs for modal actions since we haven't migrated modals yet
  const handleEdit = (emp: any) => console.log("Edit", emp);
  const handleDelete = (id: number) => console.log("Delete", id);
  const handleViewDetails = (emp: any) => console.log("View", emp);

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">បុគ្គលិក និងការិយាល័យ / Employees & Departments</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          WORKFORCE DIRECTORY AND PERSONNEL MANAGEMENT
        </p>
      </div>

      <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl p-6 shadow-sm overflow-hidden">
        <WorkforceDirectory
          search={search}
          setSearch={setSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          deptFilter={deptFilter}
          setDeptFilter={setDeptFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          contractFilter={contractFilter}
          setContractFilter={setContractFilter}
          stats={stats}
          loading={queryLoading}
          filteredEmployees={employees}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleViewDetails={handleViewDetails}
          getStatusColor={getStatusColor}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onRefresh={() => queryClient.invalidateQueries({ queryKey: ["employees"] })}
        />
      </div>
    </div>
  );
}
