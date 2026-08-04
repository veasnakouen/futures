import React from "react";
import { Button } from "@/lib/flowbite-compat";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DesignerProps,
  AggregationRule,
  CustomFieldRule,
} from "../../hooks/useReportDesignerState";

interface ReportDesignerPreviewProps extends DesignerProps {
  source: string;
  previewData: any[];
  viewMode: "table" | "chart";
  groupBy: string;
  aggregations: AggregationRule[];
  customFields: CustomFieldRule[];
  setViewMode: (mode: "table" | "chart") => void;
  setPreviewData: React.Dispatch<React.SetStateAction<any[]>>;
  exportCSV: () => void;
}

export default function ReportDesignerPreview({
  source,
  previewData,
  viewMode,
  groupBy,
  aggregations,
  customFields,
  customTitle,
  customSubtitle,
  customLogoUrl,
  customLogoLocation,
  customLogoShape,
  customFooterText,
  customSignatures,
  customDateLocation,
  setViewMode,
  setPreviewData,
  exportCSV,
}: ReportDesignerPreviewProps) {
  if (previewData.length === 0) return null;

  const isGrandTotal = aggregations.length > 0 && !groupBy;
  const aggKeys = isGrandTotal
    ? aggregations.map((a) => `${a.field}_${a.function}`.toLowerCase())
    : [];
  const rawKeys = Object.keys(previewData[0] || {});

  // Instantly append custom fields so they appear without needing to hit "Preview" again
  customFields.forEach((cf) => {
    if (cf.name && cf.name.trim() !== "" && !rawKeys.includes(cf.name)) {
      rawKeys.push(cf.name);
    }
  });

  const displayColumns = rawKeys.filter((k) => !aggKeys.includes(k.toLowerCase()));

  return (
    <div className="bg-white p-8 rounded-lg shadow overflow-x-auto print:p-0">
      <div className="flex justify-end mb-4 print:hidden gap-2 border-b pb-4">
        <Button size="sm" color="success" onClick={exportCSV}>
          Export CSV
        </Button>
        <Button size="sm" color="dark" onClick={() => window.print()}>
          Print Report
        </Button>
        <div className="w-px bg-gray-300 mx-2"></div>
        <Button
          size="sm"
          color={viewMode === "table" ? "blue" : "light"}
          onClick={() => setViewMode("table")}
        >
          Table View
        </Button>
        <Button
          size="sm"
          color={viewMode === "chart" ? "blue" : "light"}
          onClick={() => setViewMode("chart")}
          disabled={!groupBy}
        >
          Chart View
        </Button>
      </div>

      <div className="text-center mb-6 border-b-2 border-black pb-4 relative min-h-[100px]">
        {customLogoUrl && (
          <div
            className={`absolute top-0 ${
              !customLogoLocation || customLogoLocation === "top-left"
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
          className={`flex flex-col items-center justify-center w-full ${
            customLogoUrl && customLogoLocation === "top-center" ? "pt-20" : "pt-4"
          }`}
        >
          <h1 className="text-2xl font-bold uppercase">
            {customTitle || "Custom Report"}
          </h1>
          <h2 className="text-xl">
            {customSubtitle || `Data Source: ${source}`}
          </h2>
        </div>
        {customDateLocation && (
          <div className="absolute bottom-4 right-0 text-sm font-semibold text-gray-700">
            {customDateLocation}
          </div>
        )}
      </div>

      {viewMode === "table" ? (
        <table className="w-full text-left border-collapse text-xs mt-8">
          <thead>
            <tr className="bg-gray-100 uppercase">
              {displayColumns.map((field) => (
                <th key={field} className="p-2">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {displayColumns.map((field) => (
                  <td
                    key={field}
                    className="p-2 outline-none focus:bg-blue-50 cursor-text"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const val = e.currentTarget.textContent;
                      if (val !== String(row[field] ?? "")) {
                        const newData = [...previewData];
                        newData[i] = { ...newData[i], [field]: val };
                        setPreviewData(newData);
                      }
                    }}
                  >
                    {row[field] === undefined
                      ? ""
                      : row[field] === ""
                        ? ""
                        : (row[field] ?? "N/A")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {isGrandTotal && (
            <tfoot className="bg-gray-200 font-bold border-t-2">
              <tr>
                {(() => {
                  const cells: React.ReactNode[] = [];
                  for (let i = 0; i < displayColumns.length; i++) {
                    const field = displayColumns[i];
                    const aggs = aggregations.filter(
                      (a) => a.field.toLowerCase() === field.toLowerCase()
                    );

                    if (aggs.length > 0) {
                      cells.push(
                        <td key={field} className="p-2">
                          <div className="flex flex-col gap-1">
                            {aggs.map((agg) => {
                              const aggKey = rawKeys.find(
                                (k) =>
                                  k.toLowerCase() ===
                                  `${agg.field}_${agg.function}`.toLowerCase()
                              );
                              let val: any = "";
                              if (aggKey && previewData[0] && aggKey in previewData[0]) {
                                val = previewData[0][aggKey];
                              } else {
                                const numericValues = previewData
                                  .map((r) => Number(r[agg.field]))
                                  .filter((n) => !isNaN(n));
                                if (agg.function === "SUM") {
                                  val = numericValues.reduce((s, n) => s + n, 0);
                                  val = Number.isInteger(val) ? val : val.toFixed(2);
                                } else if (agg.function === "AVG") {
                                  val = numericValues.length
                                    ? numericValues.reduce((s, n) => s + n, 0) /
                                      numericValues.length
                                    : 0;
                                  val = Number.isInteger(val) ? val : val.toFixed(2);
                                } else if (agg.function === "MAX") {
                                  val = numericValues.length
                                    ? Math.max(...numericValues)
                                    : 0;
                                  val = Number.isInteger(val) ? val : val.toFixed(2);
                                } else if (agg.function === "MIN") {
                                  val = numericValues.length
                                    ? Math.min(...numericValues)
                                    : 0;
                                  val = Number.isInteger(val) ? val : val.toFixed(2);
                                } else if (agg.function === "COUNT") {
                                  val = previewData.filter(
                                    (r) =>
                                      r[agg.field] !== null &&
                                      r[agg.field] !== undefined &&
                                      r[agg.field] !== ""
                                  ).length;
                                }
                              }
                              return (
                                <div key={agg.function} className="flex items-center gap-1">
                                  <span className="text-[10px] text-gray-500 font-normal uppercase">
                                    {agg.function}:
                                  </span>
                                  <span>{val}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      );
                    } else {
                      cells.push(<td key={field} className="p-2"></td>);
                    }
                  }
                  return cells;
                })()}
              </tr>
            </tfoot>
          )}
        </table>
      ) : (
        <div className="mt-8 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={previewData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={groupBy} />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {aggregations.map((agg, idx) => (
                <Bar
                  key={idx}
                  dataKey={`${agg.field}_${agg.function.toLowerCase()}`}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {customSignatures && (
        <div className="mt-24 mb-16 flex justify-around items-end text-center font-bold text-sm print:break-inside-avoid">
          {customSignatures.split(",").map((sig, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-48 border-b border-black mb-2"></div>
              <div>{sig.trim()}</div>
            </div>
          ))}
        </div>
      )}

      {customFooterText && (
        <div className="mt-8 text-center text-[10px] text-gray-500 font-sans border-t pt-4 whitespace-pre-wrap print:mt-auto">
          {customFooterText}
        </div>
      )}
    </div>
  );
}
