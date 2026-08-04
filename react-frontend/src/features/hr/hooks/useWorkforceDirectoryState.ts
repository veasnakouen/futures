import { useState, useMemo } from "react";

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

export function useWorkforceDirectoryState(props: any) {
  const {
    employees = [],
    filteredEmployees = [],
    onEditEmployee,
    handleEdit,
    onDeleteEmployee,
    handleDelete,
  } = props;

  const actualOnEdit = onEditEmployee || handleEdit || (() => {});
  const actualOnDelete = onDeleteEmployee || handleDelete || (() => {});

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [layoutMode, setLayoutMode] = useState<"grid" | "table">("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [goToPageInput, setGoToPageInput] = useState<string>("");
  const [showColumnToggle, setShowColumnToggle] = useState<boolean>(false);

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

  const actualBackendList =
    employees && employees.length > 0
      ? employees
      : filteredEmployees && filteredEmployees.length > 0
      ? filteredEmployees
      : [];
  const rawList = actualBackendList.length > 0 ? actualBackendList : RICH_DEFAULT_EMPLOYEES;

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

        const matchesDept =
          departmentFilter === "ALL" ||
          dept.toLowerCase().includes(departmentFilter.toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" ||
          st.toLowerCase().includes(statusFilter.toLowerCase());
        const matchesBranch =
          branchFilter === "ALL" ||
          br.toLowerCase().includes(branchFilter.toLowerCase());

        return matchesSearch && matchesDept && matchesStatus && matchesBranch;
      })
      .sort((a, b) => {
        let aVal: any = "";
        let bVal: any = "";

        if (sortField === "name") {
          aVal = `${a.firstName || a.firstNameEnglish} ${
            a.lastName || a.lastNameEnglish
          }`.toLowerCase();
          bVal = `${b.firstName || b.firstNameEnglish} ${
            b.lastName || b.lastNameEnglish
          }`.toLowerCase();
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
  const activeCount = rawList.filter((e) =>
    (e.status || "Active").toLowerCase().includes("active")
  ).length;
  const leaveCount = rawList.filter(
    (e) =>
      (e.status || "").toLowerCase().includes("leave") ||
      (e.status || "").toLowerCase().includes("searching")
  ).length;

  return {
    actualOnEdit,
    actualOnDelete,
    search,
    setSearch,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    branchFilter,
    setBranchFilter,
    layoutMode,
    setLayoutMode,
    selectedEmployee,
    setSelectedEmployee,
    sortField,
    sortDir,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    goToPageInput,
    setGoToPageInput,
    showColumnToggle,
    setShowColumnToggle,
    visibleCols,
    setVisibleCols,
    totalElements,
    totalPages,
    safeCurrentPage,
    paginatedEmployees,
    handleSort,
    handleGoToPage,
    totalCount,
    activeCount,
    leaveCount,
    onAddEmployee: props.onAddEmployee,
  };
}
