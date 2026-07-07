import { useState, useEffect } from "react";
import {Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge, Button, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Select, Popover, Dropdown, DropdownItem, DropdownDivider} from '@/lib/flowbite-compat';
import DatePicker from "@/components/common/DatePicker";
import ModernPagination from "@/components/common/ModernPagination";
import {
  Briefcase,
  Calendar,
  Building,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Search,
  MoreVertical,
  LayoutGrid,
  List,
  User,
  MapPin,
  ChevronDown,
  X,
  Filter,
} from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import { uploadToCloudinary } from "../utils/cloudinary";
import { Camera } from "lucide-react";
import ImageCropperModal from "@/components/common/ImageCropperModal";
import { useDebounce } from "../hooks/useDebounce";

const PlacementsPage = ({ isDark, setIsDark }: any) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [salaryError, setSalaryError] = useState<string | null>(null);

  const { data: placementCategories = [] } = useQuery({
    queryKey: ["placementCategories"],
    queryFn: async () => {
      const res = await api.get("/placement-categories");
      return res.data;
    },
  });
  const placementTypes = placementCategories.map((c: any) => c.name);

  const [formData, setFormData] = useState({
    clientId: "",
    companyName: "",
    salary: "",
    placementDate: new Date().toISOString().split("T")[0],
    status: "Active",
    placementType: "Employment",
    imageUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const executeUpload = async (fileToUpload: File) => {
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(fileToUpload);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "commencement",
    "compensatory",
    "status",
  ]);
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const getGridClass = () => {
    return `grid gap-6 ${
      itemsPerRow === "3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 items-start"
        : itemsPerRow === "5"
        ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 items-start"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 items-start"
    }`;
  };

  // Query for Placements
  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      "placements",
      debouncedSearchQuery,
      statusFilter,
      currentPage,
      pageSize,
    ],
    queryFn: async () => {
      const response = await api.get("/placements", {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: debouncedSearchQuery,
          status: statusFilter === "All" ? "" : statusFilter,
        },
      });
      return response.data;
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter]);

  // Stats Query
  const { data: stats } = useQuery({
    queryKey: ["placement-stats"],
    queryFn: async () => {
      const response = await api.get("/placements/stats");
      return response.data;
    },
  });

  const placements = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newPlacement: any) => {
      const formattedData = {
        ...newPlacement,
        placementDate: newPlacement.placementDate
          ? newPlacement.placementDate.includes(" ")
            ? newPlacement.placementDate
            : `${newPlacement.placementDate} 00:00:00`
          : null,
      };
      return api.post("/placements", formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      queryClient.invalidateQueries({ queryKey: ["placement-stats"] });
      toast.success("Placement recorded");
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      const formattedData = {
        ...data,
        placementDate: data.placementDate
          ? data.placementDate.includes(" ")
            ? data.placementDate
            : `${data.placementDate} 00:00:00`
          : null,
      };
      return api.put(`/placements/${id}`, formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      queryClient.invalidateQueries({ queryKey: ["placement-stats"] });
      toast.success("Placement updated");
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/placements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      queryClient.invalidateQueries({ queryKey: ["placement-stats"] });
      toast.success("Placement removed");
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

  const handleOpenModal = (placement?: any) => {
    if (placement) {
      setFormData({
        clientId: placement.clientId?.toString() || "",
        companyName: placement.companyName || "",
        salary: placement.salary?.toString() || "",
        placementDate:
          placement.placementDate || new Date().toISOString().split("T")[0],
        status: placement.status || "Active",
        placementType: placement.placementType || "Employment",
        imageUrl: placement.imageUrl || "",
      });
      setEditingId(placement.id);
      setIsEditMode(true);
    } else {
      setFormData({
        clientId: "",
        companyName: "",
        salary: "",
        placementDate: new Date().toISOString().split("T")[0],
        status: "Active",
        placementType: "Employment",
        imageUrl: "",
      });
      setIsEditMode(false);
      setEditingId(null);
    }
    setSalaryError(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleViewModal = (placement: any) => {
    setFormData({
      clientId: placement.clientId?.toString() || "",
      companyName: placement.companyName || "",
      salary: placement.salary?.toString() || "",
      placementDate:
        placement.placementDate || new Date().toISOString().split("T")[0],
      status: placement.status || "Active",
      placementType: placement.placementType || "Employment",
      imageUrl: placement.imageUrl || "",
    });
    setEditingId(placement.id);
    setIsEditMode(false);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto pb-6">
        <header className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-md shadow-xl shadow-indigo-500/20">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black dark:text-white tracking-tight">
                Placement Registry
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse"></span>
                Synchronizing Nodes...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              color="blue"
              onClick={() => handleOpenModal()}
              className="rounded-md shadow-lg shadow-blue-500/20 px-6 h-12 bg-indigo-600 hover:bg-indigo-700 border-none transition-all active:scale-95 font-black uppercase tracking-widest text-[9px]"
            >
              <Plus size={18} className="mr-2" /> Record Placement
            </Button>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm relative z-30 mb-4">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10"
              />
              <input
                type="text"
                placeholder="Search company or candidate..."
                className="w-full pl-12 pr-10 py-2.5 bg-white dark:bg-gray-700/50 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors z-10"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-1 xl:pb-0 hide-scrollbar">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-md px-4 py-2.5 outline-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest min-w-[140px]"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Resigned</option>
                <option>Terminated</option>
              </select>
              <div className="flex items-center gap-2 border-l pl-3">
                {viewMode === "list" && (
                  <Dropdown
                    inline
                    label={
                      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                        <Filter size={16} className="text-blue-500" />
                        <span className="font-bold hidden sm:block">
                          Columns
                        </span>
                      </div>
                    }
                    arrowIcon={false}
                  >
                    {["commencement", "compensatory", "status"].map((col) => (
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
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(col)}
                            readOnly
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1 shrink-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    title="Grid View"
                    className={`p-2 rounded-md transition-all ${viewMode ==="grid"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    title="List View"
                    className={`p-2 rounded-md transition-all ${viewMode ==="list"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total Placements",
              value: stats?.totalPlacements || totalElements,
              icon: <Briefcase className="text-blue-500" />,
              color: "blue",
            },
            {
              label: "Active Roles",
              value:
                stats?.statusDistribution?.find((s: any) => s.name === "Active")
                  ?.value ||
                placements.filter((p: any) => p.status === "Active").length,
              icon: <Building className="text-emerald-500" />,
              color: "emerald",
            },
            {
              label: "Avg Salary",
              value:
                "$" +
                (
                  placements.reduce(
                    (acc: any, curr: any) =>
                      acc + (parseFloat(curr.salary) || 0),
                    0,
                  ) / (placements.length || 1)
                ).toFixed(2),
              icon: <DollarSign className="text-orange-500" />,
              color: "orange",
            },
          ].map((stat, i) => (
            <div key={i} className="border-none shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-md bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-black dark:text-white">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner size="xl" />
            <p className="text-gray-500 font-bold animate-pulse">
              Synchronizing Placement Ledger...
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="border-none shadow-lg dark:bg-gray-800">
            <div className="overflow-x-auto overflow-y-auto min-h-[400px] max-h-[55vh] custom-scrollbar pb-2">
              <Table className="dark:bg-gray-800 w-full min-w-[800px] relative">
                <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20 shadow-sm border-b">
                  <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">
                    Candidate
                  </TableHeadCell>
                  <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">
                    Enterprise Entity
                  </TableHeadCell>
                  {visibleColumns.includes("commencement") && (
                    <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">
                      Commencement
                    </TableHeadCell>
                  )}
                  {visibleColumns.includes("compensatory") && (
                    <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">
                      Compensatory
                    </TableHeadCell>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">
                      Status
                    </TableHeadCell>
                  )}
                  <TableHeadCell className="text-right py-3">
                    Action
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {placements.map((p: any, i: number) => (
                    <TableRow
                      key={i}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-extrabold text-gray-900 dark:text-white text-sm">
                        {p.clientName || `Client #${p.clientId}`}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-xs text-gray-950 dark:text-gray-100 uppercase tracking-tight">
                            {p.companyName}
                          </span>
                          <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md w-fit">
                            {p.placementType || "FIXED TERM"}
                          </span>
                        </div>
                      </TableCell>
                      {visibleColumns.includes("commencement") && (
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                            <Calendar size={12} className="text-gray-400" />
                            <span>
                              {p.placementDate
                                ? format(
                                    new Date(p.placementDate),
                                    "MMM dd, yyyy",
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("compensatory") && (
                        <TableCell className="px-6 py-4 font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                          ${p.salary || "—"}
                        </TableCell>
                      )}
                      {visibleColumns.includes("status") && (
                        <TableCell className="px-6 py-4">
                          <Badge
                            color={
                              p.status?.toLowerCase() === "active"
                                ? "success"
                                : p.status?.toLowerCase() === "terminated"
                                  ? "failure"
                                  : "gray"
                            }
                            className={`w-fit rounded-md px-3 py-1 font-black text-[9px] uppercase tracking-widest ${p.status?.toLowerCase() ==="resigned"?"!bg-orange-100 !text-orange-700 dark:!bg-orange-900/40 dark:!text-orange-400":""}`}
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell className="px-6 py-3 text-right">
                        <div className="flex justify-end">
                          <Dropdown
                            label={
                              <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                                <MoreVertical size={16} />
                              </div>
                            }
                            arrowIcon={false}
                            inline
                            className="!z-[9999] backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl !rounded-md p-2 min-w-[180px]"
                          >
                            <DropdownItem
                              onClick={() => handleViewModal(p)}
                              className="rounded-md mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <User size={14} />
                                </div>
                                <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                  View Details
                                </span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleOpenModal(p)}
                              className="rounded-md mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <Edit size={14} />
                                </div>
                                <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                  Edit Entry
                                </span>
                              </div>
                            </DropdownItem>
                            <DropdownDivider className="my-1" />
                            <DropdownItem
                              onClick={() => handleDeleteClick(p.id)}
                              className="rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <Trash2 size={14} />
                                </div>
                                <span className="font-bold text-xs text-rose-600">
                                  Remove Node
                                </span>
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
          <div className={getGridClass()}>
            {placements.map((p: any, i: number) => (
              <div
                key={i}
                className="border-none shadow-sm hover:shadow-xl transition-all dark:bg-gray-800 rounded-md focus-within:z-30 pt-8 pb-2 relative group h-full flex flex-col"
              >
                <div className="absolute right-4 top-4">
                  <Dropdown
                    inline
                    label={
                      <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                        <MoreVertical size={16} />
                      </div>
                    }
                    arrowIcon={false}
                    className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl rounded-md"
                  >
                    <DropdownItem
                      onClick={() => handleViewModal(p)}
                      className="font-bold text-xs text-emerald-600"
                    >
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>View Details</span>
                      </div>
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleOpenModal(p)}
                      className="font-bold text-xs text-blue-600"
                    >
                      <div className="flex items-center gap-2">
                        <Edit size={14} />
                        <span>Edit Entry</span>
                      </div>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                      onClick={() => handleDeleteClick(p.id)}
                      className="font-bold text-xs text-rose-600"
                    >
                      <div className="flex items-center gap-2">
                        <Trash2 size={14} />
                        <span>Remove Node</span>
                      </div>
                    </DropdownItem>
                  </Dropdown>
                </div>

                <div className="flex flex-col items-center flex-1 w-full h-full">
                  {/* Large Circular Avatar */}
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden ring-4 ring-gray-50 dark:ring-gray-700/50 shadow-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                    <User size={40} />
                  </div>

                  {/* Title & Subtitle */}
                  <h5 className="mb-1 text-xl font-black text-gray-900 dark:text-white text-center px-4 line-clamp-1">
                    {p.clientName || `Client #${p.clientId}`}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-center px-4 mb-4">
                    {p.placementType}
                  </span>

                  <div className="flex flex-wrap justify-center gap-2 mb-2 px-4 mt-auto">
                    <Badge
                      color="info"
                      className="rounded-md px-3 py-1 font-black text-[8px] uppercase tracking-widest"
                    >
                      {p.companyName}
                    </Badge>
                    <Badge
                      color="success"
                      className="rounded-md px-3 py-1 font-black text-[8px] uppercase tracking-widest"
                    >
                      ${p.salary || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4">
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

        <Modal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="lg"
          theme={{
            root: {
              base: "fixed inset-0 z-50 h-modal h-screen overflow-visible flex items-start pt-16 sm:pt-24 justify-center",
              show: {
                on: "flex bg-gray-900/50 dark:bg-gray-900/80",
                off: "hidden",
              },
            },
            content: {
              base: "relative h-auto w-full p-4",
              inner:
                "relative flex max-h-[90dvh] flex-col rounded-md bg-white shadow dark:bg-gray-700 overflow-y-auto",
            },
          }}
        >
          <div className="flex items-center justify-between p-5 border-b bg-white dark:bg-gray-800 rounded-t-md">
            <h3 className="text-xl font-black dark:text-white">
              {isViewMode
                ? "Placement Details"
                : isEditMode
                  ? "Modify Placement Record"
                  : "Initialize Placement"}
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-6 bg-white dark:bg-gray-800">
            <form
              id="placement-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <fieldset
                disabled={isViewMode}
                className="grid grid-cols-2 gap-6"
              >
                {/* Image Upload removed per user request */}

                <div>
                  <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">
                    Company Name
                  </Label>
                  <TextInput
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">
                    Commencement Date
                  </Label>
                  {isViewMode ? (
                    <div className="flex items-center justify-between w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {formData.placementDate
                          ? format(
                              new Date(formData.placementDate),
                              "MMM dd, yyyy",
                            )
                          : "N/A"}
                      </span>
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                  ) : (
                    <DatePicker
                      value={
                        formData.placementDate
                          ? new Date(formData.placementDate)
                          : null
                      }
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          placementDate: format(date, "yyyy-MM-dd"),
                        })
                      }
                      placeholder="Select commencement date..."
                    />
                  )}
                </div>
                <div>
                  <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">
                    Monthly Salary
                  </Label>
                  <TextInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salary}
                    onChange={(e) => {
                      if (!e.target.validity.valid) {
                        setSalaryError(
                          "Please enter a valid numerical amount.",
                        );
                      } else {
                        setSalaryError(null);
                      }
                      setFormData({ ...formData, salary: e.target.value });
                    }}
                    onInvalid={(e) => {
                      e.preventDefault();
                      setSalaryError("Please enter a valid numerical amount.");
                    }}
                    color={salaryError ? "failure" : "gray"}
                    placeholder="$0.00"
                  />
                  {salaryError && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-500 font-medium">
                      {salaryError}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">
                    Placement Category
                  </Label>
                  <Select
                    value={formData.placementType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        placementType: e.target.value,
                      })
                    }
                  >
                    {placementTypes.map((type: string, index: number) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">
                    Operational Status
                  </Label>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Active</option>
                    <option>Resigned</option>
                    <option>Terminated</option>
                  </Select>
                </div>
              </fieldset>
            </form>
          </ModalBody>
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
            <Button
              outline
              color="gray"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
            >
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button
                outline
                form="placement-form"
                type="submit"
                color="blue"
                size="sm"
                className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
              >
                {isEditMode ? "Update Record" : "Create Entry"}
              </Button>
            )}
          </ModalFooter>
        </Modal>

        {cropImageSrc && (
          <ImageCropperModal
            isOpen={isCropModalOpen}
            onClose={() => {
              setIsCropModalOpen(false);
              setCropImageSrc(null);
              setSelectedFile(null);
            }}
            imageSrc={cropImageSrc}
            onCropComplete={(croppedFile: File) => executeUpload(croppedFile)}
            onSkip={() => selectedFile && executeUpload(selectedFile)}
            aspectRatio={1}
          />
        )}

        <ConfirmModal
          show={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this placement record? This action is immutable."
        />
      </div>
    </>
  );
};

export default PlacementsPage;
