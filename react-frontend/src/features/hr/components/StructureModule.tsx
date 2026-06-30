import React, { useState } from "react";
import {
  Card,
  Button,
  Avatar,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  Label,
  Select,
} from '@/lib/flowbite-compat';
import {
  X,
  Building2,
  Users,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  MapPin,
  Briefcase,
  Network,
  User,
  Check,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import { useHRStore } from '@/store/hrStore';

interface Employee {
  id: number;
  firstNameEnglish: string;
  lastNameEnglish: string;
  firstNameKhmer?: string;
  lastNameKhmer?: string;
  gender: string;
  email: string;
  phoneNumber: string;
  department?: any;
  position?: any;
  photo?: string;
  status: string;
}

interface StructureModuleProps {
  employees: Employee[];
  positions?: any[];
}

const gridColsMap: { [key: number]: string } = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  7: "md:grid-cols-7",
  8: "md:grid-cols-8",
};

const formatPositionNameSimple = (name: string) => {
  if (!name) return "Staff";
  if (name.includes(" :: ")) {
    return name.split(" :: ")[0];
  }
  return name;
};

const formatPositionNameWithDept = (name: string) => {
  if (!name) return "Staff";
  if (name.includes(" :: ")) {
    const [role, dept] = name.split(" :: ");
    return `${role} (${dept})`;
  }
  return name;
};

const StructureModule: React.FC<StructureModuleProps> = ({
  employees = [],
}) => {
  // State hooks
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // Modal Forms State
  const [newDeptName, setNewDeptName] = useState("");
  const [nodeType, setNodeType] = useState<"DEPARTMENT" | "POSITION">(
    "DEPARTMENT",
  );
  const [newNodeName, setNewNodeName] = useState("");
  const [nodeParent, setNodeParent] = useState("");

  // Use Zustand store for dynamic lookups
  const {
    globalDepartments,
    globalPositions,
    createDepartment,
    deleteDepartment,
    createPosition,
    deletePosition,
  } = useHRStore();

  // Fallback to local customDepts/customPositions if backend lists are empty
  const deptsList =
    globalDepartments && globalDepartments.length > 0
      ? globalDepartments.map((d: any) => d.name)
      : [
          "Technology & IT",
          "Social Operations",
          "Finance & Admin",
          "Human Resources",
          "Operations",
        ];

  // Local simulated list of custom positions for vacant position visual rosters
  const [customPositions, setCustomPositions] = useState<
    { name: string; active: number; openings: number; parentDept: string }[]
  >([]);

  // Extract vacant/authorized positions dynamically from globalPositions database list
  const vacantPositions = (() => {
    const list: {
      name: string;
      active: number;
      openings: number;
      parentDept: string;
    }[] = [];
    if (globalPositions) {
      globalPositions.forEach((pos: any) => {
        if (pos.name && pos.name.includes(" :: ")) {
          const [displayName, parentDept] = pos.name.split(" :: ");

          // Count active staff assigned to this exact position name
          const activeCount = employees.filter((emp) => {
            const empPosName = emp.position?.name || emp.position;
            return empPosName === pos.name || empPosName === displayName;
          }).length;

          // If no employees are active in this position, it is considered vacant
          if (activeCount === 0) {
            list.push({
              name: displayName,
              active: 0,
              openings: 1,
              parentDept: parentDept,
            });
          }
        }
      });
    }
    return list;
  })();

  // Merge dynamic vacant positions from database with newly added custom positions local state
  const allVacantPositions = (() => {
    const list = [...vacantPositions];
    customPositions.forEach((cp) => {
      if (
        !list.some((p) => p.name === cp.name && p.parentDept === cp.parentDept)
      ) {
        list.push(cp);
      }
    });
    return list;
  })();

  // Calculate dynamic department statistics from backend employee data
  const processedDepts = (() => {
    const deptsMap: {
      [key: string]: {
        name: string;
        lead: string;
        leadPhoto: string;
        members: Employee[];
      };
    } = {};

    // Seed with custom and standard departments
    deptsList.forEach((cat) => {
      deptsMap[cat] = {
        name: cat,
        lead: "Unassigned Head",
        leadPhoto: "",
        members: [],
      };
    });

    // Map live employees
    employees.forEach((emp) => {
      const deptName = emp.department?.name || emp.department || "General";
      if (!deptsMap[deptName]) {
        deptsMap[deptName] = {
          name: deptName,
          lead: "Unassigned Head",
          leadPhoto: "",
          members: [],
        };
      }
      deptsMap[deptName].members.push(emp);
    });

    return Object.values(deptsMap)
      .map((dept, index) => {
        // Detect Head/Manager
        const manager =
          dept.members.find((m) => {
            const pos = formatPositionNameSimple(
              m.position?.name || m.position || "",
            ).toLowerCase();
            return (
              pos.includes("head") ||
              pos.includes("manager") ||
              pos.includes("director") ||
              pos.includes("lead") ||
              pos.includes("board")
            );
          }) || dept.members[0];

        const vacantCount = allVacantPositions.filter(
          (cp) => cp.parentDept === dept.name,
        ).length;

        return {
          id: String(index + 1),
          name: dept.name,
          lead: manager
            ? `${manager.firstNameEnglish} ${manager.lastNameEnglish}`
            : "Unassigned Head",
          leadPhoto: manager?.photo || "",
          staffCount: dept.members.length,
          vacantCount: vacantCount,
          members: dept.members,
        };
      })
      .filter(
        (d) =>
          d.staffCount > 0 || d.vacantCount > 0 || deptsList.includes(d.name),
      );
  })();

  // Calculate dynamic positions lists from live data
  const activePositions = (() => {
    const posMap: { [key: string]: number } = {};
    employees.forEach((emp) => {
      const posName = emp.position?.name || emp.position || "Staff";
      posMap[posName] = (posMap[posName] || 0) + 1;
    });

    // Default mock list if database is empty
    const defaultPositions = [
      {
        name: "Senior Social Worker",
        active: posMap["Senior Social Worker"] || 3,
        openings: 2,
      },
      {
        name: "Systems Architect",
        active: posMap["Systems Architect"] || 1,
        openings: 1,
      },
      {
        name: "Admin Coordinator",
        active: posMap["Admin Coordinator"] || 2,
        openings: 3,
      },
    ];

    // Add any other dynamic positions discovered in globalPositions / database
    if (globalPositions) {
      globalPositions.forEach((pos: any) => {
        const name = pos.name;
        if (!defaultPositions.some((p) => p.name === name)) {
          defaultPositions.push({
            name: name,
            active: posMap[name] || 0,
            openings: 1,
          });
        }
      });
    }

    // Add any other dynamic positions discovered in employees
    Object.keys(posMap).forEach((key) => {
      if (!defaultPositions.some((p) => p.name === key)) {
        defaultPositions.push({ name: key, active: posMap[key], openings: 1 });
      }
    });

    // Merge newly added custom positions from state!
    allVacantPositions.forEach((cp) => {
      const fullName = `${cp.name} :: ${cp.parentDept}`;
      if (
        !defaultPositions.some((p) => p.name === cp.name || p.name === fullName)
      ) {
        defaultPositions.push({
          name: fullName,
          active: cp.active,
          openings: cp.openings,
        });
      }
    });

    return defaultPositions;
  })();

  // Handlers
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      toast.error("Department name cannot be empty");
      return;
    }
    if (deptsList.includes(newDeptName.trim())) {
      toast.error("Department already exists");
      return;
    }
    try {
      await createDepartment(newDeptName.trim());
      setNewDeptName("");
      toast.success(
        `Department "${newDeptName.trim()}" initialized successfully`,
      );
    } catch (err) {
      toast.error("Failed to initialize department");
    }
  };

  const handleDeleteDepartment = async (name: string) => {
    if (
      ["Technology & IT", "Social Operations", "Finance & Admin"].includes(name)
    ) {
      toast.error("Core system departments cannot be purged");
      return;
    }
    try {
      await deleteDepartment(name);
      toast.success(`Department "${name}" decommissioned`);
    } catch (err) {
      toast.error("Failed to decommission department");
    }
  };

  const handleCreateNodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) {
      toast.error("Node label cannot be blank");
      return;
    }
    try {
      if (nodeType === "DEPARTMENT") {
        await createDepartment(newNodeName.trim());
        toast.success(
          `Department Node "${newNodeName.trim()}" created successfully`,
        );
      } else {
        // Save custom position node persistently in database with department encoding!
        const encodedName = `${newNodeName.trim()} :: ${nodeParent || "Executive Board"}`;
        await createPosition(encodedName);

        // Map under parent department visually as vacant role
        setCustomPositions([
          ...customPositions,
          {
            name: newNodeName.trim(),
            active: 0,
            openings: 1,
            parentDept: nodeParent || "Executive Board",
          },
        ]);

        toast.success(
          `Position "${newNodeName.trim()}" mapped under ${nodeParent || "Executive Board"}`,
        );
      }
      setIsAddNodeOpen(false);
      setNewNodeName("");
    } catch (err) {
      toast.error("Failed to initialize hierarchy node");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 dark:bg-gray-800/50 p-6 rounded-md border dark:border-gray-700/50 shadow-sm">
        <div>
          <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">
            Organization Architecture
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Hierarchical Mapping & Department Nodes
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            color="light"
            onClick={() => setIsManageOpen(true)}
            className="rounded-md flex-1 sm:flex-none font-bold text-xs uppercase"
          >
            <Building2 size={16} className="mr-2 text-blue-600" /> Manage Depts
          </Button>
          <Button
            color="blue"
            onClick={() => setIsAddNodeOpen(true)}
            className="rounded-md flex-1 sm:flex-none shadow-lg shadow-blue-500/20 font-bold text-xs uppercase"
          >
            <Plus size={16} className="mr-2" /> Add Node
          </Button>
        </div>
      </div>

      {/* Visual Org Chart Container */}
      <Card className="p-8 rounded-md dark:bg-gray-800 border-none shadow-md flex flex-col items-center bg-white/50 backdrop-blur-xl relative overflow-visible">
        <div className="relative w-full flex flex-col items-center">
          {/* 1. Parent Node (Executive Board) */}
          <div className="relative z-10">
            <div className="p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-blue-950 text-white rounded-md border-4 border-blue-600 shadow-md flex flex-col items-center w-64 text-center">
              <div className="w-12 h-12 rounded-md bg-blue-500/20 flex items-center justify-center mb-3 border border-blue-500/30">
                <Shield className="text-blue-400" size={24} />
              </div>
              <h5 className="font-black text-base uppercase tracking-tight">
                Executive Board
              </h5>
              <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-1">
                Strategic Leadership
              </p>
            </div>
          </div>

          {/* Connector from Parent Card to child row */}
          <div className="h-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          {/* 2. Responsive Dynamic Department Nodes */}
          <div
            className={`grid grid-cols-1 ${gridColsMap[processedDepts.length] || "md:grid-cols-3"} gap-8 md:gap-4 lg:gap-8 w-full relative`}
          >
            {processedDepts.map((dept, i) => {
              const isExpanded = expandedDeptId === dept.id;
              return (
                <div
                  key={dept.id}
                  className="relative flex flex-col items-center w-full"
                >
                  {/* Responsive Continuous Connecting Lines */}
                  <div className="hidden md:block absolute top-0 left-0 right-0 h-6">
                    {/* Horizontal connecting line segments */}
                    <div
                      className={`absolute top-0 h-0.5 bg-gray-200 dark:bg-gray-700 ${
                        i === 0
                          ? "left-1/2 right-0"
                          : i === processedDepts.length - 1
                            ? "left-0 right-1/2"
                            : "left-0 right-0"
                      }`}
                    />
                    {/* Vertical drop line segment */}
                    <div className="absolute top-0 left-1/2 -translate-y-0 w-0.5 h-6 bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* Mobile vertical line connector */}
                  <div className="md:hidden w-0.5 h-6 bg-gray-200 dark:bg-gray-700" />

                  {/* Node Card wrapper with margin spacer to account for lines */}
                  <div className="pt-6 w-full flex flex-col items-center">
                    <div
                      onClick={() =>
                        setExpandedDeptId(isExpanded ? null : dept.id)
                      }
                      className={`p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-md hover:bg-white/80 dark:hover:bg-gray-850 hover:border-blue-500/40 hover:shadow-md transition-all duration-300 cursor-pointer w-full max-w-sm text-center group ${isExpanded ? "ring-1 ring-blue-500/40 bg-white/95 dark:bg-gray-800 border-transparent shadow-md" : "scale-98 hover:scale-100"}`}
                    >
                      <h6 className="font-black dark:text-white text-base tracking-tight uppercase leading-none mb-1.5">
                        {dept.name}
                      </h6>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-1.5">
                        <User size={10} className="text-blue-500" /> {dept.lead}{" "}
                        • Head
                      </p>
                      <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                        <Users size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {dept.staffCount} Members
                          {dept.vacantCount > 0 &&
                            ` • ${dept.vacantCount} Vacant`}
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown
                            size={12}
                            className="group-hover:translate-y-0.5 transition-transform"
                          />
                        )}
                      </div>
                    </div>

                    {/* Dropdown Employee List inside the Org Tree */}
                    {isExpanded && (
                      <div className="w-full max-w-sm mt-3 p-4 bg-gray-50/80 dark:bg-gray-900/60 border dark:border-gray-855 rounded-md shadow-inner space-y-2.5 animate-slide-up overflow-y-auto max-h-60 custom-scrollbar relative z-30">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">
                          Department Roster
                        </p>
                        {dept.members.length === 0 && dept.vacantCount === 0 ? (
                          <p className="text-[10px] font-bold text-gray-400 uppercase py-2">
                            No personnel deployed
                          </p>
                        ) : (
                          <>
                            {/* Live Employees Roster */}
                            {dept.members.map((emp) => (
                              <div
                                key={emp.id}
                                className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-800/80 rounded-md border dark:border-gray-700/50 shadow-sm hover:scale-102 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar img={emp.photo} rounded size="sm" />
                                  <div className="text-left">
                                    <p className="text-[11px] font-black dark:text-white uppercase leading-none">
                                      {emp.firstNameEnglish}{" "}
                                      {emp.lastNameEnglish}
                                    </p>
                                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
                                      {formatPositionNameSimple(
                                        emp.position?.name || emp.position,
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  color={
                                    emp.status === "Active" ? "success" : "gray"
                                  }
                                  className="rounded-md text-[8px] font-black uppercase"
                                >
                                  {emp.status}
                                </Badge>
                              </div>
                            ))}

                            {/* Vacant Authorized Positions */}
                            {allVacantPositions
                              .filter((cp) => cp.parentDept === dept.name)
                              .map((cp, idx) => (
                                <div
                                  key={`vacant-${idx}`}
                                  className="flex items-center justify-between p-2.5 bg-blue-50/20 dark:bg-blue-950/10 rounded-md border border-dashed border-blue-200/50 dark:border-blue-800/30 shadow-sm hover:scale-102 transition-all"
                                >
                                  <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950 flex items-center justify-center border dark:border-blue-900">
                                      <Briefcase
                                        size={12}
                                        className="text-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-[11px] font-black dark:text-white uppercase leading-none">
                                        {cp.name}
                                      </p>
                                      <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-0.5">
                                        Authorized Position
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    color="info"
                                    className="rounded-md text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5"
                                  >
                                    Vacant
                                  </Badge>
                                </div>
                              ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Bottom Position Management and Reporting Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Position Management */}
        <Card className="p-6 rounded-md dark:bg-gray-800 border-none shadow-sm bg-white/50 backdrop-blur-xl">
          <h4 className="font-black text-lg dark:text-white uppercase tracking-tight mb-6">
            Position Management
          </h4>
          <div className="space-y-3">
            {activePositions.map((pos, i) => (
              <div
                key={i}
                className="p-4 bg-white/40 dark:bg-gray-700/20 border dark:border-gray-700/30 rounded-md flex justify-between items-center hover:scale-101 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                    <Briefcase size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-black dark:text-white uppercase tracking-tight">
                      {formatPositionNameWithDept(pos.name)}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      {pos.active} Staff Active
                    </p>
                  </div>
                </div>
                <Badge
                  color="info"
                  className="rounded-md px-3 py-1 text-[8px] font-black uppercase tracking-widest"
                >
                  {pos.openings} Openings
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Reporting Matrix */}
        <Card className="p-6 rounded-md dark:bg-gray-800 border-none shadow-sm bg-white/50 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center mb-4">
              <Network size={20} />
            </div>
            <h4 className="font-black text-lg dark:text-white uppercase tracking-tight mb-3">
              Reporting Matrix
            </h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed mb-6">
              Dynamic reporting relationship visualization. This graph-based
              interface allows administrative operators to orchestrate, modify,
              and restructure reporting lines and line managers across different
              nodes.
            </p>
          </div>
          <Button
            color="light"
            onClick={() => setIsMatrixOpen(true)}
            className="rounded-md w-full font-black uppercase text-[10px] tracking-widest py-3 border-gray-200 dark:border-gray-700 shadow-sm"
          >
            Open Matrix Editor
          </Button>
        </Card>
      </div>

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}

      {/* 1. Manage Departments Modal */}
      <Modal
        show={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        size="lg"
      >
        <div className="absolute top-4 right-4 z-50">
          <button
            type="button"
            onClick={() => setIsManageOpen(false)}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <ModalHeader className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-3xl">
          <div className="flex flex-col">
            <h3 className="text-xl font-black dark:text-white leading-tight uppercase tracking-tight">
              Manage Departments
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Initialize or decommission active divisions
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="bg-white dark:bg-gray-800 p-6">
          <form onSubmit={handleAddDepartment} className="flex gap-2 mb-6">
            <div className="flex-1">
              <TextInput
                placeholder="Add new department name..."
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                className="rounded-md"
                required
              />
            </div>
            <Button
              type="submit"
              color="blue"
              className="rounded-md font-bold uppercase text-xs px-4"
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </form>
          <div className="space-y-2">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Registered Divisions
            </p>
            {deptsList.map((name, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md"
              >
                <span className="text-xs font-black dark:text-white uppercase tracking-tight">
                  {name}
                </span>
                {![
                  "Technology & IT",
                  "Social Operations",
                  "Finance & Admin",
                ].includes(name) ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteDepartment(name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <Badge
                    color="light"
                    className="rounded-md text-[8px] font-black uppercase"
                  >
                    System
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-3xl">
          <div className="flex justify-end w-full">
            <Button
              color="light"
              onClick={() => setIsManageOpen(false)}
              className="rounded-md font-bold uppercase text-xs px-6"
            >
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* 2. Add Node Modal */}
      <Modal
        show={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        size="md"
      >
        <ModalHeader className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-3xl">
          <div className="flex flex-col">
            <h3 className="text-xl font-black dark:text-white leading-tight uppercase tracking-tight">
              Initialize Hierarchy Node
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Map a new operational unit
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="bg-white dark:bg-gray-800 p-6 space-y-6">
          <form
            id="add-node-form"
            onSubmit={handleCreateNodeSubmit}
            className="space-y-6"
          >
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                Node Type
              </Label>
              <Select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value as any)}
                className="rounded-md"
              >
                <option value="DEPARTMENT">Department Node</option>
                <option value="POSITION">Role / Position Node</option>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                Node Name / Label
              </Label>
              <TextInput
                placeholder={
                  nodeType === "DEPARTMENT"
                    ? "e.g. Health Services"
                    : "e.g. Senior Officer"
                }
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                className="rounded-md"
                required
              />
            </div>
            {nodeType === "POSITION" && (
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Reporting Line / Parent Node
                </Label>
                <Select
                  value={nodeParent}
                  onChange={(e) => setNodeParent(e.target.value)}
                  className="rounded-md"
                >
                  <option value="">Executive Board</option>
                  {deptsList.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </form>
        </ModalBody>
        <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-3xl">
          <div className="flex justify-end gap-3 w-full">
            <Button
              color="light"
              onClick={() => setIsAddNodeOpen(false)}
              className="rounded-md font-bold uppercase text-xs px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-node-form"
              color="blue"
              className="rounded-md font-bold uppercase text-xs px-8 h-12"
            >
              Save Node
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* 3. Reporting Matrix Editor Modal */}
      <Modal
        show={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        size="xl"
      >
        <ModalHeader className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-3xl">
          <div className="flex flex-col">
            <h3 className="text-xl font-black dark:text-white leading-tight uppercase tracking-tight">
              Reporting Matrix Editor
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Orchestrate and map reporting relationships
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="bg-white dark:bg-gray-800 p-8 space-y-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900/60 rounded-md border border-dashed dark:border-gray-700 text-center space-y-4">
            <div className="w-16 h-16 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mx-auto border dark:border-gray-800">
              <Network size={28} />
            </div>
            <h5 className="font-black text-base dark:text-white uppercase tracking-tight">
              Dynamic Graph Node Mapping
            </h5>
            <p className="text-xs text-gray-400 font-bold leading-relaxed max-w-md mx-auto">
              Select reporting nodes and configure relationships between
              employees. You can reassign departments or structure hierarchies
              using drag-and-drop connections.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Active reporting nodes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/60 dark:bg-gray-700/20 border dark:border-gray-700/50 rounded-md">
                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">
                  Operational Lead
                </p>
                <p className="text-sm font-black dark:text-white mt-1">
                  Executive Board
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                  Top-level root node
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-700/20 border dark:border-gray-700/50 rounded-md">
                <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">
                  Sub-levels
                </p>
                <p className="text-sm font-black dark:text-white mt-1">
                  {deptsList.length} Divisions Map
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                  Reporting branches active
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-3xl">
          <div className="flex justify-end w-full">
            <Button
              color="light"
              onClick={() => setIsMatrixOpen(false)}
              className="rounded-md font-bold uppercase text-xs px-6"
            >
              Close Editor
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default StructureModule;
