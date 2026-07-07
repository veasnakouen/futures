import React, { useState, useEffect } from "react";
import {Button, Select, Label, TextInput} from "@/lib/flowbite-compat";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../../../../services/api";
import DataSourceManagerModal from "./DataSourceManagerModal";

interface DesignerProps {
  customLogoUrl?: string | null;
  customLogoLocation?: "top-left" | "top-center" | "top-right";
  customLogoShape?: "rectangle" | "rounded" | "circle";
  customTitle?: string;
  customSubtitle?: string;
  customFooterText?: string;
  customSignatures?: string;
  customDateLocation?: string;
  setCustomTitle?: (val: string) => void;
  setCustomSubtitle?: (val: string) => void;
  setCustomLogoUrl?: (val: string | null) => void;
  setCustomLogoLocation?: (val: any) => void;
  setCustomLogoShape?: (val: any) => void;
  setCustomFooterText?: (val: string) => void;
  setCustomSignatures?: (val: string) => void;
  setCustomDateLocation?: (val: string) => void;
}

export default function ReportDesigner({
  customLogoUrl,
  customLogoLocation,
  customLogoShape,
  customTitle,
  customSubtitle,
  customFooterText,
  customSignatures,
  customDateLocation,
  setCustomTitle,
  setCustomSubtitle,
  setCustomLogoUrl,
  setCustomLogoLocation,
  setCustomLogoShape,
  setCustomFooterText,
  setCustomSignatures,
  setCustomDateLocation,
}: DesignerProps) {
  const [metadata, setMetadata] = useState<Record<string, string[]>>({});
  const [source, setSource] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<Array<{ field: string; operator: string; value: string }>>([]);
  const [groupBy, setGroupBy] = useState<string>("");
  const [aggregations, setAggregations] = useState<Array<{ field: string; function: string }>>([]);
  const [customFields, setCustomFields] = useState<Array<{ name: string; type: string; formula: string }>>([]);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [loadedReportId, setLoadedReportId] = useState<string>("");
  const [showDataSourceModal, setShowDataSourceModal] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchSavedReports();
  }, []);

  const fetchMetadata = async () => {
    try {
      const res = await api.get(`/custom-reports/metadata?_t=${Date.now()}`);
      setMetadata(res.data);
    } catch (err) {
      setError("Failed to load data sources.");
    }
  };

  const fetchSavedReports = async () => {
    try {
      const res = await api.get(`/report-builder/settings/custom-reports?_t=${Date.now()}`);
      setSavedReports(res.data || []);
    } catch (err) {
      console.error("Failed to fetch saved reports", err);
    }
  };

  const handleLoadReport = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rId = e.target.value;
    setLoadedReportId(rId);
    if (!rId) {
      setSource("");
      setFields([]);
      setFilters([]);
      setGroupBy("");
      setAggregations([]);
      setCustomFields([]);
      setPreviewData([]);
      return;
    }

    const report = savedReports.find(r => r.reportName === rId);
    if (report && report.preferences) {
      try {
        const prefs = JSON.parse(report.preferences);
        setSource(prefs.source || "");
        setFields(prefs.fields || []);
        setFilters(prefs.filters || []);
        setGroupBy(prefs.groupBy || "");
        setAggregations(prefs.aggregations || []);
        setCustomFields(prefs.customFields || []);

        if (setCustomTitle && prefs.customTitle) setCustomTitle(prefs.customTitle);
        if (setCustomLogoUrl && prefs.customLogoUrl !== undefined) setCustomLogoUrl(prefs.customLogoUrl);
        if (setCustomLogoLocation && prefs.customLogoLocation) setCustomLogoLocation(prefs.customLogoLocation);
        if (setCustomLogoShape && prefs.customLogoShape) setCustomLogoShape(prefs.customLogoShape);
        if (setCustomFooterText && prefs.customFooterText) setCustomFooterText(prefs.customFooterText);
        if (setCustomSignatures && prefs.customSignatures) setCustomSignatures(prefs.customSignatures);
        if (setCustomDateLocation && prefs.customDateLocation) setCustomDateLocation(prefs.customDateLocation);
      } catch (e) {
        console.error("Failed to parse saved report", e);
      }
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSource(e.target.value);
    setFields([]);
    setFilters([]);
    setGroupBy("");
    setAggregations([]);
    setCustomFields([]);
    setPreviewData([]);
  };

  const handleFieldToggle = (field: string) => {
    setFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const addFilter = () => {
    if (metadata[source] && metadata[source].length > 0) {
      setFilters([...filters, { field: metadata[source][0], operator: "=", value: "" }]);
    }
  };

  const updateFilter = (index: number, key: string, value: string) => {
    const newFilters = [...filters];
    (newFilters[index] as any)[key] = value;
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const addAggregation = () => {
    if (metadata[source] && metadata[source].length > 0) {
      setAggregations([...aggregations, { field: metadata[source][0], function: "SUM" }]);
    }
  };

  const updateAggregation = (index: number, key: string, value: string) => {
    const newAggs = [...aggregations];
    (newAggs[index] as any)[key] = value;
    setAggregations(newAggs);
  };

  const removeAggregation = (index: number) => {
    setAggregations(aggregations.filter((_, i) => i !== index));
  };

  const generatePreview = async () => {
    if (!source || fields.length === 0) {
      setError("Please select a data source and at least one field.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/custom-reports/preview", {
        source,
        fields,
        filters,
        groupBy,
        aggregations: aggregations.filter(agg => !customFields.some(cf => cf.name.toLowerCase() === agg.field.toLowerCase())),
        customFields,
        page: 0,
        size: 50,
      });
      setPreviewData(res.data.content || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate preview.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!saveName || !source || fields.length === 0) {
      setError("Please provide a report name, select a source, and fields.");
      return;
    }

    setIsSaving(true);
    const reportId = `custom_report_${Date.now()}`;
    const payload = {
      preferences: JSON.stringify({
        source,
        fields,
        filters,
        groupBy,
        aggregations,
        customFields,
        customTitle: saveName,
        customLogoUrl,
        customLogoLocation,
        customLogoShape,
        customFooterText,
        customSignatures,
        customDateLocation
      })
    };

    try {
      await api.post(`/report-builder/settings/${reportId}`, payload);
      alert("Report saved successfully!");
      setSaveName("");
      fetchSavedReports();
    } catch (err) {
      setError("Failed to save report.");
    } finally {
      setIsSaving(false);
    }
  };

  const exportCSV = () => {
    if (previewData.length === 0) return;
    const isGrandTotal = aggregations.length > 0 && !groupBy;
    const aggKeys = isGrandTotal ? aggregations.map(a => `${a.field}_${a.function}`.toLowerCase()) : [];
    const rawKeys = Object.keys(previewData[0] || {});
    customFields.forEach(cf => {
      if (cf.name && cf.name.trim() !== "" && !rawKeys.includes(cf.name)) {
        rawKeys.push(cf.name);
      }
    });
    const displayColumns = rawKeys.filter(k => !aggKeys.includes(k.toLowerCase()));

    const header = displayColumns.join(",");
    const rows = previewData.map(row => {
      return displayColumns.map(col => {
        let val = row[col];
        if (val === undefined) val = "";
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(",");
    });

    if (isGrandTotal) {
      const footerRow = displayColumns.map((col, idx) => {
        const aggs = aggregations.filter(a => a.field.toLowerCase() === col.toLowerCase());
        if (aggs.length > 0) {
          const vals = aggs.map(agg => {
            const aggKey = rawKeys.find(k => k.toLowerCase() === `${agg.field}_${agg.function}`.toLowerCase());
            let val: any = "";
            if (aggKey && previewData[0] && (aggKey in previewData[0])) {
              val = previewData[0][aggKey];
            } else {
              const numericValues = previewData.map(r => Number(r[agg.field])).filter(n => !isNaN(n));
              if (agg.function === "SUM") val = numericValues.reduce((s, n) => s + n, 0);
              else if (agg.function === "AVG") val = numericValues.length ? (numericValues.reduce((s, n) => s + n, 0) / numericValues.length) : 0;
              else if (agg.function === "MAX") val = numericValues.length ? Math.max(...numericValues) : 0;
              else if (agg.function === "MIN") val = numericValues.length ? Math.min(...numericValues) : 0;
              else if (agg.function === "COUNT") val = previewData.filter(r => r[agg.field] !== null && r[agg.field] !== undefined && r[agg.field] !== "").length;
              if (typeof val === 'number') val = Number.isInteger(val) ? val : val.toFixed(2);
            }
            return `${agg.function}: ${val}`;
          });
          return `"${vals.join(" | ")}"`;
        }
        return idx === 0 ? '"Grand Total"' : `""`;
      }).join(",");
      rows.push(footerRow);
    }

    const blob = new Blob([[header, ...rows].join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${customTitle || source || "report"}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Report Designer</h2>

        {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>}

        {/* Load Saved Report */}
        {savedReports.length > 0 && (
          <div className="mb-6 bg-blue-50 p-4 rounded border-blue-100">
            <Label className="mb-2 block font-bold text-blue-800">📂 Load Saved Report</Label>
            <Select value={loadedReportId} onChange={handleLoadReport}>
              <option value="">-- Start from Scratch --</option>
              {savedReports.map(r => (
                <option key={r.reportName} value={r.reportName}>
                  {(() => {
                    try {
                      return JSON.parse(r.preferences).customTitle || r.reportName;
                    } catch (e) {
                      return r.reportName;
                    }
                  })()}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* 1. Select Data Source */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-bold text-gray-700">1. Select Data Source</Label>
            <Button size="xs" color="light" onClick={() => setShowDataSourceModal(true)}>
              + Manage External Sources
            </Button>
          </div>
          <Select value={source} onChange={handleSourceChange}>
            <option value="">-- Select Source --</option>
            {Object.keys(metadata).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Select>
        </div>

        {/* 2. Fields Selection */}
        {source && (
          <div className="mb-6">
            <Label className="mb-2 block font-bold text-gray-700">2. Select Fields</Label>
            <div className="flex flex-wrap gap-3">
              {metadata[source].map((field) => (
                <label key={field} className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-2 rounded hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={fields.includes(field)}
                    onChange={() => handleFieldToggle(field)}
                  />
                  <span className="text-sm font-medium text-gray-700">{field}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 3. Filters */}
        {source && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Label className="font-bold text-gray-700">3. Filters</Label>
              <Button size="xs" color="light" onClick={addFilter}>+ Add Filter</Button>
            </div>
            {filters.map((filter, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <Select sizing="sm" value={filter.field} onChange={(e) => updateFilter(idx, "field", e.target.value)}>
                  {metadata[source].map((f) => <option key={f} value={f}>{f}</option>)}
                </Select>
                <Select sizing="sm" value={filter.operator} onChange={(e) => updateFilter(idx, "operator", e.target.value)}>
                  <option value="=">=</option>
                  <option value="!=">!=</option>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="LIKE">Contains (LIKE)</option>
                </Select>
                <TextInput sizing="sm" placeholder="Value" value={filter.value} onChange={(e) => updateFilter(idx, "value", e.target.value)} />
                <Button size="xs" color="failure" onClick={() => removeFilter(idx)}>X</Button>
              </div>
            ))}
            {filters.length === 0 && <p className="text-xs text-gray-500 italic">No filters applied.</p>}
          </div>
        )}

        {/* 4. Grouping & Aggregations */}
        {source && (
          <div className="mb-6">
            <Label className="mb-2 block font-bold text-gray-700">4. Grouping & Aggregations (Optional)</Label>
            <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded">
              <div>
                <Label className="block mb-1 text-sm font-semibold">Group By Field</Label>
                <Select sizing="sm" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                  <option value="">-- No Grouping --</option>
                  {metadata[source].map((f) => <option key={f} value={f}>{f}</option>)}
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="block mb-1 text-sm font-semibold">Aggregations</Label>
                  <Button size="xs" color="light" onClick={addAggregation}>+ Add Aggregation</Button>
                </div>
                {aggregations.map((agg, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <Select sizing="sm" value={agg.function} onChange={(e) => updateAggregation(idx, "function", e.target.value)}>
                      <option value="SUM">SUM</option>
                      <option value="COUNT">COUNT</option>
                      <option value="AVG">AVERAGE</option>
                      <option value="MIN">MIN</option>
                      <option value="MAX">MAX</option>
                    </Select>
                    <Select sizing="sm" value={agg.field} onChange={(e) => updateAggregation(idx, "field", e.target.value)}>
                      {metadata[source].map((f) => <option key={f} value={f}>{f}</option>)}
                      {customFields.map(cf => cf.name).filter(Boolean).map(f => <option key={f} value={f}>{f} (Custom)</option>)}
                    </Select>
                    <Button size="xs" color="failure" onClick={() => removeAggregation(idx)}>X</Button>
                  </div>
                ))}
                {aggregations.length === 0 && <p className="text-xs text-gray-500 italic">No aggregations applied.</p>}
              </div>
            </div>
          </div>
        )}

        {/* 4.5. Custom Fields */}
        {source && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Label className="font-bold text-gray-700">Custom Fields (Optional)</Label>
              <Button size="xs" color="light" onClick={() => setCustomFields([...customFields, { name: "", type: "blank", formula: "" }])}>
                + Add Custom Field
              </Button>
            </div>
            {customFields.map((cf, idx) => (
              <div key={idx} className="flex flex-wrap gap-2 mb-2 items-center bg-gray-50 p-2 rounded">
                <TextInput
                  sizing="sm"
                  placeholder="Field Name"
                  value={cf.name}
                  onChange={(e) => { const newCf = [...customFields]; newCf[idx].name = e.target.value; setCustomFields(newCf); }}
                />
                <Select
                  sizing="sm"
                  value={cf.type}
                  onChange={(e) => { const newCf = [...customFields]; newCf[idx].type = e.target.value; setCustomFields(newCf); }}
                >
                  <option value="blank">Blank Input Field</option>
                  <option value="calculated">Calculated Formula</option>
                </Select>
                {cf.type === "calculated" && (
                  <TextInput
                    sizing="sm"
                    placeholder="e.g. basicSalary * 0.1"
                    value={cf.formula}
                    onChange={(e) => { const newCf = [...customFields]; newCf[idx].formula = e.target.value; setCustomFields(newCf); }}
                    className="flex-1 min-w-[200px]"
                  />
                )}
                <Button size="xs" color="failure" onClick={() => setCustomFields(customFields.filter((_, i) => i !== idx))}>X</Button>
              </div>
            ))}
            {customFields.length === 0 && <p className="text-xs text-gray-500 italic">No custom fields applied.</p>}
          </div>
        )}

        {/* 5. Report Aesthetics & Branding */}
        {source && (
          <div className="mb-6">
            <Label className="mb-2 block font-bold text-gray-700">5. Report Aesthetics & Branding</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <Label className="block mb-1 text-sm font-semibold">Report Title</Label>
                <TextInput value={customTitle || ""} onChange={(e) => setCustomTitle && setCustomTitle(e.target.value)} placeholder="e.g. Employee Summary" />
              </div>
              <div>
                <Label className="block mb-1 text-sm font-semibold">Report Subtitle</Label>
                <TextInput value={customSubtitle || ""} onChange={(e) => setCustomSubtitle && setCustomSubtitle(e.target.value)} placeholder="e.g. Q3 2026" />
              </div>
              <div>
                <Label className="block mb-1 text-sm font-semibold">Logo URL</Label>
                <TextInput value={customLogoUrl || ""} onChange={(e) => setCustomLogoUrl && setCustomLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
              </div>
              <div>
                <Label className="block mb-1 text-sm font-semibold">Logo Shape</Label>
                <Select value={customLogoShape || "rectangle"} onChange={(e) => setCustomLogoShape && setCustomLogoShape(e.target.value as any)}>
                  <option value="rectangle">Rectangle</option>
                  <option value="rounded">Rounded Corners</option>
                  <option value="circle">Circle</option>
                </Select>
              </div>
              <div>
                <Label className="block mb-1 text-sm font-semibold">Logo Location</Label>
                <Select value={customLogoLocation || "top-left"} onChange={(e) => setCustomLogoLocation && setCustomLogoLocation(e.target.value as any)}>
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                </Select>
              </div>
              <div>
                <Label className="block mb-1 text-sm font-semibold">Date Format / Location</Label>
                <TextInput value={customDateLocation || ""} onChange={(e) => setCustomDateLocation && setCustomDateLocation(e.target.value)} placeholder="e.g. Date: DD/MM/YYYY" />
              </div>
              <div className="md:col-span-2">
                <Label className="block mb-1 text-sm font-semibold">Footer Text</Label>
                <TextInput value={customFooterText || ""} onChange={(e) => setCustomFooterText && setCustomFooterText(e.target.value)} placeholder="e.g. System Generated Report" />
              </div>
              <div className="md:col-span-2">
                <Label className="block mb-1 text-sm font-semibold">Signatures block</Label>
                <TextInput value={customSignatures || ""} onChange={(e) => setCustomSignatures && setCustomSignatures(e.target.value)} placeholder="e.g. PREPARED BY, VERIFIED BY" />
              </div>
            </div>
          </div>
        )}

        <DataSourceManagerModal
          show={showDataSourceModal}
          onClose={() => setShowDataSourceModal(false)}
          onSourceAdded={() => {
            fetchMetadata(); // refresh sources
          }}
        />

        <div className="mt-6 border-t pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <TextInput
              placeholder="Name for this report..."
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
            />
            <Button color="success" onClick={handleSaveReport} disabled={isSaving || !source || fields.length === 0}>
              {isSaving ? "Saving..." : "Save Report"}
            </Button>
          </div>
          <Button color="blue" onClick={generatePreview} disabled={loading || !source || fields.length === 0} className="w-full md:w-auto">
            {loading ? "Generating..." : "Preview Report"}
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      {previewData.length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow overflow-x-auto print:p-0">
          <div className="flex justify-end mb-4 print:hidden gap-2 border-b pb-4">
            <Button size="sm" color="success" onClick={exportCSV}>Export CSV</Button>
            <Button size="sm" color="dark" onClick={() => window.print()}>Print Report</Button>
            <div className="w-px bg-gray-300 mx-2"></div>
            <Button size="sm" color={viewMode === "table" ? "blue" : "light"} onClick={() => setViewMode("table")}>Table View</Button>
            <Button size="sm" color={viewMode === "chart" ? "blue" : "light"} onClick={() => setViewMode("chart")} disabled={!groupBy}>Chart View</Button>
          </div>

          <div className="text-center mb-6 border-b-2 border-black pb-4 relative min-h-[100px]">
            {customLogoUrl && (
              <div
                className={`absolute top-0 ${!customLogoLocation || customLogoLocation ==="top-left"?"left-0": customLogoLocation ==="top-right"?"right-0":"left-1/2 -translate-x-1/2"}`}
              >
                <img
                  src={customLogoUrl}
                  alt="Report Logo"
                  className={`h-16 object-contain ${customLogoShape ==="circle"?"rounded-full aspect-square object-cover": customLogoShape ==="rounded"?"rounded-2xl":"" }`}
                />
              </div>
            )}
            <div
              className={`flex flex-col items-center justify-center w-full ${customLogoUrl && customLogoLocation ==="top-center"?"pt-20":"pt-4"}`}
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
              {(() => {
                const isGrandTotal = aggregations.length > 0 && !groupBy;
                const aggKeys = isGrandTotal ? aggregations.map(a => `${a.field}_${a.function}`.toLowerCase()) : [];
                const rawKeys = Object.keys(previewData[0] || {});

                // Instantly append custom fields so they appear without needing to hit "Preview" again
                customFields.forEach(cf => {
                  if (cf.name && cf.name.trim() !== "" && !rawKeys.includes(cf.name)) {
                    rawKeys.push(cf.name);
                  }
                });

                const displayColumns = rawKeys.filter(k => !aggKeys.includes(k.toLowerCase()));

                return (
                  <>
                    <thead>
                      <tr className="bg-gray-100 uppercase">
                        {displayColumns.map((field) => (
                          <th key={field} className="p-2">{field}</th>
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
                              {row[field] === undefined ? "" : (row[field] === "" ? "" : (row[field] ?? "N/A"))}
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
                              const aggs = aggregations.filter(a => a.field.toLowerCase() === field.toLowerCase());

                              if (aggs.length > 0) {
                                cells.push(
                                  <td key={field} className="p-2">
                                    <div className="flex flex-col gap-1">
                                      {aggs.map(agg => {
                                        const aggKey = rawKeys.find(k => k.toLowerCase() === `${agg.field}_${agg.function}`.toLowerCase());
                                        let val: any = "";
                                        if (aggKey && previewData[0] && (aggKey in previewData[0])) {
                                          val = previewData[0][aggKey];
                                        } else {
                                          // Calculate it natively in JS for Custom Fields
                                          const numericValues = previewData.map(r => Number(r[agg.field])).filter(n => !isNaN(n));
                                          if (agg.function === "SUM") {
                                            val = numericValues.reduce((s, n) => s + n, 0);
                                            val = Number.isInteger(val) ? val : val.toFixed(2);
                                          } else if (agg.function === "AVG") {
                                            val = numericValues.length ? (numericValues.reduce((s, n) => s + n, 0) / numericValues.length) : 0;
                                            val = Number.isInteger(val) ? val : val.toFixed(2);
                                          } else if (agg.function === "MAX") {
                                            val = numericValues.length ? Math.max(...numericValues) : 0;
                                            val = Number.isInteger(val) ? val : val.toFixed(2);
                                          } else if (agg.function === "MIN") {
                                            val = numericValues.length ? Math.min(...numericValues) : 0;
                                            val = Number.isInteger(val) ? val : val.toFixed(2);
                                          } else if (agg.function === "COUNT") {
                                            val = previewData.filter(r => r[agg.field] !== null && r[agg.field] !== undefined && r[agg.field] !== "").length;
                                          }
                                        }
                                        return (
                                          <div key={agg.function} className="flex items-center gap-1">
                                            <span className="text-[10px] text-gray-500 font-normal uppercase">{agg.function}:</span>
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
                  </>
                );
              })()}
            </table>
          ) : (
            <div className="mt-8 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={previewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={groupBy} />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  {aggregations.map((agg, idx) => (
                    <Bar key={idx} dataKey={`${agg.field}_${agg.function.toLowerCase()}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}


          {customSignatures && (
            <div className="mt-24 mb-16 flex justify-around items-end text-center font-bold text-sm print:break-inside-avoid">
              {customSignatures.split(',').map((sig, idx) => (
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
      )}
    </div>
  );
}
