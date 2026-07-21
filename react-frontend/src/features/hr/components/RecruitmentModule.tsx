import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Button, Progress, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput, Avatar, Tooltip, Modal, ModalHeader, ModalBody, ModalFooter, Label, Spinner, Pagination, Dropdown, DropdownItem, DropdownDivider, Textarea } from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import ModernPagination from '@/components/common/ModernPagination';
import {
  X,
  Zap,
  Search,
  Users,
  Calendar,
  ArrowRight,
  Briefcase,
  TrendingUp,
  PieChart,
  Filter,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Building2,
  UserCheck,
  Trash2,
  Edit3,
  Save,
  MoreVertical,
  LayoutGrid,
  List,
  ChevronDown,
  UserPlus,
  MessageSquare,
  Pen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vacancySchema,
  clientSchema,
  placementSchema,
  type VacancyFormData,
  type ClientFormData,
  type PlacementFormData,
} from '@/schemas/recruitmentSchemas';
import { toast } from "react-hot-toast";
import ModernTabs from "@/components/common/ModernTabs";
import JobWorkspace from "./JobWorkspace";
import VacancyFormModal from '@/features/vacancies/components/VacancyFormModal';
import GlobalATSBoard from "./GlobalATSBoard";
import SearchInput from "@/components/common/SearchInput";
import CandidateOnboardingWizard from "./CandidateOnboardingWizard";

interface RecruitmentModuleProps {
  vacancies: any[];
  stats: any;
  candidates: any[];
  employers: any[];
  positions: any[];
  placements: any[];
  onAddVacancy: (data: any) => Promise<void>;
  onUpdateVacancy: (id: number, data: any) => Promise<void>;
  onDeleteVacancy: (id: number) => Promise<void>;
  onAddCandidate: (data: any) => Promise<void>;
  onUpdateCandidate: (id: number, data: any) => Promise<void>;
  onDeleteCandidate: (id: number) => Promise<void>;
  onPlaceCandidate: (data: any) => Promise<void>;
}

const RecruitmentModule: React.FC<RecruitmentModuleProps> = ({
  vacancies,
  stats,
  candidates,
  employers,
  positions,
  placements,
  onAddVacancy,
  onUpdateVacancy,
  onDeleteVacancy,
  onAddCandidate,
  onUpdateCandidate,
  onDeleteCandidate,
  onPlaceCandidate,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    "DASHBOARD" | "VACANCIES" | "CANDIDATES" | "PLACEMENTS" | "APPLICATIONS"
  >("DASHBOARD");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);

  // Pagination State
  const [vacancyPage, setVacancyPage] = useState(1);
  const [candidatePage, setCandidatePage] = useState(1);
  const [placementPage, setPlacementPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerRow, setItemsPerRow] = useState("4");
  const vacanciesPerPage = 9;
  const candidatesPerPage = 10;
  const placementsPerPage = 10;

  // 1. Vacancy Form
  const vacancyFormMethods = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      employerId: "",
      jobPositionId: "",
      positionAvailable: 1,
      salary: "",
      closingDate: "",
      contractType: "Full-Time",
      status: "Open",
    },
  });



  // 3. Placement Form
  const placementFormMethods = useForm<PlacementFormData>({
    resolver: zodResolver(placementSchema),
    defaultValues: {
      companyName: "",
      jobPositionId: "",
      salary: 0,
      placementDate: new Date().toISOString().split("T")[0],
      placementType: "Direct Hire",
      status: "Placed",
    },
  });

  const {
    register: regVacancy,
    handleSubmit: submitVacancy,
    reset: resetVacancy,
    setValue: setVacancyValue,
    watch: watchVacancy,
    formState: { errors: vacancyErrors },
  } = vacancyFormMethods;

  const {
    register: regPlacement,
    handleSubmit: submitPlacement,
    reset: resetPlacement,
    setValue: setPlacementValue,
    watch: watchPlacement,
    formState: { errors: placementErrors },
  } = placementFormMethods;

  // Vacancy Modal State
  const [isVacancyModalOpen, setIsVacancyModalOpen] = useState(false);
  const [isEditVacancy, setIsEditVacancy] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState<number | null>(null);
  const [vacancyFormData, setVacancyFormData] = useState<any>({
    employerId: "",
    jobPositionId: "",
    positionAvailable: 1,
    salary: "",
    salarymax: "",
    closingDate: "",
    contractType: "Full-Time",
    status: "Open",
    location: "",
    schedule: "",
    responsibilities: "",
    requirement: "",
    applicationInformation: "",
  });

  // Candidate Modal State
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isEditCandidate, setIsEditCandidate] = useState(false);
  const [editingCandidateId, setEditingCandidateId] = useState<number | null>(null);
  const [candidateFormData, setCandidateFormData] = useState<any>(null);

  // Placement Modal State
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [selectedCandidateForPlacement, setSelectedCandidateForPlacement] =
    useState<any>(null);

  const safeVacancies = Array.isArray(vacancies) ? vacancies : [];
  const safeCandidates = Array.isArray(candidates) ? candidates : [];
  const safePlacements = Array.isArray(placements) ? placements : [];
  const safeEmployers = Array.isArray(employers) ? employers : [];
  const safePositions = Array.isArray(positions) ? positions : [];

  const trendData = stats?.placementTrend || [];
  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
  ];

  const vacancyStatusRaw = safeVacancies.reduce((acc: any, v: any) => {
    const s = v.status || "Unknown";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const vacancyStatusData = Object.keys(vacancyStatusRaw).map((key) => ({
    name: key,
    value: vacancyStatusRaw[key],
  }));

  const filteredVacancies = safeVacancies.filter(
    (v) =>
      (v.jobPositionName || v.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (v.employerName || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCandidates = safeCandidates.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (c.clientCode || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPlacements = safePlacements.filter(
    (p) =>
      (p.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Paginated Data
  const paginatedVacancies = filteredVacancies.slice(
    (vacancyPage - 1) * vacanciesPerPage,
    vacancyPage * vacanciesPerPage,
  );
  const paginatedCandidates = filteredCandidates.slice(
    (candidatePage - 1) * candidatesPerPage,
    candidatePage * candidatesPerPage,
  );
  const paginatedPlacements = filteredPlacements.slice(
    (placementPage - 1) * placementsPerPage,
    placementPage * placementsPerPage,
  );

  // Handlers
  const handleOpenAddVacancy = () => {
    setVacancyFormData({
      employerId: "",
      jobPositionId: "",
      positionAvailable: 1,
      salary: "",
      salarymax: "",
      location: "",
      schedule: "",
      responsibilities: "",
      requirement: "",
      applicationInformation: "",
      closingDate: new Date().toISOString().split("T")[0],
      contractType: "Full-Time",
      status: "Open",
    });
    setIsEditVacancy(false);
    setIsVacancyModalOpen(true);
  };

  const handleOpenEditVacancy = (v: any) => {
    setVacancyFormData({
      employerId: v.employerId?.toString() || "",
      jobPositionId: v.jobPositionId?.toString() || "",
      positionAvailable: v.positionAvailable || 1,
      salary: v.salary?.toString() || "",
      salarymax: v.salarymax?.toString() || "",
      location: v.location || "",
      schedule: v.schedule || "",
      responsibilities: v.responsibilities || "",
      requirement: v.requirement || "",
      applicationInformation: v.applicationInformation || "",
      closingDate: v.closingDate || new Date().toISOString().split("T")[0],
      contractType: v.contractType || "Full-Time",
      status: v.status || "Open",
    });
    setEditingVacancyId(v.id);
    setIsEditVacancy(true);
    setIsVacancyModalOpen(true);
  };

  const onVacancySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      if (isEditVacancy && editingVacancyId) {
        await onUpdateVacancy(editingVacancyId, vacancyFormData);
      } else {
        await onAddVacancy(vacancyFormData);
      }
      setIsVacancyModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenAddCandidate = () => {
    setCandidateFormData({
      firstName: "",
      lastName: "",
      gender: "Male",
      contactPhone: "",
      email: "",
      province: "Phnom Penh",
      clientCode: `TAL-${Date.now().toString().slice(-4)}`,
      branch: "Phnom Penh",
      status: "Searching",
      headline: "",
      desiredSalary: "",
      availability: "",
      preferredLocation: "",
      primarySkills: "",
    });
    setIsEditCandidate(false);
    setIsCandidateModalOpen(true);
  };

  const handleOpenEditCandidate = (c: any) => {
    setCandidateFormData({
      firstName: c.firstName || "",
      lastName: c.lastName || "",
      gender: c.gender || "Male",
      contactPhone: c.contactPhone || "",
      email: c.email || "",
      province: c.province || "Phnom Penh",
      clientCode: c.clientCode || "",
      branch: c.branch || "Phnom Penh",
      status: c.status || "Searching",
      headline: c.headline || "",
      desiredSalary: c.desiredSalary || "",
      availability: c.availability || "",
      preferredLocation: c.preferredLocation || "",
      primarySkills: c.primarySkills || "",
    });
    setEditingCandidateId(c.id);
    setIsEditCandidate(true);
    setIsCandidateModalOpen(true);
  };

  const onCandidateSubmit = async (data: ClientFormData) => {
    try {
      setIsProcessing(true);
      if (isEditCandidate && editingCandidateId) {
        await onUpdateCandidate(editingCandidateId, data);
      } else {
        await onAddCandidate(data);
      }
      setIsCandidateModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenPlacement = (c: any) => {
    setSelectedCandidateForPlacement(c);
    resetPlacement({
      companyName: "",
      jobPositionId: "",
      salary: 0,
      placementDate: new Date().toISOString().split("T")[0],
      placementType: "Direct Hire",
      status: "Placed",
    });
    setIsPlacementModalOpen(true);
  };

  const onPlacementSubmit = async (data: PlacementFormData) => {
    try {
      setIsProcessing(true);
      await onPlaceCandidate({
        ...data,
        clientId: selectedCandidateForPlacement.id,
      });
      setIsPlacementModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedVacancy) {
    return (
      <JobWorkspace
        vacancy={selectedVacancy}
        candidates={safeCandidates}
        onClose={() => setSelectedVacancy(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Module Header & Tabs */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white/50 dark:bg-gray-800/50 p-4 rounded-md shadow-sm">
        <div className="flex w-full sm:w-max mx-auto xl:mx-0 overflow-x-auto whitespace-nowrap no-scrollbar flex-nowrap shrink-0">
          <ModernTabs
            tabs={[
              {
                id: "DASHBOARD",
                label: t("dashboard"),
                icon: <TrendingUp size={14} />,
              },
              {
                id: "VACANCIES",
                label: t("vacancies"),
                icon: <Briefcase size={14} />,
              },
              {
                id: "CANDIDATES",
                label: t("talentPool"),
                icon: <Users size={14} />,
              },
              {
                id: "PLACEMENTS",
                label: t("placementAudit"),
                icon: <UserCheck size={14} />,
              },
              {
                id: "APPLICATIONS",
                label: "ATS Pipeline",
                icon: <CheckCircle size={14} />,
              },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto flex-1 xl:flex-none justify-end">
          <div className="relative flex-grow xl:flex-initial xl:w-48">
            {/* <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" /> */}
            <SearchInput
              placeholder="Search talent, jobs..."
              value={searchQuery}
              onChange={setSearchQuery}
              containerClassName="pl-10 rounded-md w-full"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            {activeTab !== "PLACEMENTS" && activeTab !== "DASHBOARD" ? (
              <Button
                color="blue"
                onClick={
                  activeTab === "VACANCIES"
                    ? handleOpenAddVacancy
                    : handleOpenAddCandidate
                }
                className="rounded-md px-6 h-11 shadow-lg shadow-blue-500/20 font-black uppercase text-[10px] tracking-widest border-none shrink-0 flex-1 sm:flex-none h-12"
              >
                <Plus size={18} className="mr-2" /> New{" "}
                {activeTab === "VACANCIES" ? "Vacancy" : "Candidate"}
              </Button>
            ) : (
              <div className="flex gap-2 shrink-0 flex-1 sm:flex-none">
                <Button
                  color="blue"
                  onClick={handleOpenAddVacancy}
                  className="rounded-md px-4 h-11 font-black uppercase text-[9px] border-none shadow-md shrink-0 flex-1 sm:flex-none"
                >
                  <Briefcase size={14} className="mr-2" /> Post Job
                </Button>
                <Button
                  color="indigo"
                  onClick={handleOpenAddCandidate}
                  className="rounded-md px-4 h-11 font-black uppercase text-[9px] border-none shadow-md shrink-0 flex-1 sm:flex-none h-12"
                >
                  <Users size={14} className="mr-2" /> Add Talent
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "APPLICATIONS" && (
          <GlobalATSBoard />
        )}

        {activeTab === "DASHBOARD" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-md bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-blue-600 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Live Vacancies
                </p>
                <h4 className="text-4xl font-black dark:text-white text-blue-600">
                  {safeVacancies.length}
                </h4>
              </div>
              <div className="p-5 rounded-md bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-indigo-600 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Talent Pool
                </p>
                <h4 className="text-4xl font-black dark:text-white text-indigo-600">
                  {safeCandidates.length}
                </h4>
              </div>
              <div className="p-5 rounded-md bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-emerald-500 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Success Hires
                </p>
                <h4 className="text-4xl font-black dark:text-white text-emerald-600">
                  {stats?.totalPlacements || 0}
                </h4>
              </div>
              <div className="p-5 rounded-md bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-md flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-cyan-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
                    Pipeline Health
                  </p>
                </div>
                <h4 className="text-2xl font-black uppercase tracking-tighter">
                  Stable Sync
                </h4>
                <p className="text-[9px] font-bold mt-1 opacity-60 uppercase tracking-widest">
                  Enterprise Talent Node Active
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 p-8 rounded-md dark:bg-gray-800 border-none shadow-md">
                <h4 className="font-black text-xl dark:text-white uppercase tracking-tight mb-8">
                  Hiring Velocity
                </h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E5E7EB"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#9CA3AF",
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#9CA3AF",
                        }}
                      />
                      <ReTooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          fontSize: "10px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#3B82F6"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-md">
                <h4 className="font-black text-xl dark:text-white uppercase tracking-tight mb-8">
                  Registered Vacancies
                </h4>
                <div className="h-[250px] w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={vacancyStatusData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E5E7EB"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 900, fill: "#9CA3AF" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 900, fill: "#9CA3AF" }}
                        allowDecimals={false}
                      />
                      <ReTooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          fontSize: "10px",
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                        {vacancyStatusData.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {vacancyStatusData.map((s: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-md"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        ></div>
                        <span className="text-gray-400">{s.name}</span>
                      </div>
                      <span className="dark:text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "VACANCIES" && (
          <motion.div
            key="vacancies"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
                Active Vacancies
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

            {viewMode === "grid" ? (
              <div className={`grid gap-8 ${itemsPerRow === "3" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
                {paginatedVacancies.map((v) => (
                  <div
                    key={v.id}
                    className="shadow-sm bg-white dark:bg-gray-800 rounded-md focus-within:z-30 p-4 relative group hover:shadow-md transition-shadow"
                  >
                    <div className="absolute right-2 top-2">
                      <Dropdown
                        placement="bottom-end"
                        label={
                          <div className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-400 hover:text-blue-600 cursor-pointer">
                            <MoreVertical size={16} />
                          </div>
                        }
                        arrowIcon={false}
                        inline
                        className="bg-white dark:bg-gray-800 shadow-sm !rounded-md"
                      >
                        <DropdownItem
                          onClick={() =>
                            setTimeout(() => handleOpenEditVacancy(v), 0)
                          }
                          className="font-medium text-xs text-blue-600"
                        >
                          <div className="flex items-center gap-2">
                            <Edit3 size={14} />
                            <span>Edit Posting</span>
                          </div>
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem
                          onClick={() =>
                            setTimeout(() => onDeleteVacancy(v.id), 0)
                          }
                          className="font-medium text-xs text-rose-600"
                        >
                          <div className="flex items-center gap-2">
                            <Trash2 size={14} />
                            <span>Delete Vacancy</span>
                          </div>
                        </DropdownItem>
                      </Dropdown>
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                        <Briefcase size={20} />
                      </div>
                      <div
                        className="pr-6 cursor-pointer group-hover:text-blue-600 transition-colors"
                        onClick={() => setSelectedVacancy(v)}
                      >
                        <h4 className="font-bold dark:text-white text-lg tracking-tight leading-none mb-1 uppercase group-hover:text-blue-500">
                          {v.jobPositionName || "Standard Role"}
                        </h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                          <Building2 size={12} className="text-blue-500" />{" "}
                          {v.employerName || "Confidential"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-3 border-y mb-3">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                          Salary Package
                        </p>
                        <p className="font-black dark:text-white text-lg">
                          ${v.salary || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                          Nodes Available
                        </p>
                        <p className="font-black dark:text-white text-lg">
                          {v.positionAvailable || 1}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} /> {v.closingDate || "TBD"}
                      </span>
                      <Badge
                        color={v.status === "Open" ? "success" : "failure"}
                        className="rounded-md"
                      >
                        {v.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden p-0">
                <div className="overflow-x-auto overflow-y-auto custom-scrollbar w-full max-h-[65vh]">
                  <Table hoverable className="w-full min-w-[800px] relative">
                    <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20 shadow-sm border-b">
                      <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                        Broadcast Identity
                      </TableHeadCell>
                      <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                        Employer Node
                      </TableHeadCell>
                      <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                        Salary Scale
                      </TableHeadCell>
                      <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                        Closing
                      </TableHeadCell>
                      <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                        Status
                      </TableHeadCell>
                      <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6 text-right">
                        Actions
                      </TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y dark:divide-gray-700">
                      {paginatedVacancies.map((v) => (
                        <TableRow
                          key={v.id}
                          className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700/50"
                          onClick={() => setSelectedVacancy(v)}
                        >
                          <TableCell className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                <Briefcase size={14} />
                              </div>
                              <span className="font-black dark:text-white uppercase tracking-tight text-xs">
                                {v.jobPositionName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase">
                            {v.employerName || "Confidential"}
                          </TableCell>
                          <TableCell className="px-6 py-3 font-black dark:text-white text-xs">
                            ${v.salary || 0}
                          </TableCell>
                          <TableCell className="px-6 py-3 text-[10px] font-bold text-gray-400">
                            {v.closingDate
                              ? format(new Date(v.closingDate), "MMM dd, yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="px-6 py-3">
                            <Badge
                              color={v.status === "Open" ? "success" : "gray"}
                              className="rounded-md px-2 py-0.5 text-[8px] font-black uppercase"
                            >
                              {v.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-3 text-right">
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditVacancy(v.id);
                                }}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteVacancy(v.id);
                                }}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            {filteredVacancies.length > vacanciesPerPage && (
              <div className="mt-8">
                <ModernPagination
                  currentPage={vacancyPage}
                  totalPages={Math.ceil(
                    filteredVacancies.length / vacanciesPerPage,
                  )}
                  onPageChange={setVacancyPage}
                  totalItems={filteredVacancies.length}
                  pageSize={vacanciesPerPage}
                  onPageSizeChange={() => { }}
                />
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "CANDIDATES" && (
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
                              color={
                                c.status === "Searching" ? "info" : "success"
                              }
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
                    {/* Top Dropdown Action */}
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
                      {/* Large Circular Avatar */}
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

                      {/* Title & Subtitle */}
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

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-0">
                        <Button
                          onClick={() => {
                            if (sentRequests.includes(c.id)) {
                              setSentRequests((prev) =>
                                prev.filter((id) => id !== c.id),
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
                          {sentRequests.includes(c.id) ? (
                            <UserPlus size={16} className="hidden" />
                          ) : (
                            <UserPlus size={16} />
                          )}
                          {sentRequests.includes(c.id) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-user-check"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <polyline points="16 11 18 13 22 9" />
                            </svg>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            if (c.email) {
                              window.location.href = `mailto:${c.email}`;
                            } else {
                              toast.error(
                                "No email address available for this contact",
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
                    filteredCandidates.length / candidatesPerPage,
                  )}
                  onPageChange={setCandidatePage}
                  totalItems={filteredCandidates.length}
                  pageSize={candidatesPerPage}
                  onPageSizeChange={() => { }}
                />
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "PLACEMENTS" && (
          <motion.div
            key="placements"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white/50 backdrop-blur-xl">
              <div className="p-8 border-b bg-gray-50/50 dark:bg-gray-700/20">
                <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                  Placement Audit Ledger
                </h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  Verified historical hiring records
                </p>
              </div>
              <div className="overflow-x-auto overflow-y-auto custom-scrollbar w-full max-h-[65vh]">
                <Table hoverable className="w-full min-w-[800px] relative">
                  <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20 shadow-sm border-b">
                    <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                      Candidate
                    </TableHeadCell>
                    <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                      Company
                    </TableHeadCell>
                    <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                      Position
                    </TableHeadCell>
                    <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                      Salary
                    </TableHeadCell>
                    <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                      Date
                    </TableHeadCell>
                    <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                      Type
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y dark:divide-gray-700">
                    {paginatedPlacements.map((p) => (
                      <TableRow
                        key={p.id}
                        className="bg-white dark:bg-gray-800 transition-colors"
                      >
                        <TableCell className="px-8 py-6 font-black dark:text-white uppercase tracking-tight">
                          {p.clientName}
                        </TableCell>
                        <TableCell className="px-8 py-6 font-bold text-blue-600">
                          {p.companyName}
                        </TableCell>
                        <TableCell className="px-8 py-6 text-xs font-bold dark:text-gray-400">
                          {p.jobPositionName}
                        </TableCell>
                        <TableCell className="px-8 py-6 font-black dark:text-white">
                          ${p.salary?.toLocaleString()}
                        </TableCell>
                        <TableCell className="px-8 py-6 text-xs font-bold text-gray-500">
                          {p.placementDate
                            ? format(new Date(p.placementDate), "MMM dd, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell className="px-8 py-6">
                          <Badge
                            color="indigo"
                            className="rounded-md px-4 text-[9px] font-black uppercase"
                          >
                            {p.placementType}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            {filteredPlacements.length > placementsPerPage && (
              <div className="mt-8">
                <ModernPagination
                  currentPage={placementPage}
                  totalPages={Math.ceil(
                    filteredPlacements.length / placementsPerPage,
                  )}
                  onPageChange={setPlacementPage}
                  totalItems={filteredPlacements.length}
                  pageSize={placementsPerPage}
                  onPageSizeChange={() => { }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <VacancyFormModal
        isOpen={isVacancyModalOpen}
        onClose={() => setIsVacancyModalOpen(false)}
        isEditMode={isEditVacancy}
        formData={vacancyFormData}
        setFormData={setVacancyFormData}
        handleSubmit={onVacancySubmit}
        employers={safeEmployers}
        jobPositions={safePositions}
      />

      {/* Candidate Modal */}
      <CandidateOnboardingWizard
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        isEditMode={isEditCandidate}
        initialData={candidateFormData}
        onSubmit={onCandidateSubmit}
      />

      {/* Placement Modal */}
      <Modal
        show={isPlacementModalOpen}
        onClose={() => setIsPlacementModalOpen(false)}
        size="md"
      >
        <ModalHeader>Confirm Talent Placement</ModalHeader>
        <form
          onSubmit={submitPlacement(onPlacementSubmit)}
          className="contents"
        >
          <ModalBody>
            {selectedCandidateForPlacement && (
              <div className="space-y-6">
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-md flex items-center gap-4 border-emerald-100 dark:border-emerald-800/50">
                  <Avatar
                    img={selectedCandidateForPlacement.photo}
                    rounded
                    size="lg"
                  />
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      Candidate Target
                    </p>
                    <h4 className="text-lg font-black dark:text-white uppercase">
                      {selectedCandidateForPlacement.firstName}{" "}
                      {selectedCandidateForPlacement.lastName}
                    </h4>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                      Hiring Company
                    </Label>
                    <select
                      className={`w-full bg-gray-50 dark:bg-gray-700 border-none rounded-md text-xs font-bold h-11 px-4 ${placementErrors.companyName ? "ring-1 ring-red-500" : ""}`}
                      {...regPlacement("companyName")}
                    >
                      <option value="">Select Employer</option>
                      {safeEmployers.map((e) => (
                        <option key={e.id} value={e.name}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                    {placementErrors.companyName && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        {placementErrors.companyName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                      Assigned Position
                    </Label>
                    <select
                      className={`w-full bg-gray-50 dark:bg-gray-700 border-none rounded-md text-xs font-bold h-11 px-4 ${placementErrors.jobPositionId ? "ring-1 ring-red-500" : ""}`}
                      {...regPlacement("jobPositionId")}
                    >
                      <option value="">Select Position</option>
                      {safePositions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {placementErrors.jobPositionId && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        {placementErrors.jobPositionId.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Contract Salary
                      </Label>
                      <TextInput
                        type="number"
                        {...regPlacement("salary", { valueAsNumber: true })}
                      />
                      {placementErrors.salary && (
                        <p className="text-[10px] font-bold text-red-500 mt-1">
                          {placementErrors.salary.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Hire Date
                      </Label>
                      <DatePicker
                        value={
                          watchPlacement("placementDate")
                            ? new Date(watchPlacement("placementDate"))
                            : null
                        }
                        onChange={(date) =>
                          setPlacementValue(
                            "placementDate",
                            format(date, "yyyy-MM-dd"),
                            { shouldValidate: true },
                          )
                        }
                      />
                      {placementErrors.placementDate && (
                        <p className="text-[10px] font-bold text-red-500 mt-1">
                          {placementErrors.placementDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="gap-3">
            <Button
              color="gray"
              onClick={() => setIsPlacementModalOpen(false)}
              className="font-black uppercase text-[10px] tracking-widest h-11 border-none bg-gray-100 dark:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="success"
              disabled={isProcessing}
              className="flex-1 font-black uppercase text-[10px] tracking-widest h-12 border-none shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <CheckCircle size={16} className="mr-2" />
              )}
              Confirm Hire
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default RecruitmentModule;
