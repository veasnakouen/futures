import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useEmployeesDataQuery } from "./employees/useEmployeesDataQuery";
import { useEmployeesUserImporter } from "./employees/useEmployeesUserImporter";
import { useEmployeesGlobalData } from "./employees/useEmployeesGlobalData";
import { useEmployeesFormState } from "./employees/useEmployeesFormState";

export function useEmployeesPageState() {
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem("hr_viewMode") : null;
    return (saved as "grid" | "list") || "grid";
  });

  const [activeModule, setActiveModule] = useState<
    | "directory"
    | "attendance"
    | "leaves"
    | "timeoff"
    | "analytics"
    | "payroll"
    | "assets"
    | "stock"
    | "recruitment"
    | "structure"
    | "training"
    | "compliance"
    | "portal"
    | "manager"
    | "scheduling"
    | "retention"
    | "succession"
    | "wellness"
    | "automation"
    | "engagement"
    | "integrations"
    | "support"
    | "reports"
  >(() => {
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem("hr_activeModule") : null;
    return (saved as any) || "directory";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hr_viewMode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hr_activeModule", activeModule);
    }
  }, [activeModule]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const moduleParam = params.get("module");
    if (moduleParam) {
      setActiveModule(moduleParam as any);
    }
  }, []);

  const dataQuery = useEmployeesDataQuery();
  const importer = useEmployeesUserImporter();
  const globalData = useEmployeesGlobalData(dataQuery.employees);
  const formState = useEmployeesFormState({
    createMutation: dataQuery.createMutation,
    updateMutation: dataQuery.updateMutation,
  });

  return {
    t,
    viewMode,
    setViewMode,
    activeModule,
    setActiveModule,
    ...dataQuery,
    ...importer,
    ...globalData,
    ...formState,
  };
}
