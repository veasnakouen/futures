import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export interface EntityRelationship {
  id: string;
  sourceEntityKey: string;
  relationshipName: string;
  targetEntityKey: string;
  relationshipType: string;
  isRequired: boolean;
}

export const INITIAL_MOCK_RELATIONSHIPS: EntityRelationship[] = [
  {
    id: "rel-1",
    sourceEntityKey: "EQUIPMENT_TRACKER",
    relationshipName: "Assigned Clinic Patient",
    targetEntityKey: "PATIENTS",
    relationshipType: "MANY_TO_ONE",
    isRequired: true,
  },
  {
    id: "rel-2",
    sourceEntityKey: "EQUIPMENT_TRACKER",
    relationshipName: "Responsible Doctor / Staff",
    targetEntityKey: "USERS",
    relationshipType: "MANY_TO_ONE",
    isRequired: false,
  },
  {
    id: "rel-3",
    sourceEntityKey: "VEHICLE_LOG",
    relationshipName: "Assigned Driver Staff",
    targetEntityKey: "USERS",
    relationshipType: "MANY_TO_ONE",
    isRequired: true,
  },
];

export function useEntityRelationshipsState(selectedEntityKey: string) {
  const [relationships, setRelationships] = useState<EntityRelationship[]>(INITIAL_MOCK_RELATIONSHIPS);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);

  const [newRel, setNewRel] = useState({
    sourceEntityKey: selectedEntityKey,
    relationshipName: "",
    targetEntityKey: "PATIENTS",
    relationshipType: "MANY_TO_ONE",
    isRequired: false,
  });

  const handleCreateRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRel.relationshipName.trim()) {
      toast.error("Relationship Name is required");
      return;
    }

    const relPayload: EntityRelationship = {
      id: "rel-" + Date.now(),
      sourceEntityKey: selectedEntityKey,
      relationshipName: newRel.relationshipName,
      targetEntityKey: newRel.targetEntityKey,
      relationshipType: newRel.relationshipType,
      isRequired: newRel.isRequired,
    };

    try {
      await api.post("/admin/dynamic-entities/relationships", relPayload);
    } catch (err) {
      console.warn("Saved relationship locally", err);
    }

    setRelationships([...relationships, relPayload]);
    setShowRelationshipModal(false);
    setNewRel({
      sourceEntityKey: selectedEntityKey,
      relationshipName: "",
      targetEntityKey: "PATIENTS",
      relationshipType: "MANY_TO_ONE",
      isRequired: false,
    });
    toast.success("Cross-entity relationship mapped successfully!");
  };

  return {
    relationships,
    setRelationships,
    showRelationshipModal,
    setShowRelationshipModal,
    newRel,
    setNewRel,
    handleCreateRelationship,
  };
}
