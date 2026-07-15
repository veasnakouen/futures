"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clinicService } from "../../../../services/clinicService";
import { Calendar, Search, CreditCard, Activity, DollarSign, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GenerateInvoiceModal from "../../components/GenerateInvoiceModal";

export default function DailyBillingQueue() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const { data: recordsData, isLoading: isLoadingRecords } = useQuery({
    queryKey: ["todayRecords"],
    queryFn: () => clinicService.getTodayMedicalRecords(0, 100).then((res) => res.data.content || res.data),
  });

  const { data: patientsData, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patientsList"],
    queryFn: () => clinicService.getPatients(0, 500).then((res) => res.data.content || res.data),
  });

  const getPatientForRecord = (patientId: string) => {
    return patientsData?.find((p: any) => p.id === patientId) || { firstName: "Unknown", lastName: "Patient" };
  };

  const filteredRecords = recordsData?.filter((record: any) => {
    const patient = getPatientForRecord(record.patientId);
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenInvoiceModal = (record: any) => {
    const patient = getPatientForRecord(record.patientId);
    setSelectedRecord({ ...record, patient });
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <CreditCard size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Billing Queue</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Process invoices for today's consultations</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search patient or diagnosis..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-3 bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {isLoadingRecords || isLoadingPatients ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading today's queue...</p>
          </div>
        ) : filteredRecords && filteredRecords.length > 0 ? (
          filteredRecords.map((record: any, index: number) => {
            const patient = getPatientForRecord(record.patientId);
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 group-hover:w-2 transition-all"></div>
                
                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      {patient.poorId && (
                        <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Poor ID
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Calendar size={14} /> {new Date(record.recordDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl w-full">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Diagnosis</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                      {record.diagnosis || "No diagnosis provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                    <p className="text-sm font-bold text-amber-500">Pending Billing</p>
                  </div>
                  <button 
                    onClick={() => handleOpenInvoiceModal(record)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30"
                  >
                    <DollarSign size={18} /> Generate Invoice
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white/40 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <CheckCircle2 size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">All caught up!</h3>
            <p className="text-gray-400 dark:text-gray-500">No pending consultations for today.</p>
          </div>
        )}
      </div>

      {isInvoiceModalOpen && (
        <GenerateInvoiceModal 
          record={selectedRecord} 
          onClose={() => setIsInvoiceModalOpen(false)} 
        />
      )}
    </div>
  );
}
