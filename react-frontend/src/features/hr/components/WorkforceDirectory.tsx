import React from "react";
import {
  Card,
  TextInput,
  Select,
  Badge,
  Spinner,
  Button,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Checkbox,
} from '@/lib/flowbite-compat';
import ModernPagination from '@/components/common/ModernPagination';
import {
  Search,
  LayoutGrid,
  List,
  TrendingUp,
  Users,
  Edit3,
  Trash2,
  ChevronRight,
  MoreVertical,
  Briefcase,
  X,
  UserPlus,
  Filter,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppCard } from '@/components/ui/AppCard';

interface WorkforceDirectoryProps {
  search: string;
  setSearch: (val: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  deptFilter: string;
  setDeptFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  contractFilter: string;
  setContractFilter: (val: string) => void;
  stats: any;
  loading: boolean;
  filteredEmployees: any[];
  handleEdit: (emp: any) => void;
  handleDelete: (id: number) => void;
  handleViewDetails: (emp: any) => void;
  getStatusColor: (status: string) => any;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onRefresh?: () => void;
  onImportFromUsers?: () => void;
}

const WorkforceDirectory: React.FC<WorkforceDirectoryProps> = ({
  search,
  setSearch,
  viewMode,
  setViewMode,
  deptFilter,
  setDeptFilter,
  statusFilter,
  setStatusFilter,
  contractFilter,
  setContractFilter,
  stats,
  loading,
  filteredEmployees,
  handleEdit,
  handleDelete,
  handleViewDetails,
  getStatusColor,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onRefresh,
  onImportFromUsers,
}) => {
  const { t } = useTranslation();

  const [gridDensity, setGridDensity] = React.useState<
    "large" | "medium" | "compact"
  >("medium");
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>([
    "id",
    "position",
    "dept",
    "contact",
    "status",
    "action",
  ]);

  const getGridClass = () => {
    switch (gridDensity) {
      case "large":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";
      case "compact":
        return "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, position, or email..."
              className="block w-full text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm h-12 pl-12 pr-10 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
            <select
              className="bg-transparent text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm h-12 border border-gray-200 dark:border-gray-700 px-4 min-w-[140px]"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="" className="dark:bg-gray-800">
                All Depts
              </option>
              <option value="IT" className="dark:bg-gray-800">
                IT & Systems
              </option>
              <option value="Social" className="dark:bg-gray-800">
                Social Work
              </option>
              <option value="Admin" className="dark:bg-gray-800">
                Administration
              </option>
              <option value="Finance" className="dark:bg-gray-800">
                Financial
              </option>
            </select>

            <select
              className="bg-transparent text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm h-12 border border-gray-200 dark:border-gray-700 px-4 min-w-[140px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="" className="dark:bg-gray-800">
                Any Status
              </option>
              <option value="Active" className="dark:bg-gray-800">
                Active
              </option>
              <option value="Probation" className="dark:bg-gray-800">
                Probation
              </option>
              <option value="On Leave" className="dark:bg-gray-800">
                On Leave
              </option>
              <option value="Terminated" className="dark:bg-gray-800">
                Terminated
              </option>
            </select>

            <select
              className="bg-transparent text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm h-12 border border-gray-200 dark:border-gray-700 px-4 min-w-[140px]"
              value={contractFilter}
              onChange={(e) => setContractFilter(e.target.value)}
            >
              <option value="" className="dark:bg-gray-800">
                Any Contract
              </option>
              <option value="Full-Time" className="dark:bg-gray-800">
                Full-Time
              </option>
              <option value="Part-Time" className="dark:bg-gray-800">
                Part-Time
              </option>
              <option value="Contractor" className="dark:bg-gray-800">
                Contractor
              </option>
              <option value="Intern" className="dark:bg-gray-800">
                Intern
              </option>
            </select>

            <div className="flex items-center gap-2">
              {viewMode === "list" && (
                <Dropdown
                  inline
                  label={
                    <div className="flex items-center gap-2 px-3 py-1.5 h-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer">
                      <Filter size={14} className="text-blue-500" />
                      <span className="font-bold hidden sm:block">Columns</span>
                    </div>
                  }
                  arrowIcon={false}
                >
                  {[
                    "id",
                    "position",
                    "dept",
                    "contact",
                    "status",
                    "action",
                  ].map((col) => (
                    <DropdownItem
                      key={col}
                      onClick={() =>
                        setVisibleColumns((prev) =>
                          prev.includes(col)
                            ? prev.filter((c) => c !== col)
                            : [...prev, col],
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={visibleColumns.includes(col)}
                          readOnly
                          className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="capitalize text-xs font-bold">
                          {col}
                        </span>
                      </div>
                    </DropdownItem>
                  ))}
                </Dropdown>
              )}
              {viewMode === "grid" && (
                <Dropdown
                  inline
                  label={
                    <div className="flex items-center gap-2 px-3 py-1.5 h-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer">
                      <LayoutGrid size={14} className="text-indigo-500" />
                      <span className="font-bold hidden sm:block">
                        Grid Size
                      </span>
                    </div>
                  }
                  arrowIcon={false}
                >
                  <DropdownItem
                    onClick={() => setGridDensity("large")}
                    className={
                      gridDensity === "large"
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold"
                        : ""
                    }
                  >
                    Large (3 per row)
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => setGridDensity("medium")}
                    className={
                      gridDensity === "medium"
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold"
                        : ""
                    }
                  >
                    Medium (4 per row)
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => setGridDensity("compact")}
                    className={
                      gridDensity === "compact"
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold"
                        : ""
                    }
                  >
                    Compact (5 per row)
                  </DropdownItem>
                </Dropdown>
              )}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1 h-10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {onImportFromUsers && (
              <button
                onClick={onImportFromUsers}
                className="flex items-center gap-2 h-12 px-4 text-sm font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700/50 rounded-md hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all duration-200 whitespace-nowrap"
              >
                <UserPlus size={16} />
                Import from Users
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide no-scrollbar animate-fade-in text-sm font-medium">
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="w-2 h-2 rounded-md bg-emerald-500 animate-pulse"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {stats.active} Active Personnel
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="w-2 h-2 rounded-md bg-amber-500"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {stats.probation} In Probation
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="w-2 h-2 rounded-md bg-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {stats.fullTime} Full-Time Core
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
          <TrendingUp size={16} className="text-blue-500" />
          <p className="text-blue-500 font-semibold">
            {stats.total} Total Records
          </p>
        </div>
      </div>

      {loading && filteredEmployees.length === 0 ? (
        <div className="flex justify-center py-24">
          <Spinner size="xl" />
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="py-32 text-center bg-white dark:bg-gray-800 rounded-md shadow-sm border border-dashed dark:border-gray-700 animate-fade-in">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-center mx-auto mb-6">
            <Users size={40} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">
            Personnel Node Offline
          </h3>
          <p className="text-sm font-bold text-gray-400 mt-2 max-w-sm mx-auto">
            The workforce directory is currently empty. Execute the 'Onboard
            Staff' protocol or seed the database to initialize personnel
            records.
          </p>
          <Button
            color="blue"
            onClick={() => onRefresh?.()}
            className="mt-8 mx-auto rounded-md px-8 font-black uppercase text-[10px] h-12 shadow-lg shadow-blue-500/20"
          >
            Reload Directory
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className={getGridClass()}>
              {filteredEmployees.map((emp) => (
                <AppCard
                  key={emp.id}
                  statusColor={
                    emp.status === "Active" ||
                    emp.status?.toLowerCase() === "active"
                      ? "emerald"
                      : "amber"
                  }
                  headerLeft={
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {emp.photo ? (
                          <Avatar
                            img={emp.photo}
                            rounded
                            size="md"
                            className="ring-2 ring-gray-100 dark:ring-gray-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-2 ring-gray-100 dark:ring-gray-700">
                            <Users size={20} className="text-gray-400" />
                          </div>
                        )}
                        {emp.status === "Active" && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-gray-800 rounded-full z-10"></div>
                        )}
                      </div>
                    </div>
                  }
                  headerRight={
                    <Badge
                      color={
                        emp.status === "Active" ||
                        emp.status?.toLowerCase() === "active"
                          ? "success"
                          : "warning"
                      }
                      className="rounded-md px-3 py-1 text-[9px] font-black uppercase tracking-widest"
                    >
                      {emp.status || "Active"}
                    </Badge>
                  }
                  actions={
                    <>
                      <DropdownItem
                        onClick={() => {
                          setTimeout(() => handleViewDetails(emp), 0);
                        }}
                        className="rounded-md mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-md group-hover/item:scale-110 transition-transform">
                            <ChevronRight size={14} />
                          </div>
                          <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                            {t("open_portal")}
                          </span>
                        </div>
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setTimeout(() => handleEdit(emp), 0);
                        }}
                        className="rounded-md mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-md group-hover/item:scale-110 transition-transform">
                            <Edit3 size={14} />
                          </div>
                          <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                            {t("edit_record")}
                          </span>
                        </div>
                      </DropdownItem>
                      <DropdownDivider className="my-1 border-gray-100 dark:border-gray-700" />
                      <DropdownItem
                        onClick={() => {
                          setTimeout(() => handleDelete(emp.id), 0);
                        }}
                        className="rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-md group-hover/item:scale-110 transition-transform">
                            <Trash2 size={14} />
                          </div>
                          <span className="font-bold text-xs text-rose-600">
                            {t("decommission")}
                          </span>
                        </div>
                      </DropdownItem>
                    </>
                  }
                >
                  <div
                    className="flex flex-col gap-2 mt-2 cursor-pointer"
                    onClick={() => handleViewDetails(emp)}
                  >
                    <h4 className="text-lg font-black dark:text-white line-clamp-1">
                      {emp.firstNameEnglish} {emp.lastNameEnglish}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {emp.positionName ||
                        emp.position?.name ||
                        emp.position ||
                        "Staff"}
                    </p>

                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mt-2">
                      <Briefcase size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {emp.contractType || "Full-Time"}
                      </span>
                    </div>

                    <div className="bg-gray-50/50 dark:bg-gray-700/30 p-4 rounded-sm border dark:border-gray-700/50 mt-4">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        ID & Dept
                      </p>
                      <p className="text-xs font-bold dark:text-gray-300">
                        {emp.idNo || "No ID"} •{" "}
                        {emp.departmentName ||
                          emp.department?.name ||
                          emp.department ||
                          "DEP"}
                      </p>
                    </div>
                  </div>
                </AppCard>
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-sm dark:bg-gray-800 overflow-visible rounded-md p-0 w-full">
              <div className="w-full overflow-visible">
                <Table
                  hoverable
                  className="border-none w-full min-w-[800px] relative"
                >
                  <TableHead className="bg-gray-50/90 dark:bg-gray-700/90 text-[10px] font-black uppercase tracking-widest text-gray-400 sticky top-0 z-[1] backdrop-blur-md shadow-sm border-b dark:border-gray-700">
                    <TableHeadCell className="px-8 py-5">
                      Personnel
                    </TableHeadCell>
                    {visibleColumns.includes("id") && (
                      <TableHeadCell className="px-8 py-5">ID</TableHeadCell>
                    )}
                    {visibleColumns.includes("position") && (
                      <TableHeadCell className="px-8 py-5">
                        Position
                      </TableHeadCell>
                    )}
                    {visibleColumns.includes("dept") && (
                      <TableHeadCell className="px-8 py-5">Dept</TableHeadCell>
                    )}
                    {visibleColumns.includes("contact") && (
                      <TableHeadCell className="px-8 py-5">
                        Contact
                      </TableHeadCell>
                    )}
                    {visibleColumns.includes("status") && (
                      <TableHeadCell className="px-8 py-5">
                        Status
                      </TableHeadCell>
                    )}
                    {visibleColumns.includes("action") && (
                      <TableHeadCell className="px-8 py-5 text-right">
                        Action
                      </TableHeadCell>
                    )}
                  </TableHead>
                  <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredEmployees.map((emp) => (
                      <TableRow
                        key={emp.id}
                        className="relative bg-white dark:bg-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors hover:z-[2] focus-within:z-[2]"
                      >
                        <TableCell className="px-8 py-5 min-w-[250px] max-w-[350px]">
                          <div
                            className="flex items-center gap-4 overflow-hidden group/avatar cursor-pointer"
                            onClick={() => handleViewDetails(emp)}
                          >
                            <div className="relative shrink-0">
                              <Avatar
                                img={emp.photo}
                                rounded
                                size="md"
                                className="transition-all duration-300 group-hover/avatar:scale-110 ring-2 ring-gray-100 dark:ring-gray-700 group-hover/avatar:ring-blue-200 dark:group-hover/avatar:ring-blue-900"
                              />
                              {emp.status === "Active" && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-gray-800 rounded-full z-10"></div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <p
                                className="text-sm font-black text-gray-900 dark:text-white truncate transition-colors group-hover/avatar:text-blue-600 dark:group-hover/avatar:text-blue-400"
                                title={`${emp.firstNameEnglish} ${emp.lastNameEnglish}`}
                              >
                                {emp.firstNameEnglish} {emp.lastNameEnglish}
                              </p>
                              <p
                                className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate mt-0.5"
                                title={
                                  emp.positionName ||
                                  emp.position?.name ||
                                  emp.position ||
                                  "Staff"
                                }
                              >
                                {emp.positionName ||
                                  emp.position?.name ||
                                  emp.position ||
                                  "Staff"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        {visibleColumns.includes("id") && (
                          <TableCell
                            className="px-8 py-5 font-mono text-xs font-bold text-gray-500 max-w-[120px] truncate"
                            title={emp.idNo}
                          >
                            {emp.idNo}
                          </TableCell>
                        )}
                        {visibleColumns.includes("position") && (
                          <TableCell
                            className="px-8 py-5 text-xs font-bold dark:text-gray-400 max-w-[150px] truncate"
                            title={
                              emp.positionName ||
                              emp.position?.name ||
                              emp.position ||
                              "N/A"
                            }
                          >
                            {emp.positionName ||
                              emp.position?.name ||
                              emp.position ||
                              "N/A"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("dept") && (
                          <TableCell
                            className="px-8 py-5 text-xs font-bold dark:text-gray-400 max-w-[150px] truncate"
                            title={
                              emp.departmentName ||
                              emp.department?.name ||
                              emp.department ||
                              "N/A"
                            }
                          >
                            {emp.departmentName ||
                              emp.department?.name ||
                              emp.department ||
                              "N/A"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("contact") && (
                          <TableCell
                            className="px-8 py-5 text-xs text-gray-500 max-w-[150px] truncate"
                            title={emp.email || emp.phoneNumber || "N/A"}
                          >
                            {emp.email || emp.phoneNumber || "N/A"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("status") && (
                          <TableCell className="px-8 py-5">
                            <Badge
                              color={getStatusColor(emp.status)}
                              className="rounded-md shrink-0"
                            >
                              {emp.status}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleColumns.includes("action") && (
                          <TableCell className="px-8 py-5 text-right">
                            <div className="flex justify-end">
                              <Dropdown
                                placement="bottom-end"
                                label={
                                  <div className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-gray-400 hover:text-blue-600 cursor-pointer">
                                    <MoreVertical size={18} />
                                  </div>
                                }
                                arrowIcon={false}
                                inline
                                className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl !rounded-2xl p-2 min-w-[180px]"
                              >
                                <DropdownItem
                                  onClick={() => {
                                    setTimeout(() => handleViewDetails(emp), 0);
                                  }}
                                  className="rounded-xl mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
                                >
                                  <div className="flex items-center gap-3 py-1">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-full group-hover/item:scale-110 transition-transform">
                                      <ChevronRight size={14} />
                                    </div>
                                    <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                      {t("open_portal")}
                                    </span>
                                  </div>
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => {
                                    setTimeout(() => handleEdit(emp), 0);
                                  }}
                                  className="rounded-xl mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
                                >
                                  <div className="flex items-center gap-3 py-1">
                                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full group-hover/item:scale-110 transition-transform">
                                      <Edit3 size={14} />
                                    </div>
                                    <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                      {t("edit_record")}
                                    </span>
                                  </div>
                                </DropdownItem>
                                <DropdownDivider className="my-1 border-gray-100 dark:border-gray-700" />
                                <DropdownItem
                                  onClick={() => {
                                    setTimeout(() => handleDelete(emp.id), 0);
                                  }}
                                  className="rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
                                >
                                  <div className="flex items-center gap-3 py-1">
                                    <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-full group-hover/item:scale-110 transition-transform">
                                      <Trash2 size={14} />
                                    </div>
                                    <span className="font-bold text-xs text-rose-600">
                                      {t("decommission")}
                                    </span>
                                  </div>
                                </DropdownItem>
                              </Dropdown>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <ModernPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalItems={stats.total}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default WorkforceDirectory;
