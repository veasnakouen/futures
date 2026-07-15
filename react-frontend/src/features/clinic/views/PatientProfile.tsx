"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clinicService } from "../../../services/clinicService";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  FileText,
  Stethoscope,
  Clock,
  ArrowLeft,
  Edit2,
  Droplet
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { Link, useNavigate } from '@/lib/react-router-compat';
import ClinicalNotesTab from "./ClinicalNotesTab";
import PrescriptionsTab from "./PrescriptionsTab";

export default function PatientProfile({ patientId }: { patientId: string }) {
  const navigate = useNavigate();

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => clinicService.getPatientById(patientId).then((res) => res.data),
  });

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading Profile...</div>;
  }

  if (!patient) {
    return <div className="flex h-full items-center justify-center">Patient not found</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 p-2">
      {/* Header & Quick Info */}
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => window.history.back()} className="p-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all shadow-sm">
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/30 border-4 border-white dark:border-gray-800">
              {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h2>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  {patient.gender}
                </span>
                {patient.poorId && (
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Poor ID: {patient.poorId}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-500" />
                  DOB: {patient.dateOfBirth}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-500" />
                  {patient.contactNumber}
                </div>
                {patient.bloodType && (
                  <div className="flex items-center gap-1.5">
                    <Droplet size={14} className="text-rose-500" />
                    Blood: {patient.bloodType}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 px-5 py-2.5 rounded-xl font-bold text-gray-700 dark:text-gray-200 transition-all shadow-sm border border-gray-200 dark:border-gray-700">
            <Edit2 size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="overview" className="flex flex-col gap-6">
        <Tabs.List className="flex overflow-x-auto custom-scrollbar gap-2 p-1 bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl w-fit">
          <Tabs.Trigger value="overview" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all outline-none">
            <User size={16} /> Overview
          </Tabs.Trigger>
          <Tabs.Trigger value="appointments" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all outline-none">
            <Calendar size={16} /> Appointments
          </Tabs.Trigger>
          <Tabs.Trigger value="clinical" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all outline-none">
            <FileText size={16} /> Clinical Notes
          </Tabs.Trigger>
          <Tabs.Trigger value="prescriptions" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all outline-none">
            <Stethoscope size={16} /> Prescriptions
          </Tabs.Trigger>
          <Tabs.Trigger value="labs" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all outline-none">
            <Activity size={16} /> Lab Results
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500"><Phone size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{patient.contactNumber || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500"><Mail size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{patient.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500"><MapPin size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {patient.address ? `${patient.address.street}, ${patient.address.city}` : "No address on file"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vital Alerts / Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                <Activity size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Patient Overview</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Detailed clinical history, active prescriptions, and lab orders will be displayed here. 
                Navigate through the tabs above to view specific electronic health records.
              </p>
            </motion.div>
          </div>
        </Tabs.Content>
        
        {/* Placeholder for other tabs */}
        <Tabs.Content value="appointments" className="outline-none">
           <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-12 rounded-3xl shadow-xl text-center">
             <Calendar size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Appointment History</h3>
             <p className="text-sm text-gray-500">Integration with AppointmentService pending.</p>
           </div>
        </Tabs.Content>
        
        <Tabs.Content value="clinical" className="outline-none">
           <ClinicalNotesTab patientId={patientId} />
        </Tabs.Content>

        <Tabs.Content value="prescriptions" className="outline-none">
           <PrescriptionsTab patientId={patientId} />
        </Tabs.Content>

        <Tabs.Content value="labs" className="outline-none">
           <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-12 rounded-3xl shadow-xl text-center">
             <Activity size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Lab Orders & Results</h3>
             <p className="text-sm text-gray-500">Loading laboratory data...</p>
           </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
