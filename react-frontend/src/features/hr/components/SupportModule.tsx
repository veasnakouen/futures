import React, { useState } from "react";
import {Button, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, TextInput, Select, Tabs} from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import { format } from "date-fns";
import {
  LifeBuoy,
  Search,
  Plus,
  Trash2,
  FileText,
  Tag,
  Edit,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import TicketCreationModal from "./TicketCreationModal";
import ManageTicketTypeModal from "./ManageTicketTypeModal";
import AssessmentFormModal from "./AssessmentFormModal";
import ConfirmModal from "./ConfirmModal";
import AssignTicketModal from "./AssignTicketModal";
import ModernTabs from "@/components/common/ModernTabs";

interface SupportModuleProps {
  tickets: any[];
  ticketTypes: any[];
  assessments: any[];
  users: any[];
  employees: any[];
  onCreateTicket: (data: any) => Promise<any>;
  onUpdateTicket: (id: number, data: any) => Promise<any>;
  onDeleteTicket: (id: number) => Promise<any>;
  onUpdateTicketStatus: (id: number, status: string) => Promise<any>;
  onAssignTicket: (
    id: number,
    payload: { assigneeId: string; assignNote: string; assignedById: string },
  ) => Promise<any>;
  onUnassignTicket: (id: number, assigneeId?: string) => Promise<any>;
  onCreateTicketType: (name: string) => Promise<any>;
  onDeleteTicketType: (id: number) => Promise<any>;
  onCreateAssessment: (data: any) => Promise<any>;
  onUpdateAssessment: (id: number, data: any) => Promise<any>;
  onDeleteAssessment: (id: number) => Promise<any>;
}

const SupportModule: React.FC<SupportModuleProps> = ({
  tickets,
  ticketTypes,
  assessments,
  users,
  employees,
  onCreateTicket,
  onUpdateTicket,
  onDeleteTicket,
  onUpdateTicketStatus,
  onAssignTicket,
  onUnassignTicket,
  onCreateTicketType,
  onDeleteTicketType,
  onCreateAssessment,
  onUpdateAssessment,
  onDeleteAssessment,
}) => {
  const [activeTab, setActiveTab] = useState("new");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditingTicket, setIsEditingTicket] = useState(false);
  const [isTicketTypeModalOpen, setIsTicketTypeModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Filters & Selection
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("New Ticket");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  // Evaluation Filters
  const [evalStartDate, setEvalStartDate] = useState("");
  const [evalEndDate, setEvalEndDate] = useState("");
  const [pieNameFilter, setPieNameFilter] = useState("");

  // Placeholder for Auth Context
  const CURRENT_AGENT = "Veasna Koeun";

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "level 1":
      case "urgent":
        return "failure";
      case "level 2":
      case "important":
        return "warning";
      case "level 3":
      case "normal":
        return "success";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "new ticket":
        return "info";
      case "in progress":
        return "warning";
      case "hold":
        return "failure";
      case "closed":
      case "resolved":
        return "success";
      default:
        return "gray";
    }
  };

  // Actions
  const handleCreate = async (data: any, id?: number) => {
    try {
      if (id) {
        await onUpdateTicket(id, data);
        toast.success("Support ticket updated successfully!");
      } else {
        await onCreateTicket(data);
        toast.success("Support ticket submitted successfully!");
      }
      setIsCreateModalOpen(false);
      setIsEditingTicket(false);
    } catch (err) {
      toast.error(id ? "Failed to update ticket" : "Failed to create ticket");
    }
  };

  const handleRemoveTicket = async () => {
    if (!selectedTicketId) return toast.error("Please select a ticket first");
    setConfirmModal({
      isOpen: true,
      title: "Delete Ticket",
      message:
        "Are you sure you want to completely remove this ticket? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await onDeleteTicket(selectedTicketId);
          toast.success("Ticket removed successfully");
          setSelectedTicketId(null);
        } catch (err) {
          toast.error("Failed to remove ticket");
        }
      },
    });
  };

  // Data Derivations
  const filteredNewTickets = tickets.filter((t) => {
    if (t.status === "Closed") return false;
    if (
      statusFilter &&
      statusFilter !== "All Active" &&
      t.status !== statusFilter &&
      (statusFilter !== "New Ticket" || t.status !== "Open")
    )
      return false;
    const matchSearch =
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(t.id).includes(searchTerm);
    return matchSearch;
  });

  const agentTickets = tickets.filter(
    (t) =>
      t.resolutionNotes?.includes(CURRENT_AGENT) ||
      t.assignee === CURRENT_AGENT ||
      true,
  ); // mock all for demo
  const openTickets = agentTickets.filter(
    (t) => !["Closed", "Resolved", "Hold", "In Progress"].includes(t.status),
  );
  const inProgressTickets = agentTickets.filter(
    (t) => t.status === "In Progress",
  );
  const holdTickets = agentTickets.filter((t) => t.status === "Hold");
  const closedTickets = agentTickets.filter((t) => {
    if (!["Closed", "Resolved"].includes(t.status)) return false;
    if (t.resolvedAt) {
      const resolvedTime = new Date(t.resolvedAt).getTime();
      const now = new Date().getTime();
      const hoursDiff = (now - resolvedTime) / (1000 * 60 * 60);
      if (hoursDiff > 24) return false;
    }
    return true;
  });

  const PIE_COLORS = [
    "#3b82f6",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  // Evaluation Dynamic Data Computations
  const evalFilteredTickets = tickets.filter((t) => {
    if (!evalStartDate && !evalEndDate) return true;
    const ticketDate = new Date(t.createdAt || new Date());

    if (evalStartDate && evalEndDate) {
      const start = new Date(evalStartDate);
      const end = new Date(evalEndDate);
      end.setHours(23, 59, 59, 999);
      return ticketDate >= start && ticketDate <= end;
    } else if (evalStartDate) {
      return ticketDate >= new Date(evalStartDate);
    } else if (evalEndDate) {
      const end = new Date(evalEndDate);
      end.setHours(23, 59, 59, 999);
      return ticketDate <= end;
    }
    return true;
  });

  // General Overview Stats
  const evalGenTotal = evalFilteredTickets.length;
  const evalGenOpen = evalFilteredTickets.filter(
    (t) => !["Closed", "Resolved", "Hold", "In Progress"].includes(t.status),
  ).length;
  const evalGenProgress = evalFilteredTickets.filter(
    (t) => t.status === "In Progress",
  ).length;
  const evalGenHold = evalFilteredTickets.filter(
    (t) => t.status === "Hold",
  ).length;
  const evalGenClose = evalFilteredTickets.filter(
    (t) => t.status === "Closed",
  ).length;
  const evalGenResolved = evalFilteredTickets.filter(
    (t) => t.status === "Resolved" || t.status === "Closed",
  ).length;

  // Agent Overview Stats
  const evalAgentFiltered = evalFilteredTickets.filter(
    (t) =>
      t.resolutionNotes?.includes(CURRENT_AGENT) ||
      t.assignee === CURRENT_AGENT,
  );
  const evalAgentTotal = evalAgentFiltered.length;
  const evalAgentOpen = evalAgentFiltered.filter(
    (t) => !["Closed", "Resolved", "Hold", "In Progress"].includes(t.status),
  ).length;
  const evalAgentProgress = evalAgentFiltered.filter(
    (t) => t.status === "In Progress",
  ).length;
  const evalAgentHold = evalAgentFiltered.filter(
    (t) => t.status === "Hold",
  ).length;
  const evalAgentClose = evalAgentFiltered.filter(
    (t) => t.status === "Closed",
  ).length;
  const evalAgentResolved = evalAgentFiltered.filter(
    (t) => t.status === "Resolved" || t.status === "Closed",
  ).length;

  // Group Finalized Tickets for Pie Chart
  const pieDataRaw = evalFilteredTickets.reduce(
    (acc: { [key: string]: number }, t) => {
      let creator = "Unknown Creator";
      if (t.reporter) {
        creator =
          t.reporter.userName ||
          (t.reporter.firstName
            ? `${t.reporter.firstName} ${t.reporter.lastName}`.trim()
            : "Unknown Creator");
      } else if (t.reporterName) {
        creator = t.reporterName;
      } else if (t.requesterName) {
        creator = t.requesterName;
      }
      if (creator === "Unknown Creator") {
        creator = "System Admin"; // Fallback for legacy tickets
      }
      acc[creator] = (acc[creator] || 0) + 1;
      return acc;
    },
    {},
  );

  let pieData = Object.keys(pieDataRaw).map((key) => ({
    name: key,
    value: pieDataRaw[key],
  }));
  if (pieNameFilter) {
    pieData = pieData.filter((d) => d.name === pieNameFilter);
  }
  if (pieData.length === 0) {
    pieData.push({ name: "No Data", value: 1 });
  }

  const filterOptions = Object.keys(pieDataRaw).map((creator) => {
    // Find if this creator maps to a known user to get a better label, otherwise just use creator string
    const u = users?.find(
      (u) =>
        u.email === creator ||
        u.userName === creator ||
        `${u.firstName} ${u.lastName}`.trim() === creator,
    );
    const label = u ? `${u.firstName} ${u.lastName} (@${u.userName})` : creator;
    return { value: creator, label: label };
  });

  const QuadrantTable = ({
    title,
    ticketsList,
    icon: Icon,
    color,
    actions,
  }: {
    title: string;
    ticketsList: any[];
    icon: any;
    color: string;
    actions?: { label: string; status?: string }[];
  }) => (
    <div className="rounded-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col h-64">
      <div
        className={`p-2 bg-gray-50 dark:bg-gray-900 border-b  flex justify-between items-center text-xs font-bold ${color}`}
      >
        <div className="flex items-center gap-1">
          <Icon size={14} /> {title} [Total = {ticketsList.length} ticket(s)]
        </div>
        {actions && actions.length > 0 && (
          <div className="flex gap-2 text-gray-500 font-medium">
            {actions.map((act, i) => (
              <React.Fragment key={act.label}>
                <button
                  className="hover:text-blue-600 transition-colors disabled:opacity-50"
                  onClick={() => {
                    if (act.status) {
                      if (!selectedTicketId)
                        return toast.error("Please select a ticket first");
                      setConfirmModal({
                        isOpen: true,
                        title: `Update Status to ${act.status}`,
                        message: `Are you sure you want to change this ticket's status to ${act.status}?`,
                        onConfirm: () => {
                          onUpdateTicketStatus(selectedTicketId, act.status!)
                            .then(() => {
                              toast.success(
                                `Ticket status updated to ${act.status}`,
                              );
                            })
                            .catch(() =>
                              toast.error("Failed to update status"),
                            );
                        },
                      });
                    }
                  }}
                >
                  {act.label}
                </button>
                {i < actions.length - 1 && <span>|</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="overflow-y-auto flex-1">
        <Table hoverable>
          <TableHead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
            <TableHeadCell className="py-2 text-[10px] px-2">
              Ticket No.
            </TableHeadCell>
            <TableHeadCell className="py-2 text-[10px] px-2">
              Your Team
            </TableHeadCell>
            <TableHeadCell className="py-2 text-[10px] px-2">
              Priority
            </TableHeadCell>
            <TableHeadCell className="py-2 text-[10px] px-2">
              Subject
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700 text-[10px]">
            {ticketsList.map((t) => (
              <TableRow
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`cursor-pointer transition-colors ${selectedTicketId === t.id ?"bg-blue-100 dark:bg-blue-900/50":"hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
              >
                <TableCell className="py-2 px-2 font-mono text-blue-600">
                  0{t.id}
                </TableCell>
                <TableCell className="py-2 px-2">
                  {t.reporter?.department?.name || "IT"}
                </TableCell>
                <TableCell className="py-2 px-2">
                  <Badge
                    color={getPriorityColor(t.priority)}
                    className="w-fit text-[8px] px-1"
                  >
                    {t.priority || "Normal"}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 px-2 font-bold">{t.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Bar matching legacy IT Office menu structure */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2 items-center">
          <LifeBuoy size={20} className="text-blue-600" />
          <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">
            Tickets System
          </h3>
        </div>
        <Button
          color="light"
          size="sm"
          onClick={() => setIsTicketTypeModalOpen(true)}
          className="font-bold text-[10px] uppercase"
        >
          <Tag size={12} className="mr-2" /> Manage Ticket Type
        </Button>
      </div>

      <div className="rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md overflow-hidden">
        {/* Custom Tab Navigation */}
        <ModernTabs
          tabs={[
            { id: "new", label: "New Ticket(s)" },
            { id: "my", label: "My Ticket(s)" },
            { id: "eval", label: "Evaluation Rate" },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id)}
          className="px-2 pt-2 bg-gray-50 dark:bg-gray-900/50"
        />

        <div className="p-4">
          {/* TAB 1: NEW TICKETS */}
          {activeTab === "new" && (
            <div className="space-y-4 animate-fade-in">
              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                <div className="flex gap-2">
                  <Button
                    color="blue"
                    size="xs"
                    onClick={() => {
                      setIsEditingTicket(false);
                      setIsCreateModalOpen(true);
                    }}
                    className="font-bold text-[10px] uppercase"
                  >
                    <Plus size={12} className="mr-1" /> Create a ticket
                  </Button>
                  <Button
                    color="light"
                    size="xs"
                    disabled={
                      !!selectedTicketId &&
                      !["Open", "New Ticket"].includes(
                        tickets.find((t) => t.id === selectedTicketId)
                          ?.status || "",
                      )
                    }
                    onClick={() => {
                      if (!selectedTicketId)
                        return toast.error("Please select a ticket first");
                      setIsEditingTicket(true);
                      setIsCreateModalOpen(true);
                    }}
                    className="font-bold text-[10px] uppercase text-gray-600"
                  >
                    <Edit size={12} className="mr-1" /> Edit Ticket
                  </Button>
                  <Button
                    color="failure"
                    size="xs"
                    disabled={
                      !!selectedTicketId &&
                      !["Open", "New Ticket"].includes(
                        tickets.find((t) => t.id === selectedTicketId)
                          ?.status || "",
                      )
                    }
                    outline
                    onClick={handleRemoveTicket}
                    className="font-bold text-[10px] uppercase"
                  >
                    <Trash2 size={12} className="mr-1" /> Remove Ticket
                  </Button>
                  <Button
                    color="success"
                    size="xs"
                    disabled={
                      !!selectedTicketId &&
                      !["Open", "New Ticket"].includes(
                        tickets.find((t) => t.id === selectedTicketId)
                          ?.status || "",
                      )
                    }
                    outline
                    onClick={() => {
                      if (!selectedTicketId)
                        return toast.error("Please select a ticket first");
                      setIsAssignModalOpen(true);
                    }}
                    className="font-bold text-[10px] uppercase"
                  >
                    <UserPlus size={12} className="mr-1" /> Assign Ticket
                  </Button>
                  <Button
                    color="light"
                    size="xs"
                    onClick={() => {
                      if (!selectedTicketId) {
                        toast.error("Please select a ticket to assess first");
                        return;
                      }
                      setIsAssessmentModalOpen(true);
                    }}
                    className="font-bold text-[10px] uppercase text-blue-600 border-blue-200"
                  >
                    <FileText size={12} className="mr-1" /> Assessment Form
                  </Button>
                </div>

                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Filter status:
                  </span>
                  <Select
                    sizing="sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-32 text-xs"
                  >
                    <option>All Active</option>
                    <option>New Ticket</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </Select>
                  <span className="text-[10px] font-bold text-gray-500 uppercase ml-2">
                    Search By:
                  </span>
                  <Select sizing="sm" className="w-24 text-xs">
                    <option>Ticket No</option>
                  </Select>
                  <TextInput
                    sizing="sm"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-32"
                  />
                </div>
              </div>

              {/* Ticket Table */}
              <div className="rounded-md overflow-hidden h-[500px] overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                <Table hoverable>
                  <TableHead className="bg-white dark:bg-gray-800">
                    <TableHeadCell className="py-2 text-[10px] text-center border-r px-2">
                      Ticket No
                    </TableHeadCell>
                    <TableHeadCell className="py-2 text-[10px] text-center border-r px-2">
                      Ticket Date
                    </TableHeadCell>
                    <TableHeadCell className="py-2 text-[10px] text-center border-r px-2">
                      Ticket Type
                    </TableHeadCell>
                    <TableHeadCell className="py-2 text-[10px] text-center border-r px-2">
                      Priority
                    </TableHeadCell>
                    <TableHeadCell className="py-2 text-[10px] text-center border-r px-2">
                      Subject
                    </TableHeadCell>
                    <TableHeadCell className="py-2 text-[10px] text-center border-r">
                      Issue Description
                    </TableHeadCell>
                    <TableHeadCell className="py-2 text-[10px] text-center border-r px-2">
                      Status
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y dark:divide-gray-700">
                    {filteredNewTickets.map((tkt) => (
                      <TableRow
                        key={tkt.id}
                        onClick={() => setSelectedTicketId(tkt.id)}
                        className={`cursor-pointer transition-colors ${selectedTicketId === tkt.id ?"bg-blue-100 dark:bg-blue-900/50":"bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
                      >
                        <TableCell className="py-2 px-2 text-center font-mono text-xs text-blue-600 font-bold">
                          0{tkt.id}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center text-[10px]">
                          {tkt.createdAt
                            ? format(new Date(tkt.createdAt), "M/d/yyyy")
                            : ""}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center text-xs">
                          Question
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          <span
                            className={`text-[10px] font-bold uppercase ${getPriorityColor(tkt.priority) ==="failure"?"text-red-500":"text-gray-600"}`}
                          >
                            {tkt.priority || "Level 3"}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs font-bold">
                          {tkt.title}
                        </TableCell>
                        <TableCell className="py-2 text-xs truncate max-w-[200px]">
                          {tkt.description}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center text-xs">
                          {tkt.status || "New Ticket"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Status Bar */}
              <div className="flex justify-between items-center bg-white dark:bg-gray-800 border-t pt-2 text-[10px] font-bold text-gray-500">
                <div>
                  User Logged: {CURRENT_AGENT} | Audit Date:{" "}
                  {format(new Date(), "dd-MMM-yyyy hh:mm:ss a")}
                </div>
                <div className="flex gap-2">
                  <span>Priority:</span>
                  <span className="bg-red-500 text-white px-2">
                    Level 1: Urgent
                  </span>
                  <span className="bg-yellow-400 text-black px-2">
                    Level 2: Important
                  </span>
                  <span className="bg-green-500 text-white px-2">
                    Level 3: Normal
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY TICKETS */}
          {activeTab === "my" && (
            <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 p-2 gap-2 rounded-md animate-fade-in">
              {/* Top row */}
              <div className="grid grid-cols-2 gap-2">
                <QuadrantTable
                  title="Open Ticket(s)"
                  ticketsList={openTickets}
                  icon={CheckCircle}
                  color="text-blue-600"
                  actions={[
                    { label: "In Progress", status: "In Progress" },
                    { label: "Refresh" },
                  ]}
                />
                <QuadrantTable
                  title="In progress Ticket(s)"
                  ticketsList={inProgressTickets}
                  icon={Clock}
                  color="text-green-600"
                  actions={[
                    { label: "Close Ticket", status: "Resolved" },
                    { label: "Hold Ticket", status: "Hold" },
                    { label: "Unsolved", status: "Open" },
                  ]}
                />
              </div>
              {/* Bottom row */}
              <div className="grid grid-cols-2 gap-2">
                <QuadrantTable
                  title="Hold Ticket(s)"
                  ticketsList={holdTickets}
                  icon={AlertCircle}
                  color="text-red-500"
                  actions={[{ label: "In Progress", status: "In Progress" }]}
                />
                <QuadrantTable
                  title="Close Ticket(s)"
                  ticketsList={closedTickets}
                  icon={CheckCircle}
                  color="text-blue-800 dark:text-blue-400"
                  actions={[{ label: "Reopen Ticket", status: "Open" }]}
                />
              </div>
              <div className="flex justify-between items-center pt-2 text-[10px] font-bold text-gray-500 uppercase px-2">
                <span>Agent: {CURRENT_AGENT}</span>
                <span>
                  {openTickets.length} new ticket(s) available, Claim it now to
                  earn more evaluation rate!
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: EVALUATION RATE */}
          {activeTab === "eval" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Filter Bar */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded-md flex items-center justify-between shadow-sm">
                <div className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
                  <AlertCircle size={16} /> Evaluation Period Filter
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">
                      START DATE
                    </span>
                    <div className="w-40">
                      <DatePicker
                        value={evalStartDate ? new Date(evalStartDate) : null}
                        onChange={(date) =>
                          setEvalStartDate(format(date, "yyyy-MM-dd"))
                        }
                        placeholder="Start date..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">
                      END DATE
                    </span>
                    <div className="w-40">
                      <DatePicker
                        value={evalEndDate ? new Date(evalEndDate) : null}
                        onChange={(date) =>
                          setEvalEndDate(format(date, "yyyy-MM-dd"))
                        }
                        placeholder="End date..."
                      />
                    </div>
                  </div>
                  <Button
                    size="xs"
                    color="light"
                    onClick={() => {
                      setEvalStartDate("");
                      setEvalEndDate("");
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Chart side */}
                <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-md flex flex-col h-[500px]">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-600 dark:text-gray-300 uppercase text-sm">
                      Ticket Distribution by Agent
                    </h4>
                    <Select
                      sizing="sm"
                      value={pieNameFilter}
                      onChange={(e) => setPieNameFilter(e.target.value)}
                      className="w-48"
                    >
                      <option value="">Select an employee...</option>
                      {filterOptions.map((opt, i) => (
                        <option key={i} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={140}
                          dataKey="value"
                          nameKey="name"
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stats side */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div className="shadow-none bg-white dark:bg-gray-800">
                    <h5 className="text-xs font-bold text-gray-500 uppercase border-b pb-2 mb-2">
                      General Ticket Overview
                    </h5>
                    <div className="flex justify-between">
                      <div className="space-y-1 text-[10px] font-bold">
                        <p>Total Ticket(s) = {evalGenTotal}</p>
                        <p className="text-blue-600">
                          Total Open Ticket(s) = {evalGenOpen}
                        </p>
                        <p className="text-green-500">
                          Total In Progress Ticket(s) = {evalGenProgress}
                        </p>
                        <p className="text-red-500">
                          Total Hold Ticket(s) = {evalGenHold}
                        </p>
                        <p className="text-gray-500">
                          Total Close Ticket(s) = {evalGenClose}
                        </p>
                        <p className="text-purple-600">
                          Total Finalized Ticket(s) = {evalGenResolved}
                        </p>
                      </div>
                      <div className="text-center border-l pl-4 flex flex-col justify-center items-center">
                        <p className="text-xs font-bold text-yellow-600 uppercase mb-2">
                          Total Finalized Ticket(s)
                        </p>
                        <h3 className="text-4xl font-black mb-2">
                          {evalGenResolved}
                        </h3>
                        <div
                          className={`w-14 h-14 ${evalGenResolved < 4 ?"bg-red-500": evalGenResolved > 20 ?"bg-green-500":"bg-blue-600"} rounded-md flex flex-col items-center justify-center text-white text-xs font-black shadow-lg leading-tight text-center`}
                        >
                          {evalGenResolved < 4 ? (
                            "BAD"
                          ) : evalGenResolved > 20 ? (
                            "BEST!"
                          ) : (
                            <>
                              GOOD
                              <br />
                              JOB!
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="shadow-none bg-white dark:bg-gray-800">
                    <h5 className="text-xs font-bold text-gray-500 uppercase border-b pb-2 mb-2">
                      My Ticket Overview
                    </h5>
                    <div className="flex justify-between">
                      <div className="space-y-1 text-[10px] font-bold">
                        <p>Total Ticket(s) = {evalAgentTotal}</p>
                        <p className="text-blue-600">
                          Total Open Ticket(s) = {evalAgentOpen}
                        </p>
                        <p className="text-green-500">
                          Total In Progress Ticket(s) = {evalAgentProgress}
                        </p>
                        <p className="text-red-500">
                          Total Hold Ticket(s) = {evalAgentHold}
                        </p>
                        <p className="text-gray-500">
                          Total Close Ticket(s) = {evalAgentClose}
                        </p>
                        <p className="text-purple-600">
                          Total Finalized Ticket(s) = {evalAgentResolved}
                        </p>
                      </div>
                      <div className="text-center border-l pl-4 flex flex-col justify-center items-center">
                        <p className="text-xs font-bold text-yellow-600 uppercase mb-2">
                          My Finalized Ticket(s)
                        </p>
                        <p className="text-[9px] text-gray-400 mb-2">
                          Agent: {CURRENT_AGENT}
                        </p>
                        <h3 className="text-4xl font-black mb-2">
                          {evalAgentResolved}
                        </h3>
                        <div
                          className={`w-14 h-14 ${evalAgentResolved < 4 ?"bg-red-500": evalAgentResolved > 20 ?"bg-green-500":"bg-blue-600"} rounded-md flex flex-col items-center justify-center text-white text-xs font-black shadow-lg leading-tight text-center`}
                        >
                          {evalAgentResolved < 4 ? (
                            "BAD"
                          ) : evalAgentResolved > 20 ? (
                            "BEST!"
                          ) : (
                            <>
                              GOOD
                              <br />
                              JOB!
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <TicketCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditingTicket(false);
          }}
          onSubmit={handleCreate}
          users={users}
          initialData={
            isEditingTicket && selectedTicketId
              ? tickets.find(
                  (t) =>
                    String(t.id) === String(selectedTicketId) ||
                    `TKT-${String(t.id).padStart(5, "0")}` ===
                      String(selectedTicketId),
                )
              : null
          }
        />

        <ManageTicketTypeModal
          isOpen={isTicketTypeModalOpen}
          onClose={() => setIsTicketTypeModalOpen(false)}
          ticketTypes={ticketTypes}
          onCreateTicketType={onCreateTicketType}
          onDeleteTicketType={onDeleteTicketType}
        />

        <AssessmentFormModal
          isOpen={isAssessmentModalOpen}
          onClose={() => setIsAssessmentModalOpen(false)}
          tickets={tickets}
          assessments={assessments}
          onCreateAssessment={onCreateAssessment}
          onUpdateAssessment={onUpdateAssessment}
          onDeleteAssessment={onDeleteAssessment}
          initialTicketId={selectedTicketId}
        />

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
        />

        <AssignTicketModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          ticket={tickets.find((t) => t.id === selectedTicketId)}
          users={users}
          onAssign={async (id, payload) => {
            await onAssignTicket(id, payload);
            setIsAssignModalOpen(false);
            toast.success("Ticket assigned successfully!");
          }}
          onUnassign={async (id) => {
            await onUnassignTicket(id);
            setIsAssignModalOpen(false);
            toast.success("Ticket unassigned successfully!");
          }}
          currentUserId={CURRENT_AGENT}
        />
      </div>
    </div>
  );
};

export default SupportModule;
