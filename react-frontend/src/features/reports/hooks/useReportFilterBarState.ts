import { useState } from "react";

export interface ReportFilterBarProps {
  REPORT_LIST: { key: string; label: string }[];
  selectedReport: string;
  setSelectedReport: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  onGenerate: () => void;
  onExportToggle: () => void;
  isExportOpen: boolean;
  exportMenu: React.ReactNode;
  isCustomizeOpen?: boolean;
  setIsCustomizeOpen?: (val: boolean) => void;
  customTitle?: string;
  setCustomTitle?: (val: string) => void;
  customSubtitle?: string;
  setCustomSubtitle?: (val: string) => void;
  printLayout?: "portrait" | "landscape";
  setPrintLayout?: (val: "portrait" | "landscape") => void;
  customLogoUrl?: string | null;
  setCustomLogoUrl?: (val: string | null) => void;
  customLogoLocation?: "top-left" | "top-center" | "top-right";
  setCustomLogoLocation?: (
    val: "top-left" | "top-center" | "top-right",
  ) => void;
  customLogoShape?: "rectangle" | "rounded" | "circle";
  setCustomLogoShape?: (val: "rectangle" | "rounded" | "circle") => void;
  customFooterText?: string;
  setCustomFooterText?: (val: string) => void;
  customSignatures?: string;
  setCustomSignatures?: (val: string) => void;
  customDateLocation?: string;
  setCustomDateLocation?: (val: string) => void;
  hiddenColumns?: Set<string>;
  setHiddenColumns?: (val: Set<string>) => void;
  allDataKeys?: string[];
}

export function useReportFilterBarState(props: ReportFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleColumn = (col: string) => {
    if (!props.hiddenColumns || !props.setHiddenColumns) return;
    const newSet = new Set(props.hiddenColumns);
    if (newSet.has(col)) {
      newSet.delete(col);
    } else {
      newSet.add(col);
    }
    props.setHiddenColumns(newSet);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && props.setCustomLogoUrl) {
      const reader = new FileReader();
      reader.onloadend = () => {
        props.setCustomLogoUrl!(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    toggleColumn,
    handleLogoUpload,
  };
}
