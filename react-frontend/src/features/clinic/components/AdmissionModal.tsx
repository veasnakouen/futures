"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, CheckCircle2 } from "lucide-react";
import api from "../../../services/api";

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: any;
  onAdmitSuccess: () => void;
}

export default function AdmissionModal({ isOpen, onClose, room, onAdmitSuccess }: AdmissionModalProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchPatient, setSearchPatient] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setSelectedPatientId("");
      setSelectedDoctorId("");
      setReason("");
      setSearchPatient("");
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        api.get("/clinic/patients?size=100"), // Temporary fetching 100
        api.get("/clinic/doctors")
      ]);
      setPatients(patientsRes.data.content || []);
      setDoctors(doctorsRes.data.content || []);
    } catch (error) {
      console.error("Failed to fetch reference data", error);
    }
  };

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return alert("Please select a patient");
    if (!room) return alert("No room selected");

    setLoading(true);   
    try {
      await api.post("/clinic/ipd/admit", {
        patientId: selectedPatientId,
        roomId: room.id,
        attendingDoctorId: selectedDoctorId || null,
        reasonForAdmission: reason
      });
      onAdmitSuccess();
    } catch (error) {
      console.error("Failed to admit", error);
      alert("Failed to admit patient.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatient.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gradient-to-r from-indigo-50/50 to-white dark:from-gray-800 dark:to-gray-900">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Admit Patient</h3>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                  Assigning to Room {room?.roomNumber} ({room?.wardName})
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              >
            <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              <form id="admissionForm" onSubmit={handleAdmit} className="space-y-6">

                {/* Patient Search */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Select Patient <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients by name..."
                      value={searchPatient}
                      onChange={(e) => setSearchPatient(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>

                  {searchPatient && (
                    <div className="mt-2 max-h-40 overflow-y-auto border border-gray-100 dark:border-gray-800 rounded-xl divide-y divide-gray-50 dark:divide-gray-800/50">
                      {filteredPatients.length === 0 ? (
                        <div className="p-3 text-xs text-center text-gray-500">No patients found.</div>
                      ) : (
                        filteredPatients.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedPatientId(p.id);
                              setSearchPatient(`${p.firstName} ${p.lastName}`);
                            }}
                            className={`p-3 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-between ${selectedPatientId === p.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100">{p.firstName} {p.lastName}</span>
                            {selectedPatientId === p.id && <CheckCircle2 size={16} className="text-indigo-600" />}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Attending Doctor */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Attending Doctor</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                  >
                    <option value="">-- Select a Doctor (Optional) --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>
                    ))}
                  </select>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Reason for Admission</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm resize-none custom-scrollbar"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 shrink-0 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="admissionForm"
                disabled={loading || !selectedPatientId}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm transition-all active:scale-95 text-sm uppercase tracking-wider"
              >
                {loading ? 'Admitting...' : 'Confirm Admission'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
