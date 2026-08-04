"use client";
import React from "react";
import { useLocationManagementState } from "@/features/admin/hooks/useLocationManagementState";

import LocationHeaderBar from "./location/LocationHeaderBar";
import LocationHierarchyGrid from "./location/LocationHierarchyGrid";
import JsonLocationImporterModal from "./location/JsonLocationImporterModal";

export default function LocationManagement() {
  const state = useLocationManagementState();

  return (
    <div className="p-6 space-y-6">
      {/* Location Management Header Bar */}
      <LocationHeaderBar state={state} />

      {/* 4-Column Cascading Location Hierarchy Grid */}
      <LocationHierarchyGrid state={state} />

      {/* Bulk JSON Location Importer & Data Cleaner Modal */}
      <JsonLocationImporterModal state={state} />
    </div>
  );
}
