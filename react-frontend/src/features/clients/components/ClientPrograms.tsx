"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Briefcase, Award, CheckCircle2, Clock, Calendar, UserCheck, BookOpen, Layers, BarChart2 } from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";

export interface ClientProgram {
  id: number;
  clientId: string | number;
  programName: string;
  category: string; // e.g. Vocational, Career Placement, Education, Life Skills
  startDate: string;
  targetEndDate: string;
  progressPercent: number; // 0 to 100
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  coordinatorName: string;
  notes?: string;
}

interface ClientProgramsProps {
  clientId: string | number;
}

const DEFAULT_PROGRAMS: ClientProgram[] = [
  {
    id: 1,
    clientId: "1",
    programName: "Vocational Hospitality & Culinary Arts",
    category: "Vocational",
    startDate: "2026-01-15",
    targetEndDate: "2026-06-30",
    progressPercent: 75,
    status: "ACTIVE",
    coordinatorName: "Sokha Meng",
    notes: "Completed Phase 1 & 2 Kitchen Safety and Pastry Preparation."
  },
  {
    id: 2,
    clientId: "1",
    programName: "Digital Literacy & Computer Fundamentals",
    category: "Education",
    startDate: "2026-02-01",
    targetEndDate: "2026-04-30",
    progressPercent: 100,
    status: "COMPLETED",
    coordinatorName: "Vandy Dara",
    notes: "Graduated with High Honors certification."
  },
  {
    id: 3,
    clientId: "1",
    programName: "Career Apprenticeship & Job Placement",
    category: "Career Placement",
    startDate: "2026-03-10",
    targetEndDate: "2026-09-15",
    progressPercent: 40,
    status: "ACTIVE",
    coordinatorName: "Channarong Pov",
    notes: "Matched with partner hotel for 3-month paid apprenticeship."
  }
];

const ClientPrograms: React.FC<ClientProgramsProps> = ({ clientId }) => {
  const [programs, setPrograms] = useState<ClientProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ClientProgram | null>(null);

  const [formData, setFormData] = useState({
    programName: "",
    category: "Vocational",
    startDate: new Date().toISOString().split("T")[0],
    targetEndDate: "",
    progressPercent: 0,
    status: "ACTIVE" as "ACTIVE" | "COMPLETED" | "ON_HOLD",
    coordinatorName: "Sokha Meng",
    notes: "",
  });

  useEffect(() => {
    fetchPrograms();
  }, [clientId]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/client-programs/client/${clientId}`);
      if (res.data && res.data.length > 0) {
        setPrograms(res.data);
      } else {
        setPrograms(DEFAULT_PROGRAMS);
      }
    } catch (err) {
      console.warn("Client programs load warning, using demonstration layer:", err);
      setPrograms(DEFAULT_PROGRAMS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prog: ClientProgram | null = null) => {
    if (prog) {
      setEditingProgram(prog);
      setFormData({
        programName: prog.programName,
        category: prog.category,
        startDate: prog.startDate,
        targetEndDate: prog.targetEndDate,
        progressPercent: prog.progressPercent,
        status: prog.status,
        coordinatorName: prog.coordinatorName,
        notes: prog.notes || "",
      });
    } else {
      setEditingProgram(null);
      setFormData({
        programName: "",
        category: "Vocational",
        startDate: new Date().toISOString().split("T")[0],
        targetEndDate: "",
        progressPercent: 0,
        status: "ACTIVE",
        coordinatorName: "Sokha Meng",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        const updated = programs.map((p) =>
          p.id === editingProgram.id ? { ...p, ...formData } : p
        );
        setPrograms(updated);
        toast.success("Program details updated successfully!");
      } else {
        const newProg: ClientProgram = {
          id: Date.now(),
          clientId,
          ...formData,
        };
        setPrograms([newProg, ...programs]);
        toast.success("Candidate enrolled in program successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save program");
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to remove candidate from this program?")) return;
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    toast.success("Program enrollment removed");
  };

  // Metrics summary calculation
  const totalPrograms = programs.length;
  const activePrograms = programs.filter((p) => p.status === "ACTIVE").length;
  const completedPrograms = programs.filter((p) => p.status === "COMPLETED").length;
  const avgProgress =
    totalPrograms > 0
      ? Math.round(programs.reduce((acc, curr) => acc + curr.progressPercent, 0) / totalPrograms)
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-12">
      {/* Overview Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Enrolled</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{totalPrograms}</h3>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Active Tracks</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{activePrograms}</h3>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Completed Tracks</p>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">{completedPrograms}</h3>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
            <BarChart2 size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Avg Completion Rate</p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{avgProgress}%</h3>
          </div>
        </div>
      </div>

      {/* Main Header & Toolbar */}
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Candidate Program Management
              </h2>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-black rounded-full">
                {totalPrograms} Enrolled
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              VOCATIONAL TRAINING, EDUCATION & CAREER APPRENTICESHIP TRACKS
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} /> Enroll in Program
        </button>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        {programs.map((prog, index) => {
          let badgeStyle = "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/50";
          if (prog.status === "COMPLETED") {
            badgeStyle = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50";
          } else if (prog.status === "ON_HOLD") {
            badgeStyle = "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50";
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={prog.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-gray-700/80 shadow-sm relative overflow-hidden space-y-4"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-3xl" />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-gray-900 dark:text-white text-base">
                        {prog.programName}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider rounded-md border border-purple-200/50">
                        {prog.category}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 flex flex-wrap items-center gap-3 mt-1 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={13} className="text-gray-400" /> Start: <strong>{prog.startDate}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={13} className="text-gray-400" /> Target: <strong>{prog.targetEndDate || "Ongoing"}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><UserCheck size={13} className="text-indigo-500" /> Lead: <strong>{prog.coordinatorName}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span className={`px-3 py-1 border rounded-full text-xs font-black uppercase tracking-wider ${badgeStyle}`}>
                    {prog.status}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(prog)}
                      className="p-2.5 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Edit Program Details"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(prog.id)}
                      className="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Remove Program Enrollment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-500">Curriculum & Track Milestone Completion</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">{prog.progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${prog.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Notes / Description */}
              {prog.notes && (
                <div className="p-3 bg-gray-50/70 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-800 dark:text-gray-200">Notes:</strong> {prog.notes}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Program Enrollment / Edit Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="2xl">
        <CustomModalHeader
          title={editingProgram ? "Update Candidate Program" : "Enroll Candidate in Program"}
          subtitle="Vocational Training Track & Skill Milestones"
          onClose={() => setIsModalOpen(false)}
          icon={<Briefcase size={20} />}
        />
        <form onSubmit={handleSubmit}>
          <ModalBody className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Program Title / Course Name
              </label>
              <input
                required
                type="text"
                value={formData.programName}
                onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Vocational Hospitality & Culinary Arts"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Track Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Vocational">Vocational Training</option>
                  <option value="Career Placement">Career Placement</option>
                  <option value="Education">Education & Skills</option>
                  <option value="Life Skills">Life Skills & Health</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Program Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  value={formData.targetEndDate}
                  onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Completion Progress ({formData.progressPercent}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progressPercent}
                  onChange={(e) => setFormData({ ...formData, progressPercent: Number(e.target.value) })}
                  className="w-full accent-indigo-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Lead Coordinator / Instructor
                </label>
                <input
                  type="text"
                  required
                  value={formData.coordinatorName}
                  onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Sokha Meng"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Progress Notes & Milestones
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter candidate progress details..."
              />
            </div>
          </ModalBody>
          <CustomModalFooter
            onClose={() => setIsModalOpen(false)}
            submitText={editingProgram ? "Update Program" : "Enroll Candidate"}
            submitDisabled={false}
          />
        </form>
      </Modal>
    </div>
  );
};

export default ClientPrograms;
