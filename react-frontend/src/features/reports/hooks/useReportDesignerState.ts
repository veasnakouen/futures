import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

export interface DesignerProps {
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

export interface FilterRule {
  field: string;
  operator: string;
  value: string;
}

export interface AggregationRule {
  field: string;
  function: string;
}

export interface CustomFieldRule {
  name: string;
  type: string;
  formula: string;
}

export function useReportDesignerState(props: DesignerProps) {
  const {
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
  } = props;

  const [metadata, setMetadata] = useState<Record<string, string[]>>({});
  const [source, setSource] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [groupBy, setGroupBy] = useState<string>("");
  const [aggregations, setAggregations] = useState<AggregationRule[]>([]);
  const [customFields, setCustomFields] = useState<CustomFieldRule[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [loadedReportId, setLoadedReportId] = useState<string>("");
  const [showDataSourceModal, setShowDataSourceModal] = useState(false);

  const fetchMetadata = async () => {
    try {
      const res = await api.get(`/custom-reports/metadata?_t=${Date.now()}`);
      setMetadata(res.data);
    } catch {
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

  useEffect(() => {
    fetchMetadata();
    fetchSavedReports();
  }, []);

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

    const report = savedReports.find((r) => r.reportName === rId);
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
      } catch (err) {
        console.error("Failed to parse saved report", err);
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
        aggregations: aggregations.filter(
          (agg) => !customFields.some((cf) => cf.name.toLowerCase() === agg.field.toLowerCase())
        ),
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
        customDateLocation,
      }),
    };

    try {
      await api.post(`/report-builder/settings/${reportId}`, payload);
      alert("Report saved successfully!");
      setSaveName("");
      fetchSavedReports();
    } catch {
      setError("Failed to save report.");
    } finally {
      setIsSaving(false);
    }
  };

  const exportCSV = () => {
    if (previewData.length === 0) return;
    const isGrandTotal = aggregations.length > 0 && !groupBy;
    const aggKeys = isGrandTotal
      ? aggregations.map((a) => `${a.field}_${a.function}`.toLowerCase())
      : [];
    const rawKeys = Object.keys(previewData[0] || {});
    customFields.forEach((cf) => {
      if (cf.name && cf.name.trim() !== "" && !rawKeys.includes(cf.name)) {
        rawKeys.push(cf.name);
      }
    });
    const displayColumns = rawKeys.filter((k) => !aggKeys.includes(k.toLowerCase()));

    const header = displayColumns.join(",");
    const rows = previewData.map((row) => {
      return displayColumns
        .map((col) => {
          let val = row[col];
          if (val === undefined) val = "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    if (isGrandTotal) {
      const footerRow = displayColumns
        .map((col, idx) => {
          const aggs = aggregations.filter(
            (a) => a.field.toLowerCase() === col.toLowerCase()
          );
          if (aggs.length > 0) {
            const vals = aggs.map((agg) => {
              const aggKey = rawKeys.find(
                (k) => k.toLowerCase() === `${agg.field}_${agg.function}`.toLowerCase()
              );
              let val: any = "";
              if (aggKey && previewData[0] && aggKey in previewData[0]) {
                val = previewData[0][aggKey];
              } else {
                const numericValues = previewData
                  .map((r) => Number(r[agg.field]))
                  .filter((n) => !isNaN(n));
                if (agg.function === "SUM") val = numericValues.reduce((s, n) => s + n, 0);
                else if (agg.function === "AVG")
                  val = numericValues.length
                    ? numericValues.reduce((s, n) => s + n, 0) / numericValues.length
                    : 0;
                else if (agg.function === "MAX")
                  val = numericValues.length ? Math.max(...numericValues) : 0;
                else if (agg.function === "MIN")
                  val = numericValues.length ? Math.min(...numericValues) : 0;
                else if (agg.function === "COUNT")
                  val = previewData.filter(
                    (r) => r[agg.field] !== null && r[agg.field] !== undefined && r[agg.field] !== ""
                  ).length;
                if (typeof val === "number")
                  val = Number.isInteger(val) ? val : val.toFixed(2);
              }
              return `${agg.function}: ${val}`;
            });
            return `"${vals.join(" | ")}"`;
          }
          return idx === 0 ? '"Grand Total"' : `""`;
        })
        .join(",");
      rows.push(footerRow);
    }

    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${customTitle || source || "report"}_export.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    metadata,
    source,
    setSource,
    fields,
    setFields,
    filters,
    setFilters,
    groupBy,
    setGroupBy,
    aggregations,
    setAggregations,
    customFields,
    setCustomFields,
    viewMode,
    setViewMode,
    previewData,
    setPreviewData,
    loading,
    error,
    setError,
    saveName,
    setSaveName,
    isSaving,
    savedReports,
    loadedReportId,
    showDataSourceModal,
    setShowDataSourceModal,
    fetchMetadata,
    fetchSavedReports,
    handleLoadReport,
    handleSourceChange,
    handleFieldToggle,
    addFilter,
    updateFilter,
    removeFilter,
    addAggregation,
    updateAggregation,
    removeAggregation,
    generatePreview,
    handleSaveReport,
    exportCSV,
  };
}
