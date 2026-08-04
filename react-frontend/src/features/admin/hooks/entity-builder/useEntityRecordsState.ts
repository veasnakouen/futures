import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export interface DynamicRecord {
  id: string;
  entityKey: string;
  recordCode: string;
  dataJson: string;
  relationsJson: string;
  createdAt?: string;
}

export const INITIAL_MOCK_RECORDS: DynamicRecord[] = [
  {
    id: "rec-101",
    entityKey: "EQUIPMENT_TRACKER",
    recordCode: "EQP-2026-001",
    dataJson: JSON.stringify({ name: "Ultrasonic Scanner V4", serial: "SN-99812", status: "Operational", cost: "$4,500" }),
    relationsJson: JSON.stringify({ targetKey: "PATIENTS", targetId: "PAT-0091", targetName: "Preap Sovath (Patient #102)" }),
    createdAt: "2026-07-28T10:00:00Z",
  },
  {
    id: "rec-102",
    entityKey: "VEHICLE_LOG",
    recordCode: "VHC-2026-044",
    dataJson: JSON.stringify({ name: "Ford Transit Ambulance", plate: "2B-9988", fuelLevel: "85%", status: "Active" }),
    relationsJson: JSON.stringify({ targetKey: "USERS", targetId: "USR-001", targetName: "Khorn Veasna (Super Admin)" }),
    createdAt: "2026-07-29T14:30:00Z",
  },
];

export function useEntityRecordsState(selectedEntityKey: string) {
  const [records, setRecords] = useState<DynamicRecord[]>(INITIAL_MOCK_RECORDS);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newRecordData, setNewRecordData] = useState({
    recordName: "",
    dataType: "STRING",
    status: "ACTIVE",
    priority: "MEDIUM",
    category: "OPERATIONS",
    tags: "auto_create, indexed",
    description: "",
    targetId: "",
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordData.recordName.trim()) {
      toast.error("Record Name is required");
      return;
    }

    const recordPayload: DynamicRecord = {
      id: "rec-" + Date.now(),
      entityKey: selectedEntityKey,
      recordCode: "REC-" + Date.now().toString().slice(-6),
      dataJson: JSON.stringify({
        name: newRecordData.recordName,
        status: newRecordData.status,
        category: newRecordData.category,
        tags: newRecordData.tags,
        description: newRecordData.description,
      }),
      relationsJson: JSON.stringify({
        targetKey: "PATIENTS",
        targetId: newRecordData.targetId || "PAT-001",
        targetName: "Mapped Patient Record",
      }),
      createdAt: new Date().toISOString(),
    };

    try {
      api.post("/admin/dynamic-entities/records", recordPayload);
    } catch (err) {
      console.warn("Saved record locally", err);
    }

    setRecords([recordPayload, ...records]);
    setShowRecordModal(false);
    setNewRecordData({
      recordName: "",
      dataType: "STRING",
      status: "ACTIVE",
      priority: "MEDIUM",
      category: "OPERATIONS",
      tags: "auto_create, indexed",
      description: "",
      targetId: "",
    });
    toast.success("Dynamic record saved successfully!");
  };

  return {
    records,
    setRecords,
    showRecordModal,
    setShowRecordModal,
    searchQuery,
    setSearchQuery,
    newRecordData,
    setNewRecordData,
    handleCreateRecord,
  };
}
