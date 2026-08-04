import React from "react";
import { Button, Select, Label, TextInput } from "@/lib/flowbite-compat";
import DataSourceManagerModal from "./DataSourceManagerModal";
import {
  DesignerProps,
  FilterRule,
  AggregationRule,
  CustomFieldRule,
} from "../../hooks/useReportDesignerState";

interface ReportDesignerConfigFormProps extends DesignerProps {
  metadata: Record<string, string[]>;
  source: string;
  fields: string[];
  filters: FilterRule[];
  groupBy: string;
  aggregations: AggregationRule[];
  customFields: CustomFieldRule[];
  savedReports: any[];
  loadedReportId: string;
  showDataSourceModal: boolean;
  saveName: string;
  isSaving: boolean;
  loading: boolean;
  error: string | null;
  setShowDataSourceModal: (val: boolean) => void;
  setSaveName: (val: string) => void;
  setGroupBy: (val: string) => void;
  setCustomFields: React.Dispatch<React.SetStateAction<CustomFieldRule[]>>;
  fetchMetadata: () => void;
  handleLoadReport: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSourceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFieldToggle: (field: string) => void;
  addFilter: () => void;
  updateFilter: (index: number, key: string, value: string) => void;
  removeFilter: (index: number) => void;
  addAggregation: () => void;
  updateAggregation: (index: number, key: string, value: string) => void;
  removeAggregation: (index: number) => void;
  generatePreview: () => void;
  handleSaveReport: () => void;
}

export default function ReportDesignerConfigForm({
  metadata,
  source,
  fields,
  filters,
  groupBy,
  aggregations,
  customFields,
  savedReports,
  loadedReportId,
  showDataSourceModal,
  saveName,
  isSaving,
  loading,
  error,
  customTitle,
  customSubtitle,
  customLogoUrl,
  customLogoLocation,
  customLogoShape,
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
  setShowDataSourceModal,
  setSaveName,
  setGroupBy,
  setCustomFields,
  fetchMetadata,
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
}: ReportDesignerConfigFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Report Designer</h2>

      {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>}

      {/* Load Saved Report */}
      {savedReports.length > 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded border-blue-100">
          <Label className="mb-2 block font-bold text-blue-800">📂 Load Saved Report</Label>
          <Select value={loadedReportId} onChange={handleLoadReport}>
            <option value="">-- Start from Scratch --</option>
            {savedReports.map((r) => (
              <option key={r.reportName} value={r.reportName}>
                {(() => {
                  try {
                    return JSON.parse(r.preferences).customTitle || r.reportName;
                  } catch {
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
      {source && metadata[source] && (
        <div className="mb-6">
          <Label className="mb-2 block font-bold text-gray-700">2. Select Fields</Label>
          <div className="flex flex-wrap gap-3">
            {metadata[source].map((field) => (
              <label
                key={field}
                className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-2 rounded hover:bg-gray-100"
              >
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
      {source && metadata[source] && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-bold text-gray-700">3. Filters</Label>
            <Button size="xs" color="light" onClick={addFilter}>
              + Add Filter
            </Button>
          </div>
          {filters.map((filter, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <Select
                sizing="sm"
                value={filter.field}
                onChange={(e) => updateFilter(idx, "field", e.target.value)}
              >
                {metadata[source].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
              <Select
                sizing="sm"
                value={filter.operator}
                onChange={(e) => updateFilter(idx, "operator", e.target.value)}
              >
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value="LIKE">Contains (LIKE)</option>
              </Select>
              <TextInput
                sizing="sm"
                placeholder="Value"
                value={filter.value}
                onChange={(e) => updateFilter(idx, "value", e.target.value)}
              />
              <Button size="xs" color="failure" onClick={() => removeFilter(idx)}>
                X
              </Button>
            </div>
          ))}
          {filters.length === 0 && (
            <p className="text-xs text-gray-500 italic">No filters applied.</p>
          )}
        </div>
      )}

      {/* 4. Grouping & Aggregations */}
      {source && metadata[source] && (
        <div className="mb-6">
          <Label className="mb-2 block font-bold text-gray-700">
            4. Grouping & Aggregations (Optional)
          </Label>
          <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded">
            <div>
              <Label className="block mb-1 text-sm font-semibold">Group By Field</Label>
              <Select sizing="sm" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="">-- No Grouping --</option>
                {metadata[source].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="block mb-1 text-sm font-semibold">Aggregations</Label>
                <Button size="xs" color="light" onClick={addAggregation}>
                  + Add Aggregation
                </Button>
              </div>
              {aggregations.map((agg, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <Select
                    sizing="sm"
                    value={agg.function}
                    onChange={(e) => updateAggregation(idx, "function", e.target.value)}
                  >
                    <option value="SUM">SUM</option>
                    <option value="COUNT">COUNT</option>
                    <option value="AVG">AVERAGE</option>
                    <option value="MIN">MIN</option>
                    <option value="MAX">MAX</option>
                  </Select>
                  <Select
                    sizing="sm"
                    value={agg.field}
                    onChange={(e) => updateAggregation(idx, "field", e.target.value)}
                  >
                    {metadata[source].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                    {customFields
                      .map((cf) => cf.name)
                      .filter(Boolean)
                      .map((f) => (
                        <option key={f} value={f}>
                          {f} (Custom)
                        </option>
                      ))}
                  </Select>
                  <Button size="xs" color="failure" onClick={() => removeAggregation(idx)}>
                    X
                  </Button>
                </div>
              ))}
              {aggregations.length === 0 && (
                <p className="text-xs text-gray-500 italic">No aggregations applied.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4.5. Custom Fields */}
      {source && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-bold text-gray-700">Custom Fields (Optional)</Label>
            <Button
              size="xs"
              color="light"
              onClick={() =>
                setCustomFields([
                  ...customFields,
                  { name: "", type: "blank", formula: "" },
                ])
              }
            >
              + Add Custom Field
            </Button>
          </div>
          {customFields.map((cf, idx) => (
            <div key={idx} className="flex flex-wrap gap-2 mb-2 items-center bg-gray-50 p-2 rounded">
              <TextInput
                sizing="sm"
                placeholder="Field Name"
                value={cf.name}
                onChange={(e) => {
                  const newCf = [...customFields];
                  newCf[idx].name = e.target.value;
                  setCustomFields(newCf);
                }}
              />
              <Select
                sizing="sm"
                value={cf.type}
                onChange={(e) => {
                  const newCf = [...customFields];
                  newCf[idx].type = e.target.value;
                  setCustomFields(newCf);
                }}
              >
                <option value="blank">Blank Input Field</option>
                <option value="calculated">Calculated Formula</option>
              </Select>
              {cf.type === "calculated" && (
                <TextInput
                  sizing="sm"
                  placeholder="e.g. basicSalary * 0.1"
                  value={cf.formula}
                  onChange={(e) => {
                    const newCf = [...customFields];
                    newCf[idx].formula = e.target.value;
                    setCustomFields(newCf);
                  }}
                  className="flex-1 min-w-[200px]"
                />
              )}
              <Button
                size="xs"
                color="failure"
                onClick={() => setCustomFields(customFields.filter((_, i) => i !== idx))}
              >
                X
              </Button>
            </div>
          ))}
          {customFields.length === 0 && (
            <p className="text-xs text-gray-500 italic">No custom fields applied.</p>
          )}
        </div>
      )}

      {/* 5. Report Aesthetics & Branding */}
      {source && (
        <div className="mb-6">
          <Label className="mb-2 block font-bold text-gray-700">
            5. Report Aesthetics & Branding
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div>
              <Label className="block mb-1 text-sm font-semibold">Report Title</Label>
              <TextInput
                value={customTitle || ""}
                onChange={(e) => setCustomTitle && setCustomTitle(e.target.value)}
                placeholder="e.g. Employee Summary"
              />
            </div>
            <div>
              <Label className="block mb-1 text-sm font-semibold">Report Subtitle</Label>
              <TextInput
                value={customSubtitle || ""}
                onChange={(e) => setCustomSubtitle && setCustomSubtitle(e.target.value)}
                placeholder="e.g. Q3 2026"
              />
            </div>
            <div>
              <Label className="block mb-1 text-sm font-semibold">Logo URL</Label>
              <TextInput
                value={customLogoUrl || ""}
                onChange={(e) => setCustomLogoUrl && setCustomLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label className="block mb-1 text-sm font-semibold">Logo Shape</Label>
              <Select
                value={customLogoShape || "rectangle"}
                onChange={(e) => setCustomLogoShape && setCustomLogoShape(e.target.value as any)}
              >
                <option value="rectangle">Rectangle</option>
                <option value="rounded">Rounded Corners</option>
                <option value="circle">Circle</option>
              </Select>
            </div>
            <div>
              <Label className="block mb-1 text-sm font-semibold">Logo Location</Label>
              <Select
                value={customLogoLocation || "top-left"}
                onChange={(e) => setCustomLogoLocation && setCustomLogoLocation(e.target.value as any)}
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
              </Select>
            </div>
            <div>
              <Label className="block mb-1 text-sm font-semibold">Date Format / Location</Label>
              <TextInput
                value={customDateLocation || ""}
                onChange={(e) => setCustomDateLocation && setCustomDateLocation(e.target.value)}
                placeholder="e.g. Date: DD/MM/YYYY"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="block mb-1 text-sm font-semibold">Footer Text</Label>
              <TextInput
                value={customFooterText || ""}
                onChange={(e) => setCustomFooterText && setCustomFooterText(e.target.value)}
                placeholder="e.g. System Generated Report"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="block mb-1 text-sm font-semibold">Signatures block</Label>
              <TextInput
                value={customSignatures || ""}
                onChange={(e) => setCustomSignatures && setCustomSignatures(e.target.value)}
                placeholder="e.g. PREPARED BY, VERIFIED BY"
              />
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
            onChange={(e) => setSaveName(e.target.value)}
          />
          <Button
            color="success"
            onClick={handleSaveReport}
            disabled={isSaving || !source || fields.length === 0}
          >
            {isSaving ? "Saving..." : "Save Report"}
          </Button>
        </div>
        <Button
          color="blue"
          onClick={generatePreview}
          disabled={loading || !source || fields.length === 0}
          className="w-full md:w-auto"
        >
          {loading ? "Generating..." : "Preview Report"}
        </Button>
      </div>
    </div>
  );
}
