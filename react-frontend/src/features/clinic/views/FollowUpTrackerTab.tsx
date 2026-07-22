"use client";
import React, { useState } from "react";
import { Bell, Calendar, Plus, Clock, Stethoscope, Send, CheckCircle2, AlertCircle, Phone, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import FollowUpNotificationModal, { FollowUpItem } from "../components/FollowUpNotificationModal";
import AppointmentFormModal from "../components/AppointmentFormModal";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { toast } from "react-hot-toast";

interface Props {
  patientId: string;
}

export default function FollowUpTrackerTab({ patientId }: Props) {
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpItem | null>(null);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newFollowUp, setNewFollowUp] = useState({
    reason: "",
    dueDate: "",
    doctorName: "Dr. Sarah Jenkins",
  });

  // List of follow-up items for specific patient
  const [followUpList, setFollowUpList] = useState<FollowUpItem[]>([
    {
      id: "FW-801",
      patientId,
      patientName: "Jackson Doe",
      contactNumber: "011245587885",
      email: "jackson.doe@example.com",
      doctorName: "Dr. Sarah Jenkins",
      reason: "Post-Consultation Evaluation: Acute Bronchitis Lung Auscultation & Pulse Ox Re-check",
      dueDate: "2026-07-25",
      status: "DUE_TODAY",
      lastNotifiedAt: "2026-07-23 09:00 AM"
    },
    {
      id: "FW-802",
      patientId,
      patientName: "Jackson Doe",
      contactNumber: "011245587885",
      email: "jackson.doe@example.com",
      doctorName: "Dr. Alex Chen",
      reason: "30-Day Hypertension Blood Pressure & Lipid Panel Re-assessment",
      dueDate: "2026-08-10",
      status: "UPCOMING"
    }
  ]);

  const handleOpenNotify = (item: FollowUpItem) => {
    setSelectedFollowUp(item);
    setIsNotifyModalOpen(true);
  };

  const handleOpenSchedule = (item: FollowUpItem) => {
    setSelectedFollowUp(item);
    setIsScheduleModalOpen(true);
  };

  const handleNotificationSuccess = () => {
    if (!selectedFollowUp) return;
    setFollowUpList((prev) =>
      prev.map((f) =>
        f.id === selectedFollowUp.id
          ? { ...f, status: "REMINDER_SENT", lastNotifiedAt: new Date().toLocaleString() }
          : f
      )
    );
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FollowUpItem = {
      id: `FW-${Date.now().toString().slice(-4)}`,
      patientId,
      patientName: "Jackson Doe",
      contactNumber: "011245587885",
      email: "jackson.doe@example.com",
      doctorName: newFollowUp.doctorName,
      reason: newFollowUp.reason,
      dueDate: newFollowUp.dueDate || "2026-07-30",
      status: "UPCOMING",
    };

    setFollowUpList([created, ...followUpList]);
    toast.success("New follow-up check-up registered!");
    setIsAddModalOpen(false);
    setNewFollowUp({ reason: "", dueDate: "", doctorName: "Dr. Sarah Jenkins" });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
            <Bell size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Patient Follow-Up Check-Up Registry
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              POST-CONSULTATION CARE TRACKER & AUTOMATED REMINDER DISPATCH
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} /> New Follow-Up Check-Up
        </button>
      </div>

      {/* Follow-up Cards List */}
      <div className="space-y-4">
        {followUpList.map((item, index) => {
          let badgeColor = "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200/50";
          if (item.status === "DUE_TODAY") {
            badgeColor = "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200/50 animate-pulse";
          } else if (item.status === "REMINDER_SENT") {
            badgeColor = "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200/50";
          } else if (item.status === "SCHEDULED") {
            badgeColor = "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50";
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden space-y-4"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-2xl" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                      {item.reason}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Clock size={13} /> Due: <strong className="text-gray-800 dark:text-gray-200">{item.dueDate}</strong></span>
                      <span>•</span>
                      <span>Attending: <strong className="text-indigo-600 dark:text-indigo-400">{item.doctorName}</strong></span>
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 border rounded-full text-xs font-black uppercase tracking-wider ${badgeColor}`}>
                  {item.status.replace("_", " ")}
                </span>
              </div>

              {/* Notification History Log */}
              {item.lastNotifiedAt && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <MessageSquare size={14} className="text-blue-500 shrink-0" />
                  <span>Last Reminder Dispatched: <strong>{item.lastNotifiedAt}</strong></span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap justify-end gap-3 border-t border-gray-100 dark:border-gray-800/60">
                <button
                  onClick={() => handleOpenNotify(item)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Send size={14} /> Send Reminder Notice
                </button>

                <button
                  onClick={() => handleOpenSchedule(item)}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 active:scale-95"
                >
                  <Calendar size={14} /> Schedule Visit
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add New Follow-Up Check-Up Modal */}
      <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="2xl">
        <CustomModalHeader
          title="Add Follow-Up Check-Up Task"
          subtitle="Schedule post-consultation evaluation for patient"
          onClose={() => setIsAddModalOpen(false)}
          icon={<Bell size={20} />}
        />
        <form onSubmit={handleCreateFollowUp}>
          <ModalBody className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Clinical Reason / Check-Up Description
              </label>
              <textarea
                required
                rows={3}
                value={newFollowUp.reason}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, reason: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-xs font-bold text-gray-900 dark:text-white resize-none"
                placeholder="e.g. 14-Day Post-Op Wound Evaluation & Suture Re-assessment"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Follow-Up Due Date
                </label>
                <input
                  type="date"
                  required
                  value={newFollowUp.dueDate}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-xs font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Attending Physician
                </label>
                <input
                  type="text"
                  required
                  value={newFollowUp.doctorName}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, doctorName: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-xs font-bold text-gray-900 dark:text-white"
                  placeholder="Dr. Sarah Jenkins"
                />
              </div>
            </div>
          </ModalBody>
          <CustomModalFooter
            onClose={() => setIsAddModalOpen(false)}
            submitText="Save Follow-Up Task"
            submitDisabled={false}
          />
        </form>
      </Modal>

      {/* Notification Modal */}
      <FollowUpNotificationModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        item={selectedFollowUp}
        onSuccess={handleNotificationSuccess}
      />

      {/* Schedule Modal */}
      <AppointmentFormModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        itemToEdit={null}
      />
    </div>
  );
}
