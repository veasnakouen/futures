import React from "react";
import { useSwitchDatabaseState } from "@/features/admin/hooks/useSwitchDatabaseState";

import ActiveDatabaseCard from "./database/ActiveDatabaseCard";
import DatabaseSwitcherPanel from "./database/DatabaseSwitcherPanel";
import DatabaseBackupPanel from "./database/DatabaseBackupPanel";
import BackupSettingsPanel from "./database/BackupSettingsPanel";

const SwitchDatabase: React.FC = () => {
  const state = useSwitchDatabaseState();

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Active Database Info & Database Router Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Active Database Connection Card */}
        <ActiveDatabaseCard state={state} />

        {/* Database Switcher Panel */}
        <DatabaseSwitcherPanel state={state} />
      </div>

      {/* Database Backup Operations Panel */}
      <DatabaseBackupPanel state={state} />

      {/* Advanced Backup Settings & Cloud Automation Panel */}
      <BackupSettingsPanel state={state} />
    </div>
  );
};

export default SwitchDatabase;
