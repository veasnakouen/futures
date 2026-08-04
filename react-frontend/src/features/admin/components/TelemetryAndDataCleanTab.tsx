import React from "react";
import { AnimatePresence } from "framer-motion";
import { useTelemetryAndDataCleanState } from "@/features/admin/hooks/useTelemetryAndDataCleanState";

import TelemetryHeaderBar from "./telemetry/TelemetryHeaderBar";
import TelemetryTrackingSubTab from "./telemetry/TelemetryTrackingSubTab";
import TelemetryAnalyticsSubTab from "./telemetry/TelemetryAnalyticsSubTab";
import DataCleanupSubTab from "./telemetry/DataCleanupSubTab";
import DataCleanupModal from "./telemetry/DataCleanupModal";

const TelemetryAndDataCleanTab: React.FC = () => {
  const state = useTelemetryAndDataCleanState();
  const { activeSubTab } = state;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Animated Telemetry Header & Sub-Tab Navigation */}
      <TelemetryHeaderBar state={state} />

      {/* Animated Active Sub-Tab View Container */}
      <AnimatePresence mode="wait">
        {activeSubTab === "TRACKING" && <TelemetryTrackingSubTab state={state} />}
        {activeSubTab === "ANALYTICS" && <TelemetryAnalyticsSubTab state={state} />}
        {activeSubTab === "CLEANUP" && <DataCleanupSubTab state={state} />}
      </AnimatePresence>

      {/* Database Purge Confirmation Modal */}
      <DataCleanupModal state={state} />
    </div>
  );
};

export default TelemetryAndDataCleanTab;
