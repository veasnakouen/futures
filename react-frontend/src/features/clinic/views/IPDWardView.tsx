"use client";

import React, { useState, useEffect } from "react";
import { Bed, Users, Activity, Plus, FileText, CheckCircle2 } from "lucide-react";
import api from "../../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import AdmissionModal from "../components/AdmissionModal";

interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  wardName: string;
  floor: string;
  bedCapacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
}

interface Admission {
  id: string;
  patient: { id: string; firstName: string; lastName: string };
  room: { id: string };
  attendingDoctor: { id: string; firstName: string; lastName: string } | null;
  admissionDate: string;
  status: string;
}

export default function IPDWardView() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, admissionsRes] = await Promise.all([
        api.get("/clinic/ipd/rooms"),
        api.get("/clinic/ipd/admissions")
      ]);
      // If db is empty, populate some dummy rooms
      let fetchedRooms = roomsRes.data;
      if (fetchedRooms.length === 0) {
        fetchedRooms = [
          { id: "1", roomNumber: "101", wardName: "General", status: "AVAILABLE", roomType: "Standard", bedCapacity: 1 },
          { id: "2", roomNumber: "102", wardName: "General", status: "OCCUPIED", roomType: "Standard", bedCapacity: 1 },
          { id: "3", roomNumber: "201", wardName: "ICU", status: "AVAILABLE", roomType: "Intensive", bedCapacity: 1 },
          { id: "4", roomNumber: "202", wardName: "ICU", status: "MAINTENANCE", roomType: "Intensive", bedCapacity: 1 },
        ];
      }
      setRooms(fetchedRooms);
      setAdmissions(admissionsRes.data);
    } catch (error) {
      console.error("Failed to fetch IPD data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    if (room.status === "AVAILABLE") {
      setIsAdmissionModalOpen(true);
    }
  };

  const handleDischarge = async (admissionId: string) => {
    if (!window.confirm("Are you sure you want to discharge this patient?")) return;
    try {
      await api.post(`/clinic/ipd/discharge/${admissionId}`);
      fetchData();
      setSelectedRoom(null);
    } catch (error) {
      console.error("Failed to discharge", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
      case "OCCUPIED": return "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400";
      case "MAINTENANCE": return "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400";
      default: return "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-emerald-500";
      case "OCCUPIED": return "bg-rose-500";
      case "MAINTENANCE": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  const wards = Array.from(new Set(rooms.map(r => r.wardName || "Unassigned")));

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-[50vh]"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">IPD Ward Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Real-time overview of hospital beds and admissions.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Available ({rooms.filter(r => r.status === 'AVAILABLE').length})</div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600"><div className="w-2 h-2 rounded-full bg-rose-500"/> Occupied ({rooms.filter(r => r.status === 'OCCUPIED').length})</div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600"><div className="w-2 h-2 rounded-full bg-amber-500"/> Maintenance ({rooms.filter(r => r.status === 'MAINTENANCE').length})</div>
        </div>
      </div>

      <div className="space-y-8">
        {wards.map(ward => {
          const wardRooms = rooms.filter(r => (r.wardName || "Unassigned") === ward);
          return (
            <div key={ward} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl overflow-hidden shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest"><Bed size={20} className="text-indigo-500" /> {ward} Ward</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {wardRooms.map((room) => {
                  const activeAdmission = room.status === "OCCUPIED" 
                    ? admissions.find(a => a.room.id === room.id && a.status === "ADMITTED") 
                    : null;

                  return (
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      key={room.id}
                      onClick={() => handleRoomClick(room)}
                      className={`relative cursor-pointer rounded-xl p-4 border ${getStatusColor(room.status)} transition-all shadow-sm hover:shadow-md flex flex-col items-center justify-center min-h-[120px]`}
                    >
                      <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${getStatusDot(room.status)} shadow-sm`} />
                      <span className="text-2xl font-black mb-1 opacity-80">{room.roomNumber}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 text-center">{room.roomType || 'Standard'}</span>
                      
                      {activeAdmission && (
                        <div className="mt-3 flex flex-col items-center gap-1 w-full border-t border-current pt-2 opacity-90">
                          <span className="text-[10px] font-bold truncate w-full text-center">{activeAdmission.patient.firstName} {activeAdmission.patient.lastName}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedRoom && selectedRoom.status === "OCCUPIED" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedRoom(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-gray-200 dark:border-gray-800"
            >
              {(() => {
                const activeAdmission = admissions.find(a => a.room.id === selectedRoom.id && a.status === "ADMITTED");
                if (!activeAdmission) return <div className="p-6">No active admission found.</div>;
                return (
                  <>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Bed size={24} className="text-indigo-500"/> Room {selectedRoom.roomNumber} Details
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Patient</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{activeAdmission.patient.firstName} {activeAdmission.patient.lastName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Admitted On</p>
                          <p className="font-medium text-gray-700 dark:text-gray-300">{new Date(activeAdmission.admissionDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Attending</p>
                          <p className="font-medium text-gray-700 dark:text-gray-300">{activeAdmission.attendingDoctor ? `Dr. ${activeAdmission.attendingDoctor.lastName}` : 'Unassigned'}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                          onClick={() => handleDischarge(activeAdmission.id)}
                          className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-sm transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={18} /> Discharge Patient
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdmissionModal 
        isOpen={isAdmissionModalOpen} 
        onClose={() => {
          setIsAdmissionModalOpen(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        onAdmitSuccess={() => {
          setIsAdmissionModalOpen(false);
          setSelectedRoom(null);
          fetchData();
        }}
      />
    </div>
  );
}
