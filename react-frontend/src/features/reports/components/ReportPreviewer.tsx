import React, { useState, useEffect } from "react";
import { Card, Badge, Spinner } from '@/lib/flowbite-compat';
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import ClientSummaryReport from "./ClientSummaryReport";
import AttendanceReport from "./AttendanceReport";

interface ReportPreviewerProps {
  selectedReport: string;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  isModern: boolean;
  modernData: any[];
  reportImages: string[];
  onPageChange: (page: number) => void;
  hiddenColumns?: Set<string>;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  setSortConfig?: (
    val: { key: string; direction: "asc" | "desc" } | null,
  ) => void;
  customTitle?: string;
  customSubtitle?: string;
  printLayout?: "portrait" | "landscape";
  customLogoUrl?: string | null;
  customLogoLocation?: "top-left" | "top-center" | "top-right";
  customLogoShape?: "rectangle" | "rounded" | "circle";
  customFooterText?: string;
  customSignatures?: string;
  customDateLocation?: string;
  onDataEdit?: (rowIndex: number, key: string, value: any) => void;
}

const ReportPreviewer: React.FC<ReportPreviewerProps> = ({
  selectedReport,
  totalRecords,
  currentPage,
  totalPages,
  loading,
  error,
  isModern,
  modernData,
  reportImages,
  onPageChange,
  hiddenColumns,
  sortConfig,
  setSortConfig,
  customTitle,
  customSubtitle,
  printLayout,
  customLogoUrl,
  customLogoLocation,
  customLogoShape,
  customFooterText,
  customSignatures,
  customDateLocation,
  onDataEdit,
}) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handlePageSubmit = () => {
    const val = parseInt(pageInput);
    if (!isNaN(val) && val >= 1 && val <= totalPages && val !== currentPage) {
      onPageChange(val);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-[700px]">
      <Card className="flex-1 dark:bg-gray-800 border-none shadow-sm overflow-hidden flex flex-col p-0 rounded-md">
        <div className="p-6 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Badge
              color="info"
              className="rounded-md px-4 py-1.5 font-black uppercase text-[10px] tracking-widest shadow-sm"
            >
              Preview Node
            </Badge>
            <span className="text-xs font-black dark:text-gray-300 text-gray-500 uppercase tracking-widest">
              {selectedReport}
            </span>
            {totalRecords > 0 && (
              <Badge
                color="success"
                className="ml-3 rounded-md font-black text-[9px] uppercase tracking-widest px-3 py-1"
              >
                {totalRecords} Datasets
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                Matrix
              </span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageSubmit}
                onKeyDown={(e) => e.key === "Enter" && handlePageSubmit()}
                disabled={loading}
                className="w-14 h-8 text-center text-xs font-bold rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
              />
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                / {totalPages}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage <= 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-3 rounded-md border dark:border-gray-600 disabled:opacity-20 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft size={20} className="dark:text-white" />
              </button>
              <button
                disabled={currentPage >= totalPages || loading}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-3 rounded-md border dark:border-gray-600 disabled:opacity-20 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
              >
                <ChevronRight size={20} className="dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900/50 p-4 lg:p-6 flex justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Spinner size="xl" />
              <p className="mt-6 font-black text-gray-400 uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Rendering Analytic Stream...
              </p>
            </div>
          ) : error ? (
            <div className="max-w-md text-center py-32 animate-fade-in">
              <AlertCircle
                size={80}
                className="mx-auto text-gray-300 mb-6 opacity-30"
              />
              <h3 className="text-2xl font-black dark:text-white mb-2 uppercase tracking-tight">
                Stream Intersection Failure
              </h3>
              <p className="text-sm font-bold text-gray-500 italic uppercase tracking-wider">
                {error}
              </p>
            </div>
          ) : (
            <div className="space-y-6 shadow-2xl max-w-7xl w-full bg-white rounded-sm animate-slide-in">
              {isModern
                ? (() => {
                    if (selectedReport === "ClientSummaryReport") {
                      return (
                        <ClientSummaryReport
                          data={Array.isArray(modernData) ? modernData : []}
                          totalRecords={totalRecords}
                          currentPage={currentPage}
                          totalPages={totalPages}
                          customTitle={customTitle}
                          customSubtitle={customSubtitle}
                          customLogoUrl={customLogoUrl}
                          customLogoLocation={customLogoLocation}
                          customLogoShape={customLogoShape}
                          customFooterText={customFooterText}
                          customSignatures={customSignatures}
                          customDateLocation={customDateLocation}
                        />
                      );
                    }
                    if (selectedReport === "AttendanceReport") {
                      const safeAttData = Array.isArray(modernData)
                        ? modernData
                        : [];
                      // Apply frontend pagination since backend returns full list
                      const startIndex = (currentPage - 1) * 20;
                      const paginatedAttData = safeAttData.slice(
                        startIndex,
                        startIndex + 20,
                      );
                      return (
                        <AttendanceReport
                          data={paginatedAttData}
                          customTitle={customTitle}
                          customSubtitle={customSubtitle}
                          customLogoUrl={customLogoUrl}
                          customLogoLocation={customLogoLocation}
                          customLogoShape={customLogoShape}
                          customFooterText={customFooterText}
                          customSignatures={customSignatures}
                          customDateLocation={customDateLocation}
                        />
                      );
                    }

                    // Safe generic table logic
                    const safeData = Array.isArray(modernData)
                      ? modernData
                      : [];

                    // Extract unique column headers from ALL rows to prevent missing columns
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

                    // Filter by user's hidden columns
                    const headers = Array.from(allKeys).filter(
                      (k) => !hiddenColumns?.has(k),
                    );

                    // Apply Sorting locally
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

                    const handleSort = (key: string) => {
                      if (!setSortConfig) return;
                      let direction: "asc" | "desc" = "asc";
                      if (
                        sortConfig &&
                        sortConfig.key === key &&
                        sortConfig.direction === "asc"
                      ) {
                        direction = "desc";
                      }
                      setSortConfig({ key, direction });
                    };

                    return (
                      <div className="bg-white p-6 text-black min-h-screen font-serif print:p-0 w-full relative">
                        {/* Dynamic Print CSS Injection */}
                        <style>
                          {`@media print { @page { size: ${printLayout || "landscape"}; margin: 1cm; } }`}
                        </style>

                        {/* Report Header */}
                        <div className="text-center mb-6 border-b-2 border-black pb-4 relative min-h-[100px]">
                          {customLogoUrl && (
                            <div
                              className={`absolute top-0 ${
                                !customLogoLocation ||
                                customLogoLocation === "top-left"
                                  ? "left-0"
                                  : customLogoLocation === "top-right"
                                    ? "right-0"
                                    : "left-1/2 -translate-x-1/2"
                              }`}
                            >
                              <img
                                src={customLogoUrl}
                                alt="Report Logo"
                                className={`h-16 object-contain ${
                                  customLogoShape === "circle"
                                    ? "rounded-full aspect-square object-cover"
                                    : customLogoShape === "rounded"
                                      ? "rounded-2xl"
                                      : ""
                                }`}
                              />
                            </div>
                          )}
                          <div
                            className={`flex flex-col items-center justify-center w-full ${customLogoUrl && customLogoLocation === "top-center" ? "pt-20" : "pt-4"}`}
                          >
                            <h1 className="text-2xl font-bold uppercase">
                              {customTitle || "Futures Program"}
                            </h1>
                            <h2 className="text-xl">
                              {customSubtitle ||
                                selectedReport
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()}
                            </h2>
                          </div>
                          <div className="flex justify-between mt-4 text-[10px] font-sans italic text-gray-600">
                            <div className="flex flex-col items-start">
                              <span>
                                Printed on:{" "}
                                {format(new Date(), "dd/MM/yyyy HH:mm")}
                              </span>
                              <span>
                                Page {currentPage} of {totalPages}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-bold">
                                TOTAL RECORDS: {totalRecords}
                              </span>
                              <span>Page Size: {modernData?.length || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Report Table */}
                        <div className="overflow-x-auto">
                          {sortedData.length > 0 && headers.length > 0 ? (
                            <table className="w-full text-left border-collapse border border-gray-300 text-xs">
                              <thead>
                                <tr className="bg-gray-100 uppercase">
                                  {headers.map((key) => (
                                    <th
                                      key={key}
                                      onClick={() => handleSort(key)}
                                      className="border border-gray-300 p-2 whitespace-nowrap cursor-pointer hover:bg-gray-200 select-none group"
                                    >
                                      <div className="flex items-center gap-2">
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                        <span
                                          className={`text-[10px] ${sortConfig?.key === key ? "text-indigo-600" : "text-transparent group-hover:text-gray-400"}`}
                                        >
                                          {sortConfig?.key === key &&
                                          sortConfig.direction === "desc"
                                            ? "▼"
                                            : "▲"}
                                        </span>
                                      </div>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sortedData.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    {headers.map((key) => {
                                        let val = row[key];
                                        let displayVal = "N/A";
                                        if (val !== null && val !== undefined) {
                                          displayVal =
                                            String(val) === "true"
                                              ? "Yes"
                                              : String(val) === "false"
                                                ? "No"
                                                : String(val);
                                        }
                                        if (val === "") displayVal = "";
                                        
                                        return (
                                          <td
                                            key={key}
                                            className="border border-gray-300 p-2 whitespace-nowrap outline-none focus:bg-blue-50 cursor-text"
                                            contentEditable={true}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => {
                                              const newVal = e.currentTarget.textContent;
                                              if (newVal !== String(val ?? "")) {
                                                onDataEdit?.(idx, key, newVal);
                                              }
                                            }}
                                          >
                                            {displayVal}
                                          </td>
                                        );
                                      })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="py-20 text-center font-bold text-gray-400">
                              NO DATA FOUND FOR THIS REPORT
                            </div>
                          )}
                        </div>

                        {/* Date & Location */}
                        {customDateLocation && (
                          <div className="mt-12 mb-4 px-12 text-right text-sm print:break-inside-avoid">
                            {customDateLocation}
                          </div>
                        )}

                        {/* Signatures */}
                        {customSignatures && (
                          <div className="mt-8 mb-8 flex justify-between items-end px-12 print:break-inside-avoid">
                            {customSignatures.split(",").map((sig, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col items-center"
                              >
                                <div className="w-48 border-b border-black mb-2"></div>
                                <span className="text-xs font-bold uppercase">
                                  {sig.trim()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-8 text-center text-[10px] text-gray-500 font-sans border-t pt-4 whitespace-pre-wrap">
                          {customFooterText ? (
                            customFooterText
                          ) : (
                            <>
                              <p>
                                © {new Date().getFullYear()} MT Program - System
                                Modernization
                              </p>
                              <p className="mt-1">
                                This is a system generated report. No signature
                                required.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()
                : reportImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={`data:image/png;base64,${img}`}
                      alt={`Node Matrix Page ${idx + 1}`}
                      className="w-full h-auto bg-white border-b last:border-b-0 shadow-lg dark:border-gray-700"
                    />
                  ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportPreviewer;
