import { useState, useCallback } from "react";
import { safeStorage } from "@/utils/safeStorage";

export type PrintLayout = "portrait" | "landscape";
export type LogoLocation = "top-left" | "top-center" | "top-right";
export type LogoShape = "rectangle" | "rounded" | "circle";

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export function useReportCustomization() {
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [customTitle, setCustomTitle] = useState("Futures Program");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const [printLayout, setPrintLayoutState] = useState<PrintLayout>(
    () => (safeStorage.getItem("report_print_layout") as PrintLayout) || "portrait"
  );
  const [customLogoUrl, setCustomLogoUrlState] = useState<string | null>(
    () => safeStorage.getItem("report_custom_logo") || null
  );
  const [customLogoLocation, setCustomLogoLocationState] = useState<LogoLocation>(
    () => (safeStorage.getItem("report_custom_logo_loc") as LogoLocation) || "top-left"
  );
  const [customLogoShape, setCustomLogoShapeState] = useState<LogoShape>(
    () => (safeStorage.getItem("report_custom_logo_shape") as LogoShape) || "rectangle"
  );
  const [customFooterText, setCustomFooterTextState] = useState<string>(
    () =>
      safeStorage.getItem("report_custom_footer") ||
      "© MT Program - System Modernization\nThis is a system generated report. No signature required."
  );
  const [customSignatures, setCustomSignaturesState] = useState<string>(
    () =>
      safeStorage.getItem("report_custom_signatures") ||
      "PREPARED BY (ADMIN), VERIFIED BY (HR MANAGER)"
  );
  const [customDateLocation, setCustomDateLocationState] = useState<string>(
    () => safeStorage.getItem("report_custom_date_loc") || ""
  );

  const setPrintLayout = useCallback((val: PrintLayout) => {
    setPrintLayoutState(val);
    safeStorage.setItem("report_print_layout", val);
  }, []);

  const setCustomLogoUrl = useCallback((val: string | null) => {
    setCustomLogoUrlState(val);
    if (val) safeStorage.setItem("report_custom_logo", val);
    else safeStorage.removeItem("report_custom_logo");
  }, []);

  const setCustomLogoLocation = useCallback((val: LogoLocation) => {
    setCustomLogoLocationState(val);
    safeStorage.setItem("report_custom_logo_loc", val);
  }, []);

  const setCustomLogoShape = useCallback((val: LogoShape) => {
    setCustomLogoShapeState(val);
    safeStorage.setItem("report_custom_logo_shape", val);
  }, []);

  const setCustomFooterText = useCallback((val: string) => {
    setCustomFooterTextState(val);
    safeStorage.setItem("report_custom_footer", val);
  }, []);

  const setCustomSignatures = useCallback((val: string) => {
    setCustomSignaturesState(val);
    safeStorage.setItem("report_custom_signatures", val);
  }, []);

  const setCustomDateLocation = useCallback((val: string) => {
    setCustomDateLocationState(val);
    safeStorage.setItem("report_custom_date_loc", val);
  }, []);

  const resetColumnCustomizations = useCallback(() => {
    setHiddenColumns(new Set());
    setSortConfig(null);
  }, []);

  return {
    hiddenColumns,
    setHiddenColumns,
    sortConfig,
    setSortConfig,
    customTitle,
    setCustomTitle,
    customSubtitle,
    setCustomSubtitle,
    printLayout,
    setPrintLayout,
    isCustomizeOpen,
    setIsCustomizeOpen,
    customLogoUrl,
    setCustomLogoUrl,
    customLogoLocation,
    setCustomLogoLocation,
    customLogoShape,
    setCustomLogoShape,
    customFooterText,
    setCustomFooterText,
    customSignatures,
    setCustomSignatures,
    customDateLocation,
    setCustomDateLocation,
    resetColumnCustomizations,
  };
}
