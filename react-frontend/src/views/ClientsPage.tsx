import { useState, useEffect } from "react";
import {
  Spinner,
  Button,
  Alert,
  Card,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  Avatar,
} from '@/lib/flowbite-compat';
import {
  Plus,
  AlertCircle,
  Activity,
  LayoutGrid,
  List,
  User,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  UserPlus,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from '@/lib/react-router-compat';
import api from "../services/api";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import ModernPagination from "@/components/common/ModernPagination";
import { useDebounce } from "../hooks/useDebounce";

// Modular Components
import ClientFilters from "@/features/clients/components/ClientFilters";
import ClientTable from "@/features/clients/components/ClientTable";
import ClientRegistrationModal from "@/features/clients/components/ClientRegistrationModal";

interface Client {
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

const ClientsPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    branch: "",
    status: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [connections, setConnections] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "clientCode",
    "branch",
    "status",
  ]);
  const [gridDensity, setGridDensity] = useState<
    "large" | "medium" | "compact"
  >("medium");

  const getGridClass = () => {
    switch (gridDensity) {
      case "large":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 items-start";
      case "medium":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 items-start";
      case "compact":
        return "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 items-start";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 items-start";
    }
  };

  const debouncedFilters = useDebounce(filters, 500);

  // Query for Clients with Pagination
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["clients", debouncedFilters, currentPage, pageSize],
    queryFn: async () => {
      const params = {
        page: currentPage - 1,
        size: pageSize,
        name: debouncedFilters.search,
        branch: debouncedFilters.branch,
        status: debouncedFilters.status,
      };
      const response = await api.get("/clients", { params });
      return response.data;
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
    } catch (e) {}
  };

  const clients = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newClient: any) => api.post("/clients", newClient),
    onSuccess: (response) => {
      queryClient.setQueriesData({ queryKey: ["clients"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: [response.data, ...oldData.content],
          totalElements: (oldData.totalElements || 0) + 1,
        };
      });
      toast.success("Client created! Now add advanced details.");
      // Switch to edit mode with the new ID — modal stays open, wizard advances to step 4
      if (response.data && response.data.id) {
        setEditingId(response.data.id);
        setIsEditMode(true);
      } else {
        setIsModalOpen(false);
      }
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const dataMsg =
        error.response?.data?.message || error.response?.data || error.message;
      toast.error(
        `Failed to register client (${status || "Network Error"}): ${typeof dataMsg === "object" ? JSON.stringify(dataMsg) : dataMsg}`,
      );
      console.error("Create client error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/clients/${id}`, data),
    onSuccess: (response, variables) => {
      queryClient.setQueriesData({ queryKey: ["clients"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.map((client: any) =>
            client.id === variables.id
              ? { ...client, ...response.data }
              : client,
          ),
        };
      });
      toast.success("Client profile updated");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const dataMsg =
        error.response?.data?.message || error.response?.data || error.message;
      toast.error(
        `Failed to update client (${status || "Network Error"}): ${typeof dataMsg === "object" ? JSON.stringify(dataMsg) : dataMsg}`,
      );
      console.error("Update client error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/clients/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueriesData({ queryKey: ["clients"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.filter((client: any) => client.id !== id),
          totalElements: Math.max(0, (oldData.totalElements || 1) - 1),
        };
      });
      toast.success("Client removed successfully");
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clientCode: "",
    branch: "Phnom Penh",
    gender: "Male",
    status: "Active",
    email: "",
    contactPhone: "",
    photo: "",
    dateOfBirth: "",
    relativePhone: "",
    maritalStatus: "Single",
    address: "",
    province: "Phnom Penh",
    idCard: "",
    currentSituation: "",
    furtherEducation: false,
    placement: false,
    trainingFromFutures: false,
    socialSupportRequired: false,
    hearBy: "",
    expectedSupport: "",
    placeOfBirth: "",
    nationality: "Cambodian",
    citizenship: "Cambodian",
    height: "",
    weight: "",
    socialSupportProblem: "",
    idpoorStatus: "No",
    idpoorValiddate: "",
    idpoorLevel: "",
    idpoorAccountNumber: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (client: Client) => {
    let safeDob = "";
    if (client.dateOfBirth) {
      try {
        safeDob = new Date(client.dateOfBirth).toISOString().split("T")[0];
      } catch (e) {
        safeDob = "";
      }
    }
    let safeIdPoor = "";
    if (client.idpoorValiddate) {
      try {
        safeIdPoor = new Date(client.idpoorValiddate)
          .toISOString()
          .split("T")[0];
      } catch (e) {
        safeIdPoor = "";
      }
    }

    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      clientCode: client.clientCode,
      branch: client.branch,
      gender: client.gender,
      status: client.status,
      email: client.email || "",
      contactPhone: client.contactPhone || "",
      photo: client.photo || "",
      dateOfBirth: safeDob,
      relativePhone: client.relativePhone || "",
      maritalStatus: client.maritalStatus || "Single",
      address: client.address || "",
      province: client.province || "Phnom Penh",
      idCard: client.idCard || "",
      currentSituation: client.currentSituation || "",
      furtherEducation: client.furtherEducation || false,
      placement: client.placement || false,
      trainingFromFutures: client.trainingFromFutures || false,
      socialSupportRequired: client.socialSupportRequired || false,
      hearBy: client.hearBy || "",
      expectedSupport: client.expectedSupport || "",
      placeOfBirth: client.placeOfBirth || "",
      nationality: client.nationality || "Cambodian",
      citizenship: client.citizenship || "Cambodian",
      height: client.height || "",
      weight: client.weight || "",
      socialSupportProblem: client.socialSupportProblem || "",
      idpoorStatus: client.idpoorStatus || "No",
      idpoorValiddate: safeIdPoor,
      idpoorLevel: client.idpoorLevel || "",
      idpoorAccountNumber: client.idpoorAccountNumber || "",
    });
    setEditingId(client.id);
    setIsEditMode(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format dates for backend (LocalDateTime requires time component)
    const payload: any = { ...formData };
    if (payload.dateOfBirth && payload.dateOfBirth.length === 10) {
      payload.dateOfBirth = `${payload.dateOfBirth}T00:00:00`;
    } else if (!payload.dateOfBirth) {
      payload.dateOfBirth = null;
    }

    if (payload.idpoorValiddate && payload.idpoorValiddate.length === 10) {
      payload.idpoorValiddate = `${payload.idpoorValiddate}T00:00:00`;
    } else if (!payload.idpoorValiddate) {
      payload.idpoorValiddate = null;
    }

    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      clientCode: "",
      branch: "Phnom Penh",
      gender: "Male",
      status: "Active",
      email: "",
      contactPhone: "",
      photo: "",
      dateOfBirth: "",
      relativePhone: "",
      maritalStatus: "Single",
      address: "",
      province: "Phnom Penh",
      idCard: "",
      currentSituation: "",
      furtherEducation: false,
      placement: false,
      trainingFromFutures: false,
      socialSupportRequired: false,
      hearBy: "",
      expectedSupport: "",
      placeOfBirth: "",
      nationality: "Cambodian",
      citizenship: "Cambodian",
      height: "",
      weight: "",
      socialSupportProblem: "",
      idpoorStatus: "No",
      idpoorValiddate: "",
      idpoorLevel: "",
      idpoorAccountNumber: "",
    });
  };

  return (
    <>
      <div className="space-y-4 animate-fade-in max-w-[1600px] mx-auto">
        <header className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-md shadow-xl shadow-indigo-500/20">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black dark:text-white tracking-tight">
                Client Registry
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse"></span>
                Syncing with Central Database
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                setIsEditMode(false);
                setEditingId(null);
                resetForm();
                setIsModalOpen(true);
              }}
              className="rounded-md px-6 h-12 bg-indigo-600 hover:bg-indigo-700 border-none shadow-xl shadow-indigo-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[9px]"
            >
              <Plus size={18} className="mr-2" /> New Registration
            </Button>
          </div>
        </header>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 shadow-sm overflow-hidden">
            <ClientFilters
              filters={filters}
              setFilters={setFilters}
              viewMode={viewMode}
              setViewMode={setViewMode}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              gridDensity={gridDensity}
              setGridDensity={setGridDensity}
            />

            {loading && clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500 dark:text-gray-400">
                <Spinner size="xl" />
                <span className="mt-6 animate-pulse font-black uppercase text-[10px] tracking-[0.2em]">
                  Synchronizing Nodes...
                </span>
              </div>
            ) : error ? (
              <div className="p-20 text-center">
                <Alert
                  color="failure"
                  icon={AlertCircle}
                  className="max-w-md mx-auto mb-8 rounded-md"
                >
                  Failed to sync with node.
                </Alert>
              </div>
            ) : (
              <div className="p-4">
                {viewMode === "list" ? (
                  <ClientTable
                    clients={clients}
                    visibleColumns={visibleColumns}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    connections={connections}
                    toggleConnection={async (client: Client) => {
                      const isConnected = connections.some(
                        (c) =>
                          c.targetType === "CLIENT" &&
                          c.targetId === String(client.id),
                      );
                      if (isConnected) {
                        try {
                          await api.delete(`/connections/CLIENT/${client.id}`);
                          setConnections((prev) =>
                            prev.filter(
                              (c) =>
                                !(
                                  c.targetType === "CLIENT" &&
                                  c.targetId === String(client.id)
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
                            targetId: String(client.id),
                            targetType: "CLIENT",
                            targetName: `${client.firstName} ${client.lastName}`,
                            targetAvatar: client.photo || "",
                          });
                          setConnections((prev) => [...prev, res.data]);
                          toast.success("Added to your network!");
                        } catch (err) {
                          toast.error("Failed to add");
                        }
                      }
                    }}
                    handleMessage={(client: Client) => {
                      navigate(
                        `/chat?chatWith=${encodeURIComponent(client.firstName + " " + client.lastName)}`,
                      );
                    }}
                  />
                ) : (
                  <div className={getGridClass()}>
                    {clients.map((client: Client) => (
                      <div
                        key={client.id}
                        className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 rounded-md focus-within:z-30 p-4 relative group hover:shadow-md transition-shadow h-full flex flex-col"
                      >
                        {/* Top Dropdown Action */}
                        <div className="absolute right-2 top-2">
                          <Dropdown
                            inline
                            label={
                              <div className="p-2 text-gray-400 hover:text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md cursor-pointer">
                                <MoreVertical size={20} />
                              </div>
                            }
                            arrowIcon={false}
                            className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl !rounded-md p-2 min-w-[180px]"
                          >
                            <DropdownItem
                              onClick={() =>
                                setTimeout(
                                  () => navigate(`/clients/${client.id}`),
                                  0,
                                )
                              }
                              className="rounded-md mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <ExternalLink size={14} />
                                </div>
                                <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                  View Profile
                                </span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                setTimeout(() => handleEdit(client), 0)
                              }
                              className="rounded-md mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <Edit size={14} />
                                </div>
                                <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                                  Edit Profile
                                </span>
                              </div>
                            </DropdownItem>
                            <DropdownDivider className="my-1 border-gray-100 dark:border-gray-700" />
                            <DropdownItem
                              onClick={() =>
                                setTimeout(() => handleDelete(client.id), 0)
                              }
                              className="rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <Trash2 size={14} />
                                </div>
                                <span className="font-bold text-xs text-rose-600">
                                  Delete
                                </span>
                              </div>
                            </DropdownItem>
                          </Dropdown>
                        </div>

                        <div className="flex flex-col items-center flex-1">
                          {/* Large Circular Avatar */}
                          <div className="w-16 h-16 mb-2 rounded-full overflow-hidden ring-4 ring-gray-50 dark:ring-gray-700/50 shadow-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                            {client.photo ? (
                              <img
                                src={client.photo}
                                alt={client.firstName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={32} className="text-indigo-600" />
                            )}
                          </div>

                          {/* Title & Subtitle */}
                          <h5 className="mb-1 text-lg font-black text-gray-900 dark:text-white text-center px-4">
                            {client.firstName} {client.lastName}
                          </h5>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-center px-4 mb-3">
                            {client.clientCode}
                          </span>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-auto">
                            <Button
                              onClick={async () => {
                                const isConnected = connections.some(
                                  (c) =>
                                    c.targetType === "CLIENT" &&
                                    c.targetId === String(client.id),
                                );
                                if (isConnected) {
                                  try {
                                    await api.delete(
                                      `/connections/CLIENT/${client.id}`,
                                    );
                                    setConnections((prev) =>
                                      prev.filter(
                                        (c) =>
                                          !(
                                            c.targetType === "CLIENT" &&
                                            c.targetId === String(client.id)
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
                                      targetId: String(client.id),
                                      targetType: "CLIENT",
                                      targetName: `${client.firstName} ${client.lastName}`,
                                      targetAvatar: client.photo || "",
                                    });
                                    setConnections((prev) => [
                                      ...prev,
                                      res.data,
                                    ]);
                                    toast.success("Added to your network!");
                                  } catch (err) {
                                    toast.error("Failed to add");
                                  }
                                }
                              }}
                              title={
                                connections.some(
                                  (c) =>
                                    c.targetType === "CLIENT" &&
                                    c.targetId === String(client.id),
                                )
                                  ? "Remove connection"
                                  : "Add to network"
                              }
                              className={`!rounded border transition-all w-9 h-9 flex items-center justify-center !p-0 ${
                                connections.some(
                                  (c) =>
                                    c.targetType === "CLIENT" &&
                                    c.targetId === String(client.id),
                                )
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  : "border-blue-600 bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                            >
                              {connections.some(
                                (c) =>
                                  c.targetType === "CLIENT" &&
                                  c.targetId === String(client.id),
                              ) ? (
                                <UserPlus size={16} className="hidden" />
                              ) : (
                                <UserPlus size={16} />
                              )}
                              {connections.some(
                                (c) =>
                                  c.targetType === "CLIENT" &&
                                  c.targetId === String(client.id),
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
                                  `/chat?chatWith=${encodeURIComponent(client.firstName + " " + client.lastName)}`,
                                );
                              }}
                              title="Message"
                              className="!rounded border border-blue-500 bg-white hover:bg-blue-50 text-blue-600 transition-all w-9 h-9 flex items-center justify-center !p-0 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
                            >
                              <MessageSquare size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/*  */}
                {totalPages > 1 && (
                  <div className="mt-6 border-t dark:border-gray-700 pt-6">
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
              </div>
            )}
          </div>
        </div>

        <ClientRegistrationModal
          clientId={editingId || undefined}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isEditMode={isEditMode}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handlePhotoChange={handlePhotoChange}
        />

        <ConfirmModal
          show={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this client? This action is immutable and will remove all associated case data."
        />
      </div>
    </>
  );
};

export default ClientsPage;
