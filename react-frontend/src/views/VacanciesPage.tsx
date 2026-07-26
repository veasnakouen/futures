import {Button, Spinner, Table, Badge, Dropdown, DropdownItem, DropdownDivider} from '@/lib/flowbite-compat';
import {
  Plus,
  Briefcase,
  LayoutGrid,
  List,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import api from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import ConfirmModal from "@/components/common/ConfirmModal";

// Modular Components
import VacancyFilters from "@/features/vacancies/components/VacancyFilters";
import VacancyCard from "@/features/vacancies/components/VacancyCard";
import VacancyFormModal from "@/features/vacancies/components/VacancyFormModal";
import ApplyClientModal from "@/features/vacancies/components/ApplyClientModal";
import QuickEmployerModal from "@/features/vacancies/components/QuickEmployerModal";
import QuickJobPositionModal from "@/features/vacancies/components/QuickJobPositionModal";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

const VacanciesPage = ({ isDark, setIsDark }: any) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);
  const [applyForm, setApplyForm] = useState({
    clientId: "",
    placementDate: new Date().toISOString().split("T")[0],
  });
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
  const [isJobPositionModalOpen, setIsJobPositionModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("vacanciesViewMode");
    return saved === "list" || saved === "grid" ? saved : "grid";
  });
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "salary",
    "deadline",
    "status",
  ]);
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const getGridClass = () => {
    return `grid gap-6 ${
      itemsPerRow === "3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : itemsPerRow === "5"
        ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    }`;
  };

  useEffect(() => {
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("vacanciesViewMode", viewMode);
  }, [viewMode]);

  const [quickEmployerData, setQuickEmployerData] = useState({
    name: "",
    contactPerson: "",
  });

  const [quickJobPositionData, setQuickJobPositionData] = useState({
    name: "",
  });

  const [formData, setFormData] = useState({
    employerId: "" as any,
    jobPositionId: "" as any,
    jobCategoryId: "" as any,
    salary: "",
    positionAvailable: 1,
    contractType: "",
    closingDate: new Date().toISOString().split("T")[0],
    status: "Open",
    location: "",
    imageUrl: "",
  });

  // Query for Vacancies
  const { data, isLoading: loading } = useQuery({
    queryKey: ["vacancies", debouncedSearchTerm, currentPage, pageSize],
    queryFn: async () => {
      const res = await api.get(`/vacancies`, {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: debouncedSearchTerm,
        },
      });
      return res.data?.data || res.data;
    },
  });

  const vacancies = data?.content || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Employers Query
  const { data: employersData } = useQuery({
    queryKey: ["employers"],
    queryFn: async () => {
      const res = await api.get("/employers");
      const paged = res.data?.data || res.data;
      return Array.isArray(paged?.content) ? paged.content : Array.isArray(paged) ? paged : [];
    },
  });
  const employers = employersData || [];

  // Clients Query (for Apply Modal)
  const { data: clientsData } = useQuery({
    queryKey: ["clients-brief"],
    queryFn: async () => {
      const res = await api.get("/clients");
      const paged = res.data?.data || res.data;
      return Array.isArray(paged?.content) ? paged.content : Array.isArray(paged) ? paged : [];
    },
  });
  const clients = clientsData || [];

  // Job Positions Query
  const { data: jobPositionsData } = useQuery({
    queryKey: ["job-positions"],
    queryFn: async () => {
      const res = await api.get("/job-positions");
      const paged = res.data?.data || res.data;
      return Array.isArray(paged?.content) ? paged.content : Array.isArray(paged) ? paged : [];
    },
  });
  const jobPositions = jobPositionsData || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newVacancy: any) => api.post("/vacancies", newVacancy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      toast.success("New job vacancy posted");
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/vacancies/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      toast.success("Job vacancy updated");
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/vacancies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      toast.success("Vacancy removed");
    },
  });

  const applyMutation = useMutation({
    mutationFn: (placementData: any) => {
      const formattedData = {
        ...placementData,
        placementDate: placementData.placementDate
          ? placementData.placementDate.includes(" ")
            ? placementData.placementDate
            : `${placementData.placementDate} 00:00:00`
          : null,
      };
      return api.post("/placements", formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      setIsApplyModalOpen(false);
      setApplyForm({
        clientId: "",
        placementDate: new Date().toISOString().split("T")[0],
      });
      toast.success("Application successful! Client has been placed.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy || !applyForm.clientId) return;

    const placementData = {
      clientId: parseInt(applyForm.clientId),
      companyName: selectedVacancy.employerName,
      salary: selectedVacancy.salary,
      placementDate: applyForm.placementDate,
      placementType: "Employment",
      status: "Active",
      jobPositionId: selectedVacancy.jobPositionId,
    };
    applyMutation.mutate(placementData);
  };

  const handleQuickEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/employers", quickEmployerData);
      const newEmployer = response.data;
      queryClient.invalidateQueries({ queryKey: ["employers"] });
      setFormData({ ...formData, employerId: newEmployer.id });
      setIsEmployerModalOpen(false);
      setQuickEmployerData({ name: "", contactPerson: "" });
      toast.success("Employer added and selected");
    } catch (err) {
      toast.error("Failed to save quick employer");
    }
  };

  const handleQuickJobPositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/job-positions", quickJobPositionData);
      const newPosition = response.data;
      queryClient.invalidateQueries({ queryKey: ["job-positions"] });
      setFormData({ ...formData, jobPositionId: newPosition.id });
      setIsJobPositionModalOpen(false);
      setQuickJobPositionData({ name: "" });
      toast.success("Job Position added and selected");
    } catch (err) {
      toast.error("Failed to save job position");
    }
  };

  const handleEdit = (vacancy: any) => {
    setFormData({
      employerId: vacancy.employerId || "",
      jobPositionId: vacancy.jobPositionId || "",
      jobCategoryId: vacancy.jobCategoryId || "",
      salary: vacancy.salary || "",
      positionAvailable: vacancy.positionAvailable || 1,
      contractType: vacancy.contractType || "",
      closingDate:
        vacancy.closingDate || new Date().toISOString().split("T")[0],
      status: vacancy.status || "Open",
      location: vacancy.location || "",
      imageUrl: vacancy.imageUrl || "",
    });
    setEditingId(vacancy.id);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (vacancy: any) => {
    setFormData({
      employerId: vacancy.employerId || "",
      jobPositionId: vacancy.jobPositionId || "",
      jobCategoryId: vacancy.jobCategoryId || "",
      salary: vacancy.salary || "",
      positionAvailable: vacancy.positionAvailable || 1,
      contractType: vacancy.contractType || "",
      closingDate:
        vacancy.closingDate || new Date().toISOString().split("T")[0],
      status: vacancy.status || "Open",
      location: vacancy.location || "",
      imageUrl: vacancy.imageUrl || "",
    });
    setEditingId(vacancy.id);
    setIsEditMode(false);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete);
    setIsConfirmOpen(false);
    setItemToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      employerId: "",
      jobPositionId: "",
      jobCategoryId: "",
      salary: "",
      positionAvailable: 1,
      contractType: "",
      closingDate: new Date().toISOString().split("T")[0],
      status: "Open",
      location: "",
      imageUrl: "",
    });
    setEditingId(null);
    setIsEditMode(false);
    setIsViewMode(false);
  };

  const columns: DataTableColumn<any>[] = [
    {
      key: "position",
      label: "Position & Employer",
      render: (v) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Briefcase size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">
              {v.jobPositionName || "No Designation"}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                <Building2 size={10} />
                {v.employerName || "Confidential"}
              </span>
              <span className="text-gray-300 dark:text-gray-600 text-[10px]">
                |
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} />
                {v.location || "Remote"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "salary",
      label: "Package",
      align: "center",
      render: (v) => (
        <div className="flex flex-col items-center">
          <span className="text-sm font-black text-gray-900 dark:text-white">
            ${v.salary || 0}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            per month
          </span>
        </div>
      ),
    },
    {
      key: "deadline",
      label: "Deadline",
      align: "center",
      render: (v) => (
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-tight">
            {v.closingDate
              ? format(new Date(v.closingDate), "MMM dd, yyyy")
              : "N/A"}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
            <Clock size={8} /> Closing Date
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v) => (
        <Badge
          color={v.status === "Open" ? "success" : "gray"}
          className="rounded-md px-4 py-1.5 text-[9px] font-black uppercase tracking-widest inline-flex"
        >
          {v.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (v) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            label={
              <div className="p-2 text-gray-400 hover:text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md cursor-pointer">
                <MoreVertical size={18} />
              </div>
            }
            arrowIcon={false}
            inline
            className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl rounded-md p-2 min-w-[180px]"
          >
            <DropdownItem
              onClick={() => handleView(v)}
              className="font-bold text-xs text-gray-700 dark:text-gray-200"
            >
              <Briefcase size={14} className="mr-2 text-blue-600" /> View
              Details
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setSelectedVacancy(v);
                setIsApplyModalOpen(true);
              }}
              className="font-bold text-xs text-gray-700 dark:text-gray-200"
            >
              <UserPlus size={14} className="mr-2 text-emerald-600" /> Assign
              Client
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              onClick={() => handleEdit(v)}
              className="font-bold text-xs text-gray-700 dark:text-gray-200"
            >
              <Edit size={14} className="mr-2 text-blue-600" /> Update Details
            </DropdownItem>
            <DropdownItem
              onClick={() => handleDelete(v.id)}
              className="font-bold text-xs text-red-600 dark:text-red-400"
            >
              <Trash2 size={14} className="mr-2" /> Delete
            </DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  const filteredColumns = columns.filter(
    (c) =>
      c.key === "position" ||
      c.key === "actions" ||
      visibleColumns.includes(c.key as string),
  );

  return (
    <>
      <div className="space-y-4 animate-fade-in max-w-[1600px] mx-auto pb-6">
        <header className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-md shadow-xl shadow-blue-500/20">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black dark:text-white tracking-tight">
                Active Opportunities
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse"></span>
                Connecting Clients to Labour Market Nodes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              color="blue"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="rounded-md px-6 h-12 bg-blue-600 hover:bg-blue-700 border-none shadow-xl shadow-blue-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[9px]"
            >
              <Plus size={18} className="mr-2" /> Post New Vacancy
            </Button>
          </div>
        </header>

        <VacancyFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          itemsPerRow={itemsPerRow}
          setItemsPerRow={setItemsPerRow}
        />

        <div className="space-y-3">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-gray-500">
              <Spinner size="xl" />
              <p className="mt-6 font-black animate-pulse text-[10px] uppercase tracking-[0.2em]">
                Accessing Opportunity Grid...
              </p>
            </div>
          ) : vacancies.length > 0 ? (
            viewMode === "grid" ? (
              <div className={getGridClass()}>
                {vacancies.map((vacancy: any) => (
                  <VacancyCard
                    key={vacancy.id}
                    vacancy={vacancy}
                    onApply={(v) => {
                      setSelectedVacancy(v);
                      setIsApplyModalOpen(true);
                    }}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <DataTable
                columns={filteredColumns}
                data={vacancies}
                keyExtractor={(v) => v.id}
                emptyMessage="No Vacancies Found"
                emptySubMessage="There are currently no active job opportunities matching your criteria."
              />
            )
          ) : (
            <div className="py-32 text-center bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <Briefcase
                size={64}
                className="mx-auto text-gray-200 mb-6 opacity-20"
              />
              <h3 className="text-2xl font-black dark:text-white uppercase tracking-widest">
                No Active Nodes
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-2 uppercase">
                The opportunity grid is currently awaiting new broadcasts.
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
            <ModernPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalElements}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}

        <VacancyFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          isEditMode={isEditMode}
          isViewMode={isViewMode}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          employers={employers}
          jobPositions={jobPositions}
          onQuickEmployer={() => setIsEmployerModalOpen(true)}
          onQuickJobPosition={() => setIsJobPositionModalOpen(true)}
        />

        <ApplyClientModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          vacancy={selectedVacancy}
          clients={clients}
          selectedClientId={applyForm.clientId}
          setSelectedClientId={(id) =>
            setApplyForm({ ...applyForm, clientId: id })
          }
          placementDate={applyForm.placementDate}
          setPlacementDate={(date) =>
            setApplyForm({ ...applyForm, placementDate: date })
          }
          handleSubmit={handleApplySubmit}
        />

        <QuickEmployerModal
          isOpen={isEmployerModalOpen}
          onClose={() => setIsEmployerModalOpen(false)}
          quickEmployerData={quickEmployerData}
          setQuickEmployerData={setQuickEmployerData}
          handleSubmit={handleQuickEmployerSubmit}
        />

        <QuickJobPositionModal
          isOpen={isJobPositionModalOpen}
          onClose={() => setIsJobPositionModalOpen(false)}
          quickJobPositionData={quickJobPositionData}
          setQuickJobPositionData={setQuickJobPositionData}
          handleSubmit={handleQuickJobPositionSubmit}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to decommission this vacancy broadcast? This will terminate all active application links."
        />
      </div>
    </>
  );
};

export default VacanciesPage;
