import React from "react";
import {
  useReportDesignerState,
  DesignerProps,
} from "../../hooks/useReportDesignerState";
import ReportDesignerConfigForm from "./ReportDesignerConfigForm";
import ReportDesignerPreview from "./ReportDesignerPreview";

export default function ReportDesigner(props: DesignerProps) {
  const state = useReportDesignerState(props);

  return (
    <div className="flex flex-col gap-6 -z-10">
      <ReportDesignerConfigForm {...props} {...state} />
      <ReportDesignerPreview {...props} {...state} />
    </div>
  );
}
