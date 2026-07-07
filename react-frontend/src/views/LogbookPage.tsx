import { useState, useEffect } from "react";
import {Button, Badge, Spinner, Modal, Dropdown, DropdownItem, DropdownDivider, Label, TextInput, Checkbox, Textarea, Select, ModalHeader, ModalBody} from '@/lib/flowbite-compat';
import ModernPagination from "@/components/common/ModernPagination";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import {
  Plus,
  History,
  Monitor,
  Library,
  Briefcase,
  Trash2,
  Edit3,
  Calendar,
  User,
  Search,
  X,
  MoreVertical,
} from "lucide-react";
import Layout from "@/components/common/Layout";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";

const LogbookPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({
    gender: "Male",
    phone: "",
    note: "",
    jobinformation: false,
    library: false,
    usingComputer: false,
    futureService: false,
    interviewTechic: false,
    shortTraining: false,
    user: "Super Admin",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/logbooks", {
        params: { page, size: 10, search },
      });
      setLogs(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load logbook entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingId) {
        await api.put(`/logbooks/${editingId}`, formData);
        toast.success("Logbook entry updated");
      } else {
        await api.post("/logbooks", formData);
        toast.success("Logbook entry saved");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setIsViewMode(false);
      setEditingId(null);
      fetchLogs();
      setFormData({
        gender: "Male",
        phone: "",
        note: "",
        jobinformation: false,
        library: false,
        usingComputer: false,
        futureService: false,
        interviewTechic: false,
        shortTraining: false,
        user: "Super Admin",
      });
      toast.success("Logbook entry saved");
    } catch (err) {
      toast.error("Failed to save log entry");
    }
  };

  const handleEdit = (log: any) => {
    setFormData({
      gender: log.gender || "Male",
      phone: log.phone || "",
      note: log.note || "",
      jobinformation: log.jobinformation || false,
      library: log.library || false,
      usingComputer: log.usingComputer || false,
      futureService: log.futureService || false,
      interviewTechic: log.interviewTechic || false,
      shortTraining: log.shortTraining || false,
      user: log.user || "Super Admin",
    });
    setEditingId(log.id);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (log: any) => {
    setFormData({
      gender: log.gender || "Male",
      phone: log.phone || "",
      note: log.note || "",
      jobinformation: log.jobinformation || false,
      library: log.library || false,
      usingComputer: log.usingComputer || false,
      futureService: log.futureService || false,
      interviewTechic: log.interviewTechic || false,
      shortTraining: log.shortTraining || false,
      user: log.user || "Super Admin",
    });
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
    try {
      await api.delete(`/logbooks/${itemToDelete}`);
      toast.success("Log entry removed");
      fetchLogs();
    } catch (err) {
      toast.error("Failed to delete log entry");
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title={t("logbook")}>
      <div className="space-y-6 animate-fade-in">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold dark:text-white">
              {t("attendanceActivityLog")}
            </h2>
            <p className="text-sm text-gray-500">
              Track daily walk-in services and facility usage
            </p>
          </div>
          <Button
            color="blue"
            onClick={() => {
              setIsEditMode(false);
              setIsViewMode(false);
              setFormData({
                gender: "Male",
                phone: "",
                note: "",
                jobinformation: false,
                library: false,
                usingComputer: false,
                futureService: false,
                interviewTechic: false,
                shortTraining: false,
                user: "Super Admin",
              });
              setIsModalOpen(true);
            }}
            className="rounded-md shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} className="mr-2" /> {t("quickEntry")}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: t("todayEntries"),
              count: logs.length,
              icon: <History className="text-blue-500" />,
            },
            {
              label: t("computerLab"),
              count: logs.filter((l) => l.usingComputer).length,
              icon: <Monitor className="text-emerald-500" />,
            },
            {
              label: t("libraryUse"),
              count: logs.filter((l) => l.library).length,
              icon: <Library className="text-orange-500" />,
            },
            {
              label: t("jobGuidance"),
              count: logs.filter((l) => l.jobinformation).length,
              icon: <Briefcase className="text-indigo-500" />,
            },
          ].map((stat, i) => (
            <div key={i} className="border-none shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-xl font-black dark:text-white">
                    {stat.count}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by note or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-800 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white transition-all shadow-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(0);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <DataTable
          columns={[
            {
              key: "timestamp",
              label: "Timestamp",
              className: "font-medium dark:text-white",
              render: (log) =>
                log.enrollDate
                  ? format(new Date(log.enrollDate), "MMM dd, HH:mm")
                  : "N/A",
            },
            {
              key: "gender",
              label: "Gender",
              render: (log) => <Badge color="gray">{log.gender}</Badge>,
            },
            {
              key: "services",
              label: "Services Used",
              render: (log) => (
                <div className="flex flex-wrap gap-1">
                  {log.usingComputer && <Badge color="indigo">IT Lab</Badge>}
                  {log.library && <Badge color="orange">Library</Badge>}
                  {log.jobinformation && (
                    <Badge color="success">Job Info</Badge>
                  )}
                  {log.futureService && <Badge color="warning">Future</Badge>}
                </div>
              ),
            },
            {
              key: "note",
              label: "Note",
              className: "text-gray-500 dark:text-gray-400 max-w-xs truncate",
              render: (log) => log.note,
            },
            {
              key: "actions",
              label: "Actions",
              align: "right",
              render: (log) => (
                <div
                  className="flex justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                      <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 outline-none cursor-pointer">
                        <MoreVertical size={18} />
                      </div>
                    }
                  >
                    <DropdownItem
                      onClick={() => setTimeout(() => handleView(log), 0)}
                      className="text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Search size={14} className="mr-2" /> View Details
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setTimeout(() => handleEdit(log), 0)}
                      className="text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Edit3 size={14} className="mr-2" /> Edit Entry
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                      onClick={() => setTimeout(() => handleDelete(log.id), 0)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                    >
                      <Trash2 size={14} className="mr-2" /> Delete Entry
                    </DropdownItem>
                  </Dropdown>
                </div>
              ),
            },
          ]}
          data={logs}
          loading={loading}
          keyExtractor={(log) => log.id}
          emptyMessage="No Logs Found"
          emptySubMessage="There are currently no logbook entries."
        />

        {totalPages > 0 && (
          <div className="mt-8">
            <ModernPagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p - 1)}
              showInfo={false}
            />
          </div>
        )}

        {/* Entry Modal */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {isViewMode
                ? "Log Entry Details"
                : isEditMode
                  ? "Edit Log Entry"
                  : "Quick Log Entry"}
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md shadow-sm"
            >
              <X size={20} />
            </button>
          </div>
          <ModalBody className="p-0 dark:bg-gray-800">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block">Gender</Label>
                    <Select
                      value={formData.gender}
                      onChange={(e: any) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      disabled={isViewMode}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block">Phone (Optional)</Label>
                    <TextInput
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="block font-bold text-gray-400 uppercase text-[10px]">
                    Services Accessed
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="c1"
                        checked={formData.usingComputer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            usingComputer: e.target.checked,
                          })
                        }
                        disabled={isViewMode}
                      />{" "}
                      <Label htmlFor="c1" className="text-sm">
                        Using Computer
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="c2"
                        checked={formData.library}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            library: e.target.checked,
                          })
                        }
                        disabled={isViewMode}
                      />{" "}
                      <Label htmlFor="c2" className="text-sm">
                        Library Use
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="c3"
                        checked={formData.jobinformation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jobinformation: e.target.checked,
                          })
                        }
                        disabled={isViewMode}
                      />{" "}
                      <Label htmlFor="c3" className="text-sm">
                        Job Information
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="c4"
                        checked={formData.futureService}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            futureService: e.target.checked,
                          })
                        }
                        disabled={isViewMode}
                      />{" "}
                      <Label htmlFor="c4" className="text-sm">
                        Future Service
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block">Note</Label>
                  <Textarea
                    rows={3}
                    placeholder="Additional details..."
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6 pt-6">
                  <Button
                    outline
                    color={isViewMode ? "blue" : "gray"}
                    size="sm"
                    className={`rounded-md font-bold uppercase text-[10px] tracking-widest px-4 ${isViewMode ?"w-full":""}`}
                    onClick={() => setIsModalOpen(false)}
                  >
                    {isViewMode ? "Close" : "Cancel"}
                  </Button>
                  {!isViewMode && (
                    <Button
                      outline
                      color="blue"
                      type="submit"
                      size="sm"
                      className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
                    >
                      {isEditMode ? "Update Log" : "Save Log Entry"}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </ModalBody>
        </Modal>

        <ConfirmModal
          show={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this log entry? This record is used for reporting statistics."
        />
      </div>
    </Layout>
  );
};

export default LogbookPage;
