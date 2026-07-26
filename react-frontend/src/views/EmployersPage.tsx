import { useState, useEffect } from "react";
import { useNavigate } from '@/lib/react-router-compat';
import { useDebounce } from "../hooks/useDebounce";
import { Button, Badge, Spinner, TextInput, Label, Modal, Textarea, Select, ModalHeader, ModalBody, Dropdown, DropdownItem, DropdownDivider, ModalFooter } from '@/lib/flowbite-compat';
import ModernPagination from "@/components/common/ModernPagination";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import {
  Edit,
  Trash2,
  Filter,
  LayoutGrid,
  List,
  Camera,
  Building2,
  X,
  Search,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe,
  MoreVertical,
  ChevronDown,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import DataCard from "../components/ui/DataCard";
import SearchInput from "@/components/common/SearchInput";

const EmployersPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employers, setEmployers] = useState<any[]>([]);
  const [jobCategories, setJobCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "category",
    "contact",
    "phone",
    "status",
  ]);
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const getGridClass = () => {
    return `grid gap-6 ${itemsPerRow === "3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : itemsPerRow === "5"
          ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`;
  };
  const PAGE_SIZE = viewMode === "grid" ? 9 : 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const companyColSpan =
    12 -
    (visibleColumns.includes("category") ? 2 : 0) -
    (visibleColumns.includes("contact") ? 2 : 0) -
    (visibleColumns.includes("phone") ? 2 : 0) -
    (visibleColumns.includes("status") ? 1 : 0) -
    1;

  const getCompanyColSpanClass = () => {
    switch (companyColSpan) {
      case 4:
        return "md:col-span-4 col-span-4";
      case 5:
        return "md:col-span-5 col-span-5";
      case 6:
        return "md:col-span-6 col-span-6";
      case 7:
        return "md:col-span-7 col-span-7";
      case 8:
        return "md:col-span-8 col-span-8";
      case 9:
        return "md:col-span-9 col-span-9";
      case 10:
        return "md:col-span-10 col-span-10";
      case 11:
        return "md:col-span-11 col-span-11";
      default:
        return "md:col-span-4 col-span-4";
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    jobCategoryId: "" as any,
    contactPerson: "",
    contactPhone: "",
    email: "",
    address: "",
    website: "",
    status: "Active",
    logoUrl: "",
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchEmployers(currentPage - 1, PAGE_SIZE, debouncedSearchTerm);
    fetchConnections();
  }, [currentPage, debouncedSearchTerm, viewMode]);

  useEffect(() => {
    api
      .get("/job-categories")
      .then((res) => {
        const data = res.data;
        setJobCategories(
          Array.isArray(data.content)
            ? data.content
            : Array.isArray(data)
              ? data
              : [],
        );
      })
      .catch(() => { });
  }, []);

  const fetchConnections = async () => {
    try {
      const res = await api.get("/connections");
      setConnections(res.data);
    } catch (e) { }
  };

  const fetchEmployers = async (page = 0, size = 9, search = "") => {
    try {
      setLoading(true);
      const response = await api.get(
        `/employers?page=${page}&size=${size}&search=${search}`,
      );
      const data = response.data;
      setEmployers(data.content || (Array.isArray(data) ? data : []));
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      toast.error("Failed to load employers data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingId) {
        await api.put(`/employers/${editingId}`, formData);
        toast.success("Employer record updated");
      } else {
        await api.post("/employers", formData);
        toast.success("New employer registered");
      }
      setIsModalOpen(false);
      resetForm();
      fetchEmployers();
    } catch (err) {
      toast.error("Failed to save employer");
    }
  };

  const handleEdit = (employer: any) => {
    setFormData({
      name: employer.name || "",
      jobCategoryId: employer.jobCategoryId || "",
      contactPerson: employer.contactPerson || "",
      contactPhone: employer.contactPhone || "",
      email: employer.email || "",
      address: employer.address || "",
      website: employer.website || "",
      status: employer.status || "Active",
      logoUrl: employer.logoUrl || "",
    });
    setEditingId(employer.id);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (employer: any) => {
    setFormData({
      name: employer.name || "",
      jobCategoryId: employer.jobCategoryId || "",
      contactPerson: employer.contactPerson || "",
      contactPhone: employer.contactPhone || "",
      email: employer.email || "",
      address: employer.address || "",
      website: employer.website || "",
      status: employer.status || "Active",
      logoUrl: employer.logoUrl || "",
    });
    setIsEditMode(false);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/employers/${itemToDelete}`);
      toast.success("Employer removed");
      fetchEmployers();
    } catch (err) {
      toast.error("Failed to delete employer");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      jobCategoryId: "",
      contactPerson: "",
      contactPhone: "",
      email: "",
      address: "",
      website: "",
      status: "Active",
      logoUrl: "",
    });
    setEditingId(null);
    setIsEditMode(false);
    setIsViewMode(false);
  };

  const paginatedEmployers = employers;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, viewMode]);

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black dark:text-white tracking-tight">
              Partner Employers
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Manage corporate partnerships and placement sites
            </p>
          </div>
          <Button
            color="blue"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="rounded-md shadow-xl shadow-blue-500/20 px-4"
          >
            <Plus size={20} className="mr-2" /> Add New Employer
          </Button>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm relative z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchInput
                        placeholder="Search by company name, contact, or industry..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                        containerClassName="flex-1"
                      />
            <div className="flex items-center gap-2">
              {viewMode === "list" && (
                <Dropdown
                  inline
                  label={
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer">
                      <Filter size={16} className="text-blue-500" />
                      <span className="font-bold hidden sm:block">Columns</span>
                    </div>
                  }
                  arrowIcon={false}
                >
                  {["category", "contact", "phone", "status"].map((col) => (
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
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="List View"
                  className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "grid" && (
          <div className={getGridClass()}>
            {loading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Spinner size="xl" />
              </div>
            ) : (
              paginatedEmployers.map((employer) => (
                <DataCard
                  key={employer.id}
                  title={employer.name}
                  subtitle={employer.jobCategoryName || "General Industry"}
                  imageUrl={employer.logoUrl}
                  fallbackIcon={
                    <Building2
                      className="text-gray-300 dark:text-gray-600"
                      size={32}
                    />
                  }
                  statusLabel={employer.status || "Active"}
                  statusColorClass={
                    employer.status === "Active"
                      ? "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400"
                      : "border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400"
                  }
                  customBadges={
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border-blue-100 dark:border-blue-800">
                      {employer.address?.split(",")[0] || "Phnom Penh"}
                    </span>
                  }
                  dropdownItems={
                    <>
                      <DropdownItem
                        onClick={() =>
                          setTimeout(() => handleView(employer), 0)
                        }
                        className="font-bold text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        <div className="flex items-center gap-2">
                          <Search size={14} />
                          <span>{t("view_details")}</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem
                        onClick={() =>
                          setTimeout(() => handleEdit(employer), 0)
                        }
                        className="font-bold text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <div className="flex items-center gap-2">
                          <Edit size={14} />
                          <span>{t("update_details")}</span>
                        </div>
                      </DropdownItem>
                      <DropdownDivider />
                      <DropdownItem
                        onClick={() =>
                          setTimeout(() => {
                            setItemToDelete(employer.id);
                            setIsConfirmOpen(true);
                          }, 0)
                        }
                        className="font-bold text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 size={14} />
                          <span>{t("purge_record")}</span>
                        </div>
                      </DropdownItem>
                    </>
                  }
                  actionButtons={
                    <div className="flex gap-2 mt-0">
                      <Button
                        onClick={async () => {
                          const isConnected = connections.some(
                            (c) =>
                              c.targetType === "EMPLOYER" &&
                              c.targetId === String(employer.id),
                          );
                          if (isConnected) {
                            try {
                              await api.delete(
                                `/connections/EMPLOYER/${employer.id}`,
                              );
                              setConnections((prev) =>
                                prev.filter(
                                  (c) =>
                                    !(
                                      c.targetType === "EMPLOYER" &&
                                      c.targetId === String(employer.id)
                                    ),
                                ),
                              );
                              toast.success("Removed from network");
                            } catch (err) {
                              toast.error("Failed to remove");
                            }
                          } else {
                            try {
                              const res = await api.post("/connections", {
                                targetId: String(employer.id),
                                targetType: "EMPLOYER",
                                targetName: employer.name,
                                targetAvatar: employer.logoUrl || "",
                              });
                              setConnections((prev) => [...prev, res.data]);
                              toast.success("Added to your network!");
                            } catch (err) {
                              toast.error("Failed to add");
                            }
                          }
                        }}
                        title={
                          connections.some(
                            (c) =>
                              c.targetType === "EMPLOYER" &&
                              c.targetId === String(employer.id),
                          )
                            ? "Remove connection"
                            : "Add to network"
                        }
                        className={`!rounded transition-all w-9 h-9 flex items-center justify-center !p-0 ${connections.some((c) => c.targetType === "EMPLOYER" && c.targetId === String(employer.id),) ? "border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "border-blue-600 bg-blue-600 hover:bg-blue-700 text-white"}`}
                      >
                        {connections.some(
                          (c) =>
                            c.targetType === "EMPLOYER" &&
                            c.targetId === String(employer.id),
                        ) ? (
                          <UserPlus size={16} className="hidden" />
                        ) : (
                          <UserPlus size={16} />
                        )}
                        {connections.some(
                          (c) =>
                            c.targetType === "EMPLOYER" &&
                            c.targetId === String(employer.id),
                        ) && (
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
                          navigate(
                            `/chat?chatWith=${encodeURIComponent(employer.name)}`,
                          );
                        }}
                        title="Message"
                        className="!rounded border-blue-500 bg-white hover:bg-blue-50 text-blue-600 transition-all w-9 h-9 flex items-center justify-center !p-0 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
                      >
                        <MessageSquare size={16} />
                      </Button>
                    </div>
                  }
                />
              ))
            )}
            {employers.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <Building2 size={64} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-xl font-bold dark:text-white">
                  No Employers Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or add a new partner.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Employer List View */}
        {viewMode === "list" && (
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Spinner size="xl" />
              </div>
            ) : employers.length === 0 ? (
              <div className="py-20 text-center">
                <Building2 size={64} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-xl font-bold dark:text-white">
                  No Employers Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or add a new partner.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
                <div className="min-w-[800px]">
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {/* List Header */}
                    <div className="sticky top-0 z-20 hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/90 dark:bg-gray-700/90 backdrop-blur-md border-b shadow-sm">
                      <div
                        className={`${getCompanyColSpanClass()} text-[10px] font-black text-gray-400 uppercase tracking-widest`}
                      >
                        Company
                      </div>
                      {visibleColumns.includes("category") && (
                        <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Category
                        </div>
                      )}
                      {visibleColumns.includes("contact") && (
                        <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Contact
                        </div>
                      )}
                      {visibleColumns.includes("phone") && (
                        <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Phone
                        </div>
                      )}
                      {visibleColumns.includes("status") && (
                        <div className="col-span-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Status
                        </div>
                      )}
                      <div className="col-span-1 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                        Actions
                      </div>
                    </div>
                    {paginatedEmployers.map((employer) => (
                      <div
                        key={employer.id}
                        className="relative z-10 hover:z-30 focus-within:z-40 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-colors group items-start md:items-center border-b border-gray-100 dark:border-gray-800/60"
                      >
                        {/* Company & Actions Row for Mobile Flex / Desktop Grid */}
                        <div className="w-full md:w-auto flex items-center justify-between md:contents">
                          <div
                            className={`${getCompanyColSpanClass()} flex items-center gap-3 min-w-0 flex-1 md:flex-initial`}
                          >
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-sm shrink-0 border border-gray-100 dark:border-gray-600">
                              {employer.logoUrl ? (
                                <img
                                  src={employer.logoUrl}
                                  alt={employer.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="text-blue-600 dark:text-blue-400" size={18} />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-900 dark:text-white truncate text-sm">
                                {employer.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                                <Mail size={10} /> {employer.email || "no-email"}
                              </p>
                            </div>
                          </div>

                          {/* Actions Menu (Pinned Top-Right on Mobile, Column 12 on Desktop) */}
                          <div className="md:col-span-1 flex justify-end shrink-0 md:order-last">
                            <Dropdown
                              inline
                              label={
                                <div className="p-2 text-gray-400 hover:text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md cursor-pointer">
                                  <MoreVertical size={18} />
                                </div>
                              }
                              arrowIcon={false}
                              className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl !rounded-md p-2 min-w-[180px]"
                            >
                              <DropdownItem
                                onClick={() =>
                                  setTimeout(() => handleView(employer), 0)
                                }
                                className="rounded-md mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-md group-hover/item:scale-110 transition-transform">
                                    <Search size={14} />
                                  </div>
                                  <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                    {t("view_details")}
                                  </span>
                                </div>
                              </DropdownItem>

                              <DropdownItem
                                onClick={() => {
                                  navigate(
                                    `/chat?chatWith=${encodeURIComponent(employer.name)}`,
                                  );
                                }}
                                className="rounded-md mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-md group-hover/item:scale-110 transition-transform">
                                    <MessageSquare size={14} />
                                  </div>
                                  <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                    {t("message")}
                                  </span>
                                </div>
                              </DropdownItem>

                              <DropdownItem
                                onClick={() =>
                                  setTimeout(() => handleEdit(employer), 0)
                                }
                                className="rounded-md mb-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 group/item"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-md group-hover/item:scale-110 transition-transform">
                                    <Edit size={14} />
                                  </div>
                                  <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                    {t("edit")}
                                  </span>
                                </div>
                              </DropdownItem>

                              <DropdownItem
                                onClick={() =>
                                  setTimeout(() => {
                                    setItemToDelete(employer.id);
                                    setIsConfirmOpen(true);
                                  }, 0)
                                }
                                className="rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-md group-hover/item:scale-110 transition-transform">
                                    <Trash2 size={14} />
                                  </div>
                                  <span className="font-bold text-xs text-rose-600 dark:text-rose-400">
                                    {t("delete")}
                                  </span>
                                </div>
                              </DropdownItem>
                            </Dropdown>
                          </div>
                        </div>

                        {/* Category */}
                        {visibleColumns.includes("category") && (
                          <div className="md:col-span-2 text-xs">
                            <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md inline-block">
                              {employer.jobCategoryName || "General"}
                            </span>
                          </div>
                        )}
                        {/* Contact Person */}
                        {visibleColumns.includes("contact") && (
                          <div className="md:col-span-2 text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium truncate">
                            {employer.contactPerson || "—"}
                          </div>
                        )}
                        {/* Phone */}
                        {visibleColumns.includes("phone") && (
                          <div className="md:col-span-2 text-xs md:text-sm text-gray-500 flex items-center gap-1.5 font-mono">
                            <Phone
                              size={13}
                              className="text-gray-400 shrink-0"
                            />
                            {employer.contactPhone || "—"}
                          </div>
                        )}
                        {/* Status */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <ModernPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
              totalItems={totalElements}
              pageSize={PAGE_SIZE}
            />
          </div>
        )}
        <Modal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="lg"
        >
          <CustomModalHeader
            title={
              isViewMode
                ? "Employer Details"
                : isEditMode
                  ? "Edit Employer"
                  : "Register New Employer"
            }
            subtitle={
              isViewMode
                ? "Read-only profile view"
                : "Corporate partner information"
            }
            onClose={() => setIsModalOpen(false)}
          />
          <ModalBody className="!p-0 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-800 py-6 px-8 border-b flex justify-end items-center">
              <div className="relative group">
                <div className="w-20 h-20 rounded-md bg-gray-50 dark:bg-gray-700/50 border-2 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                  {formData.logoUrl ? (
                    <>
                      <img
                        src={formData.logoUrl}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData({ ...formData, logoUrl: "" });
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </>
                  ) : (
                    <Building2 className="text-gray-300" size={32} />
                  )}
                </div>
                {!isViewMode && (
                  <label className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-md cursor-pointer shadow-lg hover:bg-blue-700 transition-all">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="px-8 pb-4 pt-6">
              <form
                id="employer-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label className="mb-1 block">Company Name</Label>
                    <TextInput
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Industry / Category</Label>
                    <Select
                      value={formData.jobCategoryId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobCategoryId: e.target.value
                            ? parseInt(e.target.value)
                            : "",
                        })
                      }
                      disabled={isViewMode}
                    >
                      <option value="">-- Select Category --</option>
                      {jobCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block">Status</Label>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      disabled={isViewMode}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block">Contact Person</Label>
                    <TextInput
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPerson: e.target.value,
                        })
                      }
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Contact Phone</Label>
                    <TextInput
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPhone: e.target.value,
                        })
                      }
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Email</Label>
                    <TextInput
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Website</Label>
                    <TextInput
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-1 block">Address</Label>
                    <Textarea
                      rows={3}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </form>
            </div>
          </ModalBody>
          <CustomModalFooter
            onClose={() => setIsModalOpen(false)}
            isEditMode={isEditMode && !isViewMode}
            submitText={
              isViewMode
                ? undefined
                : isEditMode
                  ? "Update Record"
                  : "Save Employer"
            }
            cancelText={isViewMode ? "Close" : "Cancel"}
            formId={!isViewMode ? "employer-form" : undefined}
            onSubmit={isViewMode ? () => setIsModalOpen(false) : undefined}
          />
        </Modal>
        <ConfirmModal
          show={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this employer? This will also remove all linked job vacancies."
        />
      </div>
    </>
  );
};

export default EmployersPage;
