import { useState, useCallback, useEffect } from "react";

import api from "../services/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

// Modular Components & Hooks
import ReportFilterBar from "@/features/reports/components/ReportFilterBar";
import ReportPreviewer from "@/features/reports/components/ReportPreviewer";
import ReportExportMenu from "@/features/reports/components/ReportExportMenu";
import ReportDesigner from "@/features/reports/components/designer/ReportDesigner";
import { REPORT_LIST } from "@/features/reports/constants/reportList";
import { useReportCustomization } from "@/features/reports/hooks/useReportCustomization";
import { exportToExcel, exportToPDF } from "../utils/reportExport";

const ReportsPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState(REPORT_LIST[0].key);
  const [isDesignerMode, setIsDesignerMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportImages, setReportImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [modernData, setModernData] = useState<any[]>([]);
  const [isModern, setIsModern] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState(
    new Date().getFullYear() + "-01-01",
  );
  const [endDate, setEndDate] = useState(new Date().getFullYear() + "-12-31");

  // Customization Hook
  const cust = useReportCustomization();

  const fetchReport = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);
      setModernData([]);
      setReportImages([]);

      setIsModern(true);

      try {
        let endpoint = "/reports/legacy-data";
        if (selectedReport === "ClientSummaryReport")
          endpoint = "/reports/client-summary";
        if (selectedReport === "AttendanceReport") endpoint = "/hr/attendance";
        if (selectedReport === "EmployeeEvaluationReport")
          endpoint = "/report-builder/employee-evaluation";

        const response = await api.get(endpoint, {
          params: {
            reportName: selectedReport,
            page: page - 1,
            size: 20,
            startdate: startDate,
            enddate: endDate,
          },
        });

        setModernData(response.data.content || response.data);
        setTotalRecords(
          response.data.totalElements || response.data.length || 0,
        );
        setTotalPages(
          response.data.totalPages ||
          Math.ceil((response.data.length || 0) / 20),
        );
        setCurrentPage((response.data.currentPage || 0) + 1);
      } catch (err: any) {
        toast.error(`Error fetching report: ${err.message || "Unknown error"}`);
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    },
    [selectedReport, startDate, endDate],
  );

  const handleReportChange = (reportKey: string) => {
    if (reportKey === "custom_designer") {
      setIsDesignerMode(true);
      setSelectedReport("custom_designer");
    } else {
      setIsDesignerMode(false);
      setSelectedReport(reportKey);
    }
  };

  useEffect(() => {
    if (!isDesignerMode) {
      cust.resetColumnCustomizations();
      fetchReport(1);
      cust.setCustomSubtitle(
        REPORT_LIST.find((r) => r.key === selectedReport)?.label || "",
      );
    }
  }, [selectedReport, isDesignerMode]);

  const handleDownload = async (format: string) => {
    try {
      const safeData = Array.isArray(modernData) ? modernData : [];
      if (safeData.length === 0) {
        toast.error("No report data available to export. Please click Generate first.");
        return;
      }

      const allKeys = new Set<string>();
      safeData.forEach((row) => {
        if (row && typeof row === "object") {
          Object.keys(row).forEach((k) => {
            if (row[k] !== null && typeof row[k] !== "object") {
              allKeys.add(k);
            }
          });
        }
      });

      const hidden = cust.hiddenColumns || new Set();
      const headers = Array.from(allKeys).filter((k) => !hidden.has(k));

      if (headers.length === 0) {
        toast.error("No visible columns available to export.");
        return;
      }

      let sortedData = [...safeData];
      if (cust.sortConfig) {
        const { key, direction } = cust.sortConfig;
        sortedData.sort((a, b) => {
          const aVal = a[key];
          const bVal = b[key];
          if (aVal === bVal) return 0;
          if (aVal === null || aVal === undefined) return 1;
          if (bVal === null || bVal === undefined) return -1;
          return aVal < bVal
            ? direction === "asc"
              ? -1
              : 1
            : direction === "asc"
              ? 1
              : -1;
        });
      }

      if (format === "excel") {
        exportToExcel(
          sortedData,
          headers,
          cust.customTitle,
          cust.customSubtitle,
          cust.customFooterText,
          cust.customSignatures,
          cust.customDateLocation,
        );
        toast.success("Excel document generated!");
      } else if (format === "pdf") {
        await exportToPDF(
          sortedData,
          headers,
          cust.customTitle,
          cust.customSubtitle,
          cust.printLayout,
          cust.customLogoUrl,
          cust.customLogoLocation,
          cust.customLogoShape,
          cust.customFooterText,
          cust.customSignatures,
          cust.customDateLocation,
        );
        toast.success("PDF document generated!");
      }
    } catch (err: any) {
      console.error("Export failed:", err);
      toast.error(`Export failed: ${err.message || "Unknown error"}`);
    }
  };

  const allDataKeys: string[] = Array.isArray(modernData)
    ? Array.from(
      modernData.reduce((acc: Set<string>, row: any) => {
        if (row && typeof row === "object") {
          Object.keys(row).forEach((k) => {
            if (row[k] !== null && typeof row[k] !== "object") acc.add(k);
          });
        }
        return acc;
      }, new Set<string>()),
    )
    : [];

  return (
    <div className="space-y-2 -mt-2 lg:-mt-4 animate-fade-in h-full flex flex-col max-w-[1600px] mx-auto pb-4">
      <ReportFilterBar
        REPORT_LIST={REPORT_LIST}
        selectedReport={isDesignerMode ? "custom_designer" : selectedReport}
        setSelectedReport={handleReportChange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onGenerate={() => fetchReport(1)}
        onExportToggle={() => setExportOpen(!exportOpen)}
        isExportOpen={exportOpen}
        exportMenu={
          <ReportExportMenu
            onClose={() => setExportOpen(false)}
            onDownload={handleDownload}
          />
        }
        isCustomizeOpen={cust.isCustomizeOpen}
        setIsCustomizeOpen={cust.setIsCustomizeOpen}
        customTitle={cust.customTitle}
        setCustomTitle={cust.setCustomTitle}
        customSubtitle={cust.customSubtitle}
        setCustomSubtitle={cust.setCustomSubtitle}
        printLayout={cust.printLayout}
        setPrintLayout={cust.setPrintLayout}
        customLogoUrl={cust.customLogoUrl}
        setCustomLogoUrl={cust.setCustomLogoUrl}
        customLogoLocation={cust.customLogoLocation}
        setCustomLogoLocation={cust.setCustomLogoLocation}
        customLogoShape={cust.customLogoShape}
        setCustomLogoShape={cust.setCustomLogoShape}
        customFooterText={cust.customFooterText}
        setCustomFooterText={cust.setCustomFooterText}
        customSignatures={cust.customSignatures}
        setCustomSignatures={cust.setCustomSignatures}
        customDateLocation={cust.customDateLocation}
        setCustomDateLocation={cust.setCustomDateLocation}
        hiddenColumns={cust.hiddenColumns}
        setHiddenColumns={cust.setHiddenColumns}
        allDataKeys={allDataKeys}
      />

      {isDesignerMode ? (
        <ReportDesigner
          customLogoUrl={cust.customLogoUrl}
          customLogoLocation={cust.customLogoLocation}
          customLogoShape={cust.customLogoShape}
          customTitle={cust.customTitle}
          customSubtitle={cust.customSubtitle}
          customFooterText={cust.customFooterText}
          customSignatures={cust.customSignatures}
          customDateLocation={cust.customDateLocation}
          setCustomTitle={cust.setCustomTitle}
          setCustomSubtitle={cust.setCustomSubtitle}
          setCustomLogoUrl={cust.setCustomLogoUrl}
          setCustomLogoLocation={cust.setCustomLogoLocation}
          setCustomLogoShape={cust.setCustomLogoShape}
          setCustomFooterText={cust.setCustomFooterText}
          setCustomSignatures={cust.setCustomSignatures}
          setCustomDateLocation={cust.setCustomDateLocation}
        />
      ) : (
        <ReportPreviewer
          selectedReport={selectedReport}
          totalRecords={totalRecords}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          error={error}
          isModern={isModern}
          modernData={modernData}
          reportImages={reportImages}
          onPageChange={fetchReport}
          hiddenColumns={cust.hiddenColumns}
          sortConfig={cust.sortConfig}
          setSortConfig={cust.setSortConfig}
          customTitle={cust.customTitle}
          customSubtitle={cust.customSubtitle}
          printLayout={cust.printLayout}
          customLogoUrl={cust.customLogoUrl}
          customLogoLocation={cust.customLogoLocation}
          customLogoShape={cust.customLogoShape}
          customFooterText={cust.customFooterText}
          customSignatures={cust.customSignatures}
          customDateLocation={cust.customDateLocation}
          onDataEdit={(rowIndex, key, value) => {
            const newData = [...modernData];
            newData[rowIndex] = { ...newData[rowIndex], [key]: value };
            setModernData(newData);
          }}
        />
      )}
    </div>
  );
};

export default ReportsPage;
