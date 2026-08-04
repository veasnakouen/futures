import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";

export interface Client {
  id: number;
  clientCode: string;
  firstName: string;
  lastName: string;
  branch: string;
  gender: string;
  status: string;
  photo?: string;
  email?: string;
  contactPhone?: string;
  dateOfBirth?: string;
  relativePhone?: string;
  maritalStatus?: string;
  address?: string;
  province?: string;
  idCard?: string;
  currentSituation?: string;
  furtherEducation?: boolean;
  placement?: boolean;
  trainingFromFutures?: boolean;
  socialSupportRequired?: boolean;
  hearBy?: string;
  expectedSupport?: string;
  placeOfBirth?: string;
  nationality?: string;
  citizenship?: string;
  height?: string;
  weight?: string;
  socialSupportProblem?: string;
  idpoorStatus?: string;
  idpoorValiddate?: string;
  idpoorLevel?: string;
  idpoorAccountNumber?: string;
}

const mockClientsFallback: Client[] = [
  {
    id: 101,
    clientCode: "CL-2026-001",
    firstName: "Sokha",
    lastName: "Chan",
    branch: "Phnom Penh HQ",
    gender: "Female",
    status: "Active",
    email: "sokha.chan@example.com",
    contactPhone: "+855 12 345 678",
    dateOfBirth: "1998-05-14",
    maritalStatus: "Single",
    address: "Street 271, Sangkat Takhmao",
    province: "Phnom Penh",
    currentSituation: "Job Seeking (IT / Operations)",
    placement: true,
    trainingFromFutures: true,
    socialSupportRequired: false,
  },
  {
    id: 102,
    clientCode: "CL-2026-002",
    firstName: "Vandy",
    lastName: "Meas",
    branch: "Siem Reap Branch",
    gender: "Male",
    status: "Active",
    email: "vandy.meas@example.com",
    contactPhone: "+855 92 888 999",
    dateOfBirth: "1995-11-20",
    maritalStatus: "Married",
    address: "Wat Bo Road",
    province: "Siem Reap",
    currentSituation: "Hospitality Candidate",
    placement: false,
    trainingFromFutures: true,
    socialSupportRequired: true,
  },
  {
    id: 103,
    clientCode: "CL-2026-003",
    firstName: "Bopha",
    lastName: "Khem",
    branch: "Battambang Hub",
    gender: "Female",
    status: "In Progress",
    email: "bopha.khem@example.com",
    contactPhone: "+855 77 123 987",
    dateOfBirth: "2000-02-10",
    maritalStatus: "Single",
    address: "National Road 5",
    province: "Battambang",
    currentSituation: "Skill Training Enrolled",
    placement: false,
    trainingFromFutures: true,
    socialSupportRequired: false,
  },
  {
    id: 104,
    clientCode: "CL-2026-004",
    firstName: "Rithy",
    lastName: "Soun",
    branch: "Phnom Penh HQ",
    gender: "Male",
    status: "Active",
    email: "rithy.soun@example.com",
    contactPhone: "+855 88 555 444",
    dateOfBirth: "1997-09-03",
    maritalStatus: "Single",
    address: "Monivong Blvd",
    province: "Phnom Penh",
    currentSituation: "Junior Web Developer",
    placement: true,
    trainingFromFutures: true,
    socialSupportRequired: false,
  },
];

export function useClientsDataQuery() {
  const [filters, setFilters] = useState({
    search: "",
    branch: "",
    status: "",
  });
  const [connections, setConnections] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "clientCode",
    "branch",
    "status",
  ]);
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const debouncedFilters = useDebounce(filters, 500);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clients", debouncedFilters, currentPage, pageSize],
    queryFn: async () => {
      try {
        const params = {
          page: currentPage - 1,
          size: pageSize,
          name: debouncedFilters.search,
          branch: debouncedFilters.branch,
          status: debouncedFilters.status,
        };
        const response = await api.get("/clients", { params });
        const resData = response.data?.data || response.data;
        return resData;
      } catch {
        const filtered = mockClientsFallback.filter((c) => {
          if (
            debouncedFilters.search &&
            !`${c.firstName} ${c.lastName} ${c.clientCode}`
              .toLowerCase()
              .includes(debouncedFilters.search.toLowerCase())
          )
            return false;
          if (debouncedFilters.branch && c.branch !== debouncedFilters.branch) return false;
          if (debouncedFilters.status && c.status !== debouncedFilters.status) return false;
          return true;
        });
        return {
          content: filtered,
          totalElements: filtered.length,
          totalPages: 1,
          number: 0,
        };
      }
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const res = await api.get("/connections");
      setConnections(res.data);
    } catch {}
  };

  const clients = data?.content || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || (clients.length > 0 ? Math.ceil(clients.length / pageSize) : 0);
  const totalElements = data?.totalElements || clients.length;

  return {
    filters,
    setFilters,
    connections,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    visibleColumns,
    setVisibleColumns,
    itemsPerRow,
    setItemsPerRow,
    loading,
    error,
    refetch,
    clients,
    totalPages,
    totalElements,
  };
}
