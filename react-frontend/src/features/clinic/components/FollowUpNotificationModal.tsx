"use client";
import React, { useState } from "react";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Bell, Send, MessageSquare, Mail, Smartphone, Calendar, User, Stethoscope, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export interface FollowUpItem {
  id: string;
  patientId: string;
  patientName: string;
  contactNumber: string;
  email: string;
  doctorName: string;
  reason: string;
  dueDate: string;
  status: "DUE_TODAY" | "OVERDUE" | "UPCOMING" | "REMINDER_SENT" | "SCHEDULED";
  lastNotifiedAt?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: FollowUpItem | null;
  onSuccess?: () => void;
}

export default function FollowUpNotificationModal({ isOpen, onClose, item, onSuccess }: Props) {
  const [channel, setChannel] = useState<"SMS" | "EMAIL" | "PUSH">("SMS");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    if (item) {
      const defaultText = `Hello ${item.patientName}, this is a reminder from your healthcare provider at MTP Health. You have a scheduled follow-up check-up for "${item.reason}" due on ${item.dueDate}. Please contact us or click the link to confirm your visit: https://mtp-clinic.health/booking?pid=${item.patientId}`;
      setMessage(defaultText);
    }
  }, [item]);

  if (!item) return null;

  const handleSendReminder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      toast.success(
        `Follow-up reminder sent to ${item.patientName} via ${channel === "SMS" ? "SMS Text" : channel === "EMAIL" ? "Email" : "In-App Push"}!`,
        { icon: "📱", duration: 4000 }
      );
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <CustomModalHeader
        title="Send Patient Follow-Up Reminder"
        subtitle="Notify patient for post-consultation check-up & review"
        onClose={onClose}
        icon={<Bell size={20} />}
      />
      <form onSubmit={handleSendReminder}>
        <ModalBody className="p-6 bg-gray-50/50 dark:bg-gray-900/50 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Patient Overview Card */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                <User size={18} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                  {item.patientName} <span className="font-mono text-xs font-normal text-gray-400">({item.patientId})</span>
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                  <span>Phone: <strong className="text-gray-800 dark:text-gray-200">{item.contactNumber}</strong></span>
                  <span>•</span>
                  <span>Due: <strong className="text-indigo-600 dark:text-indigo-400">{item.dueDate}</strong></span>
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-full">
              {item.status.replace("_", " ")}
            </span>
          </div>

          {/* Reason Card */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
            <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1 flex items-center gap-1">
              <Stethoscope size={12} /> Clinical Follow-Up Reason
            </p>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              {item.reason}
            </p>
          </div>

          {/* Notification Channel Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Notification Channel
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setChannel("SMS")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  channel === "SMS"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50"
                }`}
              >
                <Smartphone size={16} /> SMS Text
              </button>

              <button
                type="button"
                onClick={() => setChannel("EMAIL")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  channel === "EMAIL"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50"
                }`}
              >
                <Mail size={16} /> Email Notice
              </button>

              <button
                type="button"
                onClick={() => setChannel("PUSH")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  channel === "PUSH"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50"
                }`}
              >
                <MessageSquare size={16} /> Portal Push
              </button>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Reminder Message Body
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xs font-medium text-gray-800 dark:text-gray-200 resize-none"
            />
          </div>
        </ModalBody>
        <CustomModalFooter
          onClose={onClose}
          submitText={isSending ? "Dispatching Reminder..." : "Dispatch Reminder"}
          submitDisabled={isSending}
        />
      </form>
    </Modal>
  );
}
