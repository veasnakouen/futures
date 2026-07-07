import { useState, useCallback, useEffect } from "react";
import Layout from "@/components/common/Layout";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { toast } from 'react-hot-toast';

// Modular Components
import ReportFilterBar from "@/features/reports/components/ReportFilterBar";
import ReportPreviewer from "@/features/reports/components/ReportPreviewer";
import ReportExportMenu from "@/features/reports/components/ReportExportMenu";
import ReportDesigner from "@/features/reports/components/designer/ReportDesigner";
import { exportToExcel, exportToPDF } from "../utils/reportExport";

const REPORT_LIST = [
  {
    key: "EmployeeEvaluationReport",
    label: "Employee Evaluation (Salary Increase)",
  },
  { key: "ClientSummaryReport", label: "Client Summary Report" },
  { key: "AttendanceReport", label: "Attendance Summary" },
  { key: "EmployeeSeekerListreport", label: "Employee Seeker List" },
  { key: "PlacementSummaryReport", label: "Placement Summary" },
  { key: "EmployersReport", label: "Employers" },
  { key: "JobVancancyAvailable", label: "Job Vacancies Available" },
  { key: "BeneficiariesReport", label: "Beneficiaries Report" },
  { key: "Businesssetupmonitoiring", label: "Business Monitoring" },
  { key: "BusinessSetUpReport", label: "Business Set Up" },
  { key: "ClientLookforbussinesssSetupReport", label: "Business Setup Search" },
  { key: "ClientReferralFromMTProgramReport", label: "Client Referrals" },
  { key: "ClientsRemainingInPlacementReport", label: "Remaining in Placement" },
  { key: "CurriculumVitaeByClientReport", label: "Curriculum Vitae (CV)" },
  {
    key: "FurtherEuducationseekerListReport",
    label: "Further Education Seekers",
  },
  { key: "JobReadinessReport", label: "Job Readiness" },
  { key: "LogBookReport", label: "Log Book" },
  { key: "PlacementMonitoringAndDropoutReport", label: "Monitoring & Dropout" },
  { key: "SocialSupportCaseReport", label: "Social Support Case" },
  { key: "VtcStudentlReport", label: "VTC Students" },
];

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

  // Customization States
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [customTitle, setCustomTitle] = useState("Futures Program");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [printLayout, setPrintLayout] = useState<"portrait" | "landscape">(
    () =>
      ((typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("report_print_layout") as
        | "portrait"
        | "landscape") || "portrait",
  );
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(
    () => (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("report_custom_logo") || null,
  );
  const [customLogoLocation, setCustomLogoLocation] = useState<
    "top-left" | "top-center" | "top-right"
  >(
    () => ((typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("report_custom_logo_loc") as any) || "top-left",
  );
  const [customLogoShape, setCustomLogoShape] = useState<
    "rectangle" | "rounded" | "circle"
  >(
    () => ((typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("report_custom_logo_shape") as any) || "rectangle",
  );
  const [customFooterText, setCustomFooterText] = useState<string>(
    () =>
      (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("report_custom_footer") ||
      "© MT Program - System Modernization\nThis is a system generated report. No signature required.",
  );
  const [customSignatures, setCustomSignatures] = useState<string>(
    () =>
      (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("report_custom_signatures") ||
      "PREPARED BY (ADMIN), VERIFIED BY (HR MANAGER)",
  );
  const [customDateLocation, setCustomDateLocation] = useState<string>(
    () => (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("report_custom_date_loc") || "",
  );

  // Filters
  const [startDate, setStartDate] = useState(
    new Date().getFullYear() + "-01-01",
  );
  const [endDate, setEndDate] = useState(new Date().getFullYear() + "-12-31");

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
      setHiddenColumns(new Set());
      setSortConfig(null);
      fetchReport(1);
      setCustomSubtitle(
        REPORT_LIST.find((r) => r.key === selectedReport)?.label || "",
      );
    }
  }, [selectedReport, isDesignerMode]);

  const handleDownload = async (format: string) => {
    // Extract unique column headers from ALL rows
    const safeData = Array.isArray(modernData) ? modernData : [];
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
    // Filter by hidden columns
    const headers = Array.from(allKeys).filter((k) => !hiddenColumns.has(k));

    // Apply current sorting
    let sortedData = [...safeData];
    if (sortConfig) {
      sortedData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        return aVal < bVal
          ? sortConfig.direction === "asc"
            ? -1
            : 1
          : sortConfig.direction === "asc"
            ? 1
            : -1;
      });
    }

    if (format === "excel") {
      exportToExcel(
        sortedData,
        headers,
        customTitle,
        customSubtitle,
        customFooterText,
        customSignatures,
        customDateLocation,
      );
    } else if (format === "pdf") {
      await exportToPDF(
        sortedData,
        headers,
        customTitle,
        customSubtitle,
        printLayout,
        customLogoUrl,
        customLogoLocation,
        customLogoShape,
        customFooterText,
        customSignatures,
        customDateLocation,
      );
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title={t("reports")}>
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
          isCustomizeOpen={isCustomizeOpen}
          setIsCustomizeOpen={setIsCustomizeOpen}
          customTitle={customTitle}
          setCustomTitle={setCustomTitle}
          customSubtitle={customSubtitle}
          setCustomSubtitle={setCustomSubtitle}
          printLayout={printLayout}
          setPrintLayout={setPrintLayout}
          customLogoUrl={customLogoUrl}
          setCustomLogoUrl={(val: string | null) => {
            setCustomLogoUrl(val);
            if (val) (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_logo", val);
            else (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).removeItem("report_custom_logo");
          }}
          customLogoLocation={customLogoLocation}
          setCustomLogoLocation={(val) => {
            setCustomLogoLocation(val);
            (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_logo_loc", val);
          }}
          customLogoShape={customLogoShape}
          setCustomLogoShape={(val) => {
            setCustomLogoShape(val);
            (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_logo_shape", val);
          }}
          customFooterText={customFooterText}
          setCustomFooterText={(val: string) => {
            setCustomFooterText(val);
            (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_footer", val);
          }}
          customSignatures={customSignatures}
          setCustomSignatures={(val: string) => {
            setCustomSignatures(val);
            (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_signatures", val);
          }}
          customDateLocation={customDateLocation}
          setCustomDateLocation={(val: string) => {
            setCustomDateLocation(val);
            (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_date_loc", val);
          }}
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
          allDataKeys={
            Array.isArray(modernData)
              ? Array.from(
                  modernData.reduce((acc, row) => {
                    if (row && typeof row === "object") {
                      Object.keys(row).forEach((k) => {
                        if (row[k] !== null && typeof row[k] !== "object")
                          acc.add(k);
                      });
                    }
                    return acc;
                  }, new Set<string>()),
                )
              : []
          }
        />

        {isDesignerMode ? (
          <ReportDesigner
            customLogoUrl={customLogoUrl}
            customLogoLocation={customLogoLocation}
            customLogoShape={customLogoShape}
            customTitle={customTitle}
            customSubtitle={customSubtitle}
            customFooterText={customFooterText}
            customSignatures={customSignatures}
            customDateLocation={customDateLocation}
            setCustomTitle={setCustomTitle}
            setCustomSubtitle={setCustomSubtitle}
            setCustomLogoUrl={(val: string | null) => {
              setCustomLogoUrl(val);
              if (val) (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_logo", val);
              else (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).removeItem("report_custom_logo");
            }}
            setCustomLogoLocation={(val) => {
              setCustomLogoLocation(val);
              (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_logo_loc", val);
            }}
            setCustomLogoShape={(val) => {
              setCustomLogoShape(val);
              (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_logo_shape", val);
            }}
            setCustomFooterText={(val: string) => {
              setCustomFooterText(val);
              (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_footer", val);
            }}
            setCustomSignatures={(val: string) => {
              setCustomSignatures(val);
              (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_signatures", val);
            }}
            setCustomDateLocation={(val: string) => {
              setCustomDateLocation(val);
              (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("report_custom_date_loc", val);
            }}
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
            hiddenColumns={hiddenColumns}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            customTitle={customTitle}
            customSubtitle={customSubtitle}
            printLayout={printLayout}
            customLogoUrl={customLogoUrl}
            customLogoLocation={customLogoLocation}
            customLogoShape={customLogoShape}
            customFooterText={customFooterText}
            customSignatures={customSignatures}
            customDateLocation={customDateLocation}
            onDataEdit={(rowIndex, key, value) => {
              const newData = [...modernData];
              newData[rowIndex] = { ...newData[rowIndex], [key]: value };
              setModernData(newData);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
