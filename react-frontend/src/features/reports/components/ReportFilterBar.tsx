import React from "react";
import { useReportFilterBarState, type ReportFilterBarProps } from "@/features/reports/hooks/useReportFilterBarState";

import ReportSelectorPopover from "./filter/ReportSelectorPopover";
import ReportDateRangePicker from "./filter/ReportDateRangePicker";
import ReportFilterActionButtons from "./filter/ReportFilterActionButtons";
import ReportCustomizeDrawer from "./filter/ReportCustomizeDrawer";

const ReportFilterBar: React.FC<ReportFilterBarProps> = (props) => {
  const state = useReportFilterBarState(props);

  return (
    <>
      {/* Primary Analytics & Filter Control Bar */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md p-4 rounded-2xl border-none">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
          {/* Target Analytic Node Dropdown Popover */}
          <ReportSelectorPopover props={props} state={state} />

          {/* Start & End Date Pickers */}
          <ReportDateRangePicker props={props} />

          {/* Action Triggers: Customize, Generate, Extract */}
          <ReportFilterActionButtons props={props} />
        </div>
      </div>

      {/* Slide-out Report Customization Side Drawer Portal */}
      <ReportCustomizeDrawer props={props} state={state} />
    </>
  );
};

export default ReportFilterBar;
