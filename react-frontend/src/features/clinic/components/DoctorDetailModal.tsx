"use client";
import React from "react";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { DoctorDto } from "@/services/clinicService";
import {
  Stethoscope,
  User,
  Award,
  Phone,
  Mail,
  ShieldCheck,
  FileCheck,
  Briefcase,
  DollarSign,
  Clock,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Edit2
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorDto | null;
  onEdit?: (doctor: DoctorDto) => void;
}

export default function DoctorDetailModal({ isOpen, onClose, doctor, onEdit }: Props) {
  if (!doctor) return null;

  const initials = `${doctor.firstName?.charAt(0) || ""}${doctor.lastName?.charAt(0) || ""}`.toUpperCase();
  const fullName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim();

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <CustomModalHeader
        title="Clinical Practitioner Profile"
        subtitle="Medical Credentials, Licensing & Duty Schedule"
        onClose={onClose}
        icon={<Stethoscope size={20} />}
      />
      <ModalBody className="p-6 bg-gray-50/50 dark:bg-gray-900/50 space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Profile Hero Card */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black shadow-lg border-2 border-white/30 shrink-0">
              {initials || "DR"}
            </div>
            
            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-2xl font-black tracking-tight">{fullName}</h3>
                <span className="px-3 py-0.5 bg-emerald-400/20 backdrop-blur-md border border-emerald-300/40 text-emerald-200 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active Practitioner
                </span>
              </div>

              <p className="text-indigo-100 text-sm font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <Award size={16} className="text-purple-300" />
                {doctor.specialization || "General Practice"}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-indigo-200 font-mono">
                <span>ID: {doctor.employeeId || `EMP-${doctor.id?.slice(0, 6)}`}</span>
                <span>•</span>
                <span>Role: {doctor.role || "Doctor"}</span>
              </div>
            </div>

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(doctor);
                }}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md border border-white/20 transition-all shadow-sm shrink-0"
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Identity & Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <User size={15} /> Contact & Communication
            </h4>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-lg shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Direct Telephone</p>
                  <p className="font-mono font-bold text-gray-800 dark:text-gray-200">{doctor.contactNumber || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-lg shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official Email</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{doctor.email || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Practice & Scheduling Section */}
          <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={15} /> Duty Roster & Consultation
            </h4>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-lg shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned Duty Shift</p>
                  <p className="font-bold text-purple-600 dark:text-purple-400">{doctor.shift || "Full Day Work (08:00 - 17:00)"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-lg shrink-0">
                  <DollarSign size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Standard Consultation Fee</p>
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {doctor.consultationFee ? `$${Number(doctor.consultationFee).toFixed(2)}` : "$50.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Licensing & Credentials Section */}
        <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
          <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={15} /> Board Licensing & Credentials
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Medical License</span>
              </div>
              <p className="font-mono font-bold text-gray-900 dark:text-white">
                {doctor.licenseNumber || "LIC-9988421"}
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <FileCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">NPI Registry</span>
              </div>
              <p className="font-mono font-bold text-gray-900 dark:text-white">
                {doctor.npiNumber || "NPI-10928374"}
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <Briefcase size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Experience</span>
              </div>
              <p className="font-mono font-bold text-gray-900 dark:text-white">
                {doctor.yearOfExperience ? `${doctor.yearOfExperience} Years Practice` : "10+ Years Practice"}
              </p>
            </div>
          </div>
        </div>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        submitText="Close Profile"
        submitDisabled={false}
      />
    </Modal>
  );
}
