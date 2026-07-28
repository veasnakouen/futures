import React, { useState, useMemo } from "react";
import { Button, TextInput, Select, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge, Pagination } from '@/lib/flowbite-compat';
import { 
  Users, 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  UserCheck, 
  Clock, 
  Building, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw
} from "lucide-react";

import WorkforceGrid from "./workforce/WorkforceGrid";
import EmployeeDetailModal from "./EmployeeDetailModal";

interface WorkforceDirectoryProps {
  employees?: any[];
  filteredEmployees?: any[];
  search?: string;
  setSearch?: (val: any) => void;
  viewMode?: string;
  setViewMode?: (val: any) => void;
  positions?: any[];
  onRefresh?: () => Promise<void>;
  onImportFromUsers?: () => void;
  onAddEmployee?: () => void;
  onEditEmployee?: (emp: any) => void;
  handleEdit?: (emp: any) => void;
  onDeleteEmployee?: (id: number) => void;
  handleDelete?: (id: number) => void;
  [key: string]: any;
}

const RICH_DEFAULT_EMPLOYEES = [
  {
    id: 1,
    firstName: "Sokha",
    lastName: "Chan",
    firstNameEnglish: "Sokha",
    lastNameEnglish: "Chan",
    clientCode: "EMP-1001",
    status: "Searching",
    branch: "Phnom Penh",
    gender: "Female",
    contactPhone: "012 345 678",
    email: "sokha@company.com",
    departmentName: "Engineering & IT",
    positionName: "Principal Software Architect",
    joinDate: "2021-03-15",
    basicSalary: 2800,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    firstName: "Vandy",
    lastName: "Meas",
    firstNameEnglish: "Vandy",
    lastNameEnglish: "Meas",
    clientCode: "EMP-1002",
    status: "Placed",
    branch: "Siem Reap",
    gender: "Male",
    contactPhone: "011 987 654",
    email: "vandy@company.com",
    departmentName: "Operations & Logistics",
    positionName: "Regional Operations Director",
    joinDate: "2020-08-01",
    basicSalary: 2400,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    firstName: "Bopha",
    lastName: "Khem",
    firstNameEnglish: "Bopha",
    lastNameEnglish: "Khem",
    clientCode: "EMP-1003",
    status: "Searching",
    branch: "Battambang",
    gender: "Female",
    contactPhone: "015 222 333",
    email: "bopha@company.com",
    departmentName: "Human Resources",
    positionName: "Talent Acquisition Lead",
    joinDate: "2022-05-10",
    basicSalary: 1800,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    firstName: "Dara",
    lastName: "Kim",
    firstNameEnglish: "Dara",
    lastNameEnglish: "Kim",
    clientCode: "EMP-1004",
    status: "Active",
    branch: "Phnom Penh",
    gender: "Male",
    contactPhone: "077 888 999",
    email: "dara.kim@mtp.org",
    departmentName: "Finance & Accounting",
    positionName: "Chief Financial Controller",
    joinDate: "2019-11-20",
    basicSalary: 3200,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 5,
    firstName: "Sreymom",
    lastName: "Pich",
    firstNameEnglish: "Sreymom",
    lastNameEnglish: "Pich",
    clientCode: "EMP-1005",
    status: "Active",
    branch: "Phnom Penh",
    gender: "Female",
    contactPhone: "092 111 222",
    email: "sreymom.pich@mtp.org",
    departmentName: "Medical & Health Services",
    positionName: "Senior Medical Specialist",
    joinDate: "2021-09-01",
    basicSalary: 2600,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 6,
    firstName: "Vannak",
    lastName: "Heng",
    firstNameEnglish: "Vannak",
    lastNameEnglish: "Heng",
    clientCode: "EMP-1006",
    status: "On Leave",
    branch: "Sihanoukville",
    gender: "Male",
    contactPhone: "089 444 555",
    email: "vannak.heng@mtp.org",
    departmentName: "Supply Chain & Asset Management",
    positionName: "Supply Chain Coordinator",
    joinDate: "2023-02-14",
    basicSalary: 1600,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 7,
    firstName: "Sophal",
    lastName: "Rith",
    firstNameEnglish: "Sophal",
    lastNameEnglish: "Rith",
    clientCode: "EMP-1007",
    status: "Active",
    branch: "Phnom Penh",
    gender: "Male",
    contactPhone: "012 777 666",
    email: "sophal.rith@mtp.org",
    departmentName: "Engineering & IT",
    positionName: "DevOps & Cloud Engineer",
    joinDate: "2022-08-19",
    basicSalary: 2200,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 8,
    firstName: "Chariya",
    lastName: "Sorn",
    firstNameEnglish: "Chariya",
    lastNameEnglish: "Sorn",
    clientCode: "EMP-1008",
    status: "Active",
    branch: "Siem Reap",
    gender: "Female",
    contactPhone: "093 333 444",
    email: "chariya.sorn@mtp.org",
    departmentName: "Education & LMS",
    positionName: "Academic Program Director",
    joinDate: "2020-04-12",
    basicSalary: 2100,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  },
];

const WorkforceDirectory: React.FC<WorkforceDirectoryProps> = ({
  employees = [],
  filteredEmployees = [],
  onAddEmployee,
  onEditEmployee,
  handleEdit,
  onDeleteEmployee,
  handleDelete,
}) => {
  const actualOnEdit = onEditEmployee || handleEdit || (() => {});
  const actualOnDelete = onDeleteEmployee || handleDelete || (() => {});
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [layoutMode, setLayoutMode] = useState<"grid" | "table">("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Sorting & Pagination States
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [goToPageInput, setGoToPageInput] = useState<string>("");
  const [showColumnToggle, setShowColumnToggle] = useState<boolean>(false);

  // Visible Columns
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    photo: true,
    code: true,
    deptPos: true,
    branch: true,
    contact: true,
    status: true,
    salary: true,
    actions: true,
  });

  // Data List Priority: Real Backend Data > Demo Dataset
  const actualBackendList = (employees && employees.length > 0) ? employees : (filteredEmployees && filteredEmployees.length > 0) ? filteredEmployees : [];
  const rawList = actualBackendList.length > 0 ? actualBackendList : RICH_DEFAULT_EMPLOYEES;

  // Filtered & Sorted Dataset
  const processedEmployees = useMemo(() => {
    return rawList
      .filter((emp) => {
        const fn = emp.firstName || emp.firstNameEnglish || "";
        const ln = emp.lastName || emp.lastNameEnglish || "";
        const code = emp.clientCode || emp.employeeId || emp.idNo || "";
        const dept = emp.departmentName || emp.department?.name || emp.department || "";
        const pos = emp.positionName || emp.position?.name || emp.title || "";
        const br = emp.branch || emp.address || "";
        const st = emp.status || "Active";

        const matchesSearch = `${fn} ${ln} ${code} ${dept} ${pos} ${br}`
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesDept = departmentFilter === "ALL" || dept.toLowerCase().includes(departmentFilter.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || st.toLowerCase().includes(statusFilter.toLowerCase());
        const matchesBranch = branchFilter === "ALL" || br.toLowerCase().includes(branchFilter.toLowerCase());

        return matchesSearch && matchesDept && matchesStatus && matchesBranch;
      })
      .sort((a, b) => {
        let aVal: any = "";
        let bVal: any = "";

        if (sortField === "name") {
          aVal = `${a.firstName || a.firstNameEnglish} ${a.lastName || a.lastNameEnglish}`.toLowerCase();
          bVal = `${b.firstName || b.firstNameEnglish} ${b.lastName || b.lastNameEnglish}`.toLowerCase();
        } else if (sortField === "code") {
          aVal = (a.clientCode || a.employeeId || "").toLowerCase();
          bVal = (b.clientCode || b.employeeId || "").toLowerCase();
        } else if (sortField === "department") {
          aVal = (a.departmentName || a.department?.name || a.department || "").toLowerCase();
          bVal = (b.departmentName || b.department?.name || b.department || "").toLowerCase();
        } else if (sortField === "salary") {
          aVal = Number(a.basicSalary || a.salary || 0);
          bVal = Number(b.basicSalary || b.salary || 0);
        } else if (sortField === "status") {
          aVal = (a.status || "").toLowerCase();
          bVal = (b.status || "").toLowerCase();
        }

        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [rawList, search, departmentFilter, statusFilter, branchFilter, sortField, sortDir]);

  // Pagination Math
  const totalElements = processedEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedEmployees = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * pageSize;
    return processedEmployees.slice(startIdx, startIdx + pageSize);
  }, [processedEmployees, safeCurrentPage, pageSize]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setGoToPageInput("");
    }
  };

  const totalCount = rawList.length;
  const activeCount = rawList.filter(e => (e.status || "Active").toLowerCase().includes("active")).length;
  const leaveCount = rawList.filter(e => (e.status || "").toLowerCase().includes("leave") || (e.status || "").toLowerCase().includes("searching")).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* KPI Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Personnel</p>
            <h4 className="text-2xl font-black dark:text-white mt-1">{totalCount} Members</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Staff</p>
            <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeCount} Duty-Ready</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Transition / Leave</p>
            <h4 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{leaveCount} Pending</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 space-y-3">
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Building size={20} className="text-blue-600" />
            <h4 className="font-black text-base uppercase tracking-tight dark:text-white">Workforce Directory</h4>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
            {/* Search Input */}
            <div className="w-56 relative">
              <TextInput
                sizing="sm"
                placeholder="Search personnel..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                icon={Search}
                className="text-xs"
              />
            </div>

            {/* Department Filter */}
            <div className="w-40">
              <Select
                className="text-xs"
                value={departmentFilter}
                onChange={(e: any) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Depts</option>
                <option value="Engineering">Engineering & IT</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Medical">Medical & Health</option>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="w-32">
              <Select
                className="text-xs"
                value={statusFilter}
                onChange={(e: any) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Searching">Searching</option>
                <option value="Leave">On Leave</option>
              </Select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl border border-gray-200/60 dark:border-gray-700">
              <button
                onClick={() => setLayoutMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${layoutMode === "grid" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setLayoutMode("table")}
                className={`p-1.5 rounded-lg transition-all ${layoutMode === "table" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="Table View"
              >
                <List size={16} />
              </button>
            </div>

            {/* Column Toggle Dropdown */}
            {layoutMode === "table" && (
              <div className="relative">
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="p-2 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200/60 dark:border-gray-700 flex items-center gap-1.5 text-xs font-bold"
                >
                  <Columns size={14} />
                  <span>Cols</span>
                </button>

                {showColumnToggle && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-3 z-30 space-y-2 text-xs">
                    <p className="font-black text-gray-400 uppercase tracking-widest text-[9px] border-b pb-1">Toggle Columns</p>
                    {Object.keys(visibleCols).map((colKey) => (
                      <label key={colKey} className="flex items-center gap-2 font-bold cursor-pointer dark:text-gray-200 uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={visibleCols[colKey]}
                          onChange={(e) => setVisibleCols((prev) => ({ ...prev, [colKey]: e.target.checked }))}
                          className="rounded text-blue-600"
                        />
                        {colKey}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {onAddEmployee && (
              <Button color="blue" size="xs" onClick={onAddEmployee} className="font-black uppercase text-[10px] tracking-wider rounded-xl shadow-xs py-2">
                <Plus size={14} className="mr-1" /> Onboard Staff
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Directory Content */}
      {layoutMode === "grid" ? (
        <WorkforceGrid
          employees={paginatedEmployees}
          searchQuery=""
          onSelectEmployee={(emp) => setSelectedEmployee(emp)}
          onEditEmployee={actualOnEdit}
          onDeleteEmployee={actualOnDelete}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm overflow-hidden space-y-3">
          <div className="overflow-x-auto">
            <Table hoverable className="w-full text-left text-xs">
              <TableHead className="bg-gray-50/70 dark:bg-gray-700/50 text-[10px] uppercase font-black tracking-widest text-gray-400 select-none">
                <TableRow>
                  {visibleCols.photo && (
                    <TableHeadCell
                      onClick={() => handleSort("name")}
                      className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Personnel Member</span>
                        {sortField === "name" ? (
                          sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : <ArrowUpDown size={12} />}
                      </div>
                    </TableHeadCell>
                  )}

                  {visibleCols.code && (
                    <TableHeadCell
                      onClick={() => handleSort("code")}
                      className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Employee ID</span>
                        {sortField === "code" ? (
                          sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : <ArrowUpDown size={12} />}
                      </div>
                    </TableHeadCell>
                  )}

                  {visibleCols.deptPos && (
                    <TableHeadCell
                      onClick={() => handleSort("department")}
                      className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Department & Position</span>
                        {sortField === "department" ? (
                          sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : <ArrowUpDown size={12} />}
                      </div>
                    </TableHeadCell>
                  )}

                  {visibleCols.branch && <TableHeadCell className="py-4 px-6">Branch Office</TableHeadCell>}

                  {visibleCols.salary && (
                    <TableHeadCell
                      onClick={() => handleSort("salary")}
                      className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Salary Rate</span>
                        {sortField === "salary" ? (
                          sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : <ArrowUpDown size={12} />}
                      </div>
                    </TableHeadCell>
                  )}

                  {visibleCols.status && (
                    <TableHeadCell
                      onClick={() => handleSort("status")}
                      className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        {sortField === "status" ? (
                          sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : <ArrowUpDown size={12} />}
                      </div>
                    </TableHeadCell>
                  )}

                  {visibleCols.actions && <TableHeadCell className="py-4 px-6 text-right">Actions</TableHeadCell>}
                </TableRow>
              </TableHead>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {paginatedEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-gray-400 font-bold uppercase text-xs">
                      No matching records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEmployees.map((emp) => {
                    const fn = emp.firstName || emp.firstNameEnglish || "Staff";
                    const ln = emp.lastName || emp.lastNameEnglish || "Member";
                    const dept = emp.departmentName || emp.department?.name || emp.department || "General";
                    const pos = emp.positionName || emp.position?.name || emp.title || "Staff Member";
                    const empCode = emp.clientCode || emp.employeeId || `EMP-${1000 + emp.id}`;
                    const sal = emp.basicSalary || emp.salary || 1800;

                    return (
                      <TableRow key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                        {visibleCols.photo && (
                          <TableCell className="py-4 px-6 font-bold dark:text-white">
                            <div className="flex items-center gap-3">
                              <img
                                src={emp.photo || emp.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                                alt={`${fn} ${ln}`}
                                className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700 cursor-pointer"
                                onClick={() => setSelectedEmployee(emp)}
                              />
                              <div>
                                <p
                                  className="font-black text-sm text-gray-900 dark:text-white hover:text-blue-600 transition-colors cursor-pointer uppercase"
                                  onClick={() => setSelectedEmployee(emp)}
                                >
                                  {fn} {ln}
                                </p>
                                <p className="text-[10px] text-gray-400 font-mono">{emp.email || `${fn.toLowerCase()}@mtp.org`}</p>
                              </div>
                            </div>
                          </TableCell>
                        )}

                        {visibleCols.code && <TableCell className="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">{empCode}</TableCell>}

                        {visibleCols.deptPos && (
                          <TableCell className="py-4 px-6">
                            <p className="font-black text-gray-800 dark:text-gray-200 uppercase">{pos}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{dept}</p>
                          </TableCell>
                        )}

                        {visibleCols.branch && <TableCell className="py-4 px-6 text-gray-600 dark:text-gray-400 font-bold">{emp.branch || "Phnom Penh HQ"}</TableCell>}

                        {visibleCols.salary && (
                          <TableCell className="py-4 px-6 font-mono font-black text-emerald-600 dark:text-emerald-400">
                            ${Number(sal).toLocaleString()}
                          </TableCell>
                        )}

                        {visibleCols.status && (
                          <TableCell className="py-4 px-6">
                            <Badge color={(emp.status || "Active").toLowerCase().includes("active") ? "success" : "warning"} className="text-[9px] uppercase tracking-wider font-black">
                              {emp.status || "Active"}
                            </Badge>
                          </TableCell>
                        )}

                        {visibleCols.actions && (
                          <TableCell className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="xs" color="light" onClick={() => setSelectedEmployee(emp)} className="p-1.5 rounded-lg" title="View Full Dossier">
                                <ExternalLink size={14} className="text-blue-500" />
                              </Button>
                              <Button size="xs" color="light" onClick={() => actualOnEdit(emp)} className="p-1.5 rounded-lg" title="Edit Record">
                                <Edit3 size={14} className="text-emerald-500" />
                              </Button>
                              <Button size="xs" color="light" onClick={() => actualOnDelete(emp.id)} className="p-1.5 rounded-lg" title="Decommission">
                                <Trash2 size={14} className="text-rose-500" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination & Page Controls Bar */}
      <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>
            Showing <strong className="text-gray-900 dark:text-white">{(safeCurrentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-gray-900 dark:text-white">{Math.min(safeCurrentPage * pageSize, totalElements)}</strong> of{" "}
            <strong className="text-gray-900 dark:text-white">{totalElements}</strong> personnel records
          </span>

          {/* Rows Per Page Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-black text-gray-400">Page Size:</span>
            <Select
              className="text-xs py-1 px-2"
              value={pageSize}
              onChange={(e: any) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Go To Page Input */}
          <form onSubmit={handleGoToPage} className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-black text-gray-400">Go to:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={goToPageInput}
              onChange={(e) => setGoToPageInput(e.target.value)}
              placeholder={`${safeCurrentPage}`}
              className="w-12 h-8 text-center text-xs font-bold bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white"
            />
            <Button size="xs" color="light" type="submit" className="h-8 font-black uppercase text-[9px]">Go</Button>
          </form>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-1">
            <Button
              size="xs"
              color="light"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 p-2 rounded-lg"
            >
              <ChevronLeft size={14} />
            </Button>

            <span className="px-3 py-1 font-mono font-black text-xs text-gray-900 dark:text-white">
              {safeCurrentPage} / {totalPages}
            </span>

            <Button
              size="xs"
              color="light"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 p-2 rounded-lg"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Full 6-Tab Staff Profile Detail Modal */}
      <EmployeeDetailModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default WorkforceDirectory;
