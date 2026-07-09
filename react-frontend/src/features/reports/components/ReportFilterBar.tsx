import React, { useState } from "react";
import { createPortal } from "react-dom";
import {Label, Select, TextInput, Button, Popover, Checkbox, Textarea, FileInput} from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import {
  Search,
  Calendar,
  Download,
  ChevronDown,
  Settings2,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

interface ReportFilterBarProps {
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

const ReportFilterBar: React.FC<ReportFilterBarProps> = ({
  REPORT_LIST,
  selectedReport,
  setSelectedReport,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onGenerate,
  onExportToggle,
  isExportOpen,
  exportMenu,
  isCustomizeOpen,
  setIsCustomizeOpen,
  customTitle,
  setCustomTitle,
  customSubtitle,
  setCustomSubtitle,
  printLayout,
  setPrintLayout,
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
  hiddenColumns,
  setHiddenColumns,
  allDataKeys,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleColumn = (col: string) => {
    if (!hiddenColumns || !setHiddenColumns) return;
    const newSet = new Set(hiddenColumns);
    if (newSet.has(col)) {
      newSet.delete(col);
    } else {
      newSet.add(col);
    }
    setHiddenColumns(newSet);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setCustomLogoUrl) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 rounded-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
          <div className="flex-1">
            <Label
              htmlFor="report"
              className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400"
            >
              Target Analytic Node
            </Label>
            <Popover
              content={
                <div className="flex flex-col w-[320px] max-h-[350px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl rounded-sm custom-scrollbar overflow-hidden">
                  <div className="p-2 border-b bg-white/95 dark:bg-gray-800/95 z-10 sticky top-0">
                    <TextInput
                      icon={Search}
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="[&_input]:bg-gray-50 [&_input]:dark:bg-gray-900"
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col overflow-y-auto p-2">
                    <button
                      onClick={() => {
                        setSelectedReport("custom_designer");
                        setSearchTerm("");
                        document.getElementById("report-dropdown-trigger")?.click();
                      }}
                      className={`report-item-btn w-full text-left px-4 py-3 rounded-sm text-sm font-semibold transition-all mb-2 ${ selectedReport ==="custom_designer"?"bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400":"text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 border-indigo-200"}`}
                    >
                      ⚡ Build Custom Report
                    </button>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 pb-1 border-b mb-1">Standard Reports</div>
                    {REPORT_LIST.filter((r) =>
                      r.label.toLowerCase().includes(searchTerm.toLowerCase()),
                    ).map((r) => (
                      <button
                        key={r.key}
                        onClick={() => {
                          setSelectedReport(r.key);
                          setSearchTerm("");
                          // Close popover by clicking the trigger
                          document
                            .getElementById("report-dropdown-trigger")
                            ?.click();
                        }}
                        className={`report-item-btn w-full text-left px-4 py-3 rounded-sm text-sm font-semibold transition-all ${ selectedReport === r.key ?"bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400":"text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
                      >
                        {r.label}
                      </button>
                    ))}
                    {REPORT_LIST.filter((r) =>
                      r.label.toLowerCase().includes(searchTerm.toLowerCase()),
                    ).length === 0 && (
                      <div className="text-center py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        No reports found
                      </div>
                    )}
                  </div>
                </div>
              }
              placement="bottom"
              trigger="click"
            >
              <div
                id="report-dropdown-trigger"
                className="relative cursor-pointer rounded-sm"
              >
                <TextInput
                  readOnly
                  value={
                    selectedReport === "custom_designer" 
                      ? "⚡ Build Custom Report" 
                      : REPORT_LIST.find((r) => r.key === selectedReport)?.label || "Select Report"
                  }
                  className="cursor-pointer [&_input]:cursor-pointer [&_input]:font-bold [&_input]:bg-gray-50 [&_input]:dark:bg-gray-700/50"
                  rightIcon={() => (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                />
              </div>
            </Popover>
          </div>

          <div className="grid grid-cols-2 lg:flex gap-4">
            <div className="w-full lg:w-48">
              <Label className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                Filter Start
              </Label>
              <DatePicker
                value={startDate ? new Date(startDate) : null}
                onChange={(date) => setStartDate(format(date, "yyyy-MM-dd"))}
                placeholder="Start Date..."
              />
            </div>

            <div className="w-full lg:w-48">
              <Label className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                Filter End
              </Label>
              <DatePicker
                value={endDate ? new Date(endDate) : null}
                onChange={(date) => setEndDate(format(date, "yyyy-MM-dd"))}
                placeholder="End Date..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              color="light"
              size="sm"
              onClick={() => setIsCustomizeOpen && setIsCustomizeOpen(true)}
              className="rounded-sm hover: transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]"
            >
              <Settings2 size={16} className="mr-2" />{" "}
              <span className="hidden xl:inline">Customize</span>
            </Button>

            <Button
              color="light"
              size="sm"
              onClick={onGenerate}
              className="flex-1 lg:px-8 rounded-sm border-green-600 hover:border-green-900 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]"
            >
              <Search size={16} className="mr-2" /> Generate
            </Button>

            <div className="relative">
              <Button
                color="light"
                size="sm"
                onClick={onExportToggle}
                className="rounded-sm border-green-600 hover:border-green-900 px-6 font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
              >
                <Download size={16} className="lg:mr-2" />{" "}
                <span className="hidden lg:inline">Extract</span>
              </Button>
              {isExportOpen && exportMenu}
            </div>
          </div>
        </div>
      </div>

      {/* Customize Drawer */}
      {isCustomizeOpen && typeof document !== "undefined" && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={() => setIsCustomizeOpen && setIsCustomizeOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col animate-fade-in-right">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-800">
              <h3 className="font-black uppercase tracking-widest text-xs">
                Report Settings
              </h3>
              <button
                onClick={() => setIsCustomizeOpen && setIsCustomizeOpen(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-6">
                {/* Titles */}
                <div className="space-y-4 border-b pb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Document Headers
                  </h4>
                  <div>
                    <Label className="text-xs mb-1 block">Main Title</Label>
                    <TextInput
                      value={customTitle || ""}
                      onChange={(e) =>
                        setCustomTitle && setCustomTitle(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Subtitle</Label>
                    <TextInput
                      value={customSubtitle || ""}
                      onChange={(e) =>
                        setCustomSubtitle && setCustomSubtitle(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Company Logo</Label>
                    {customLogoUrl ? (
                      <div className="space-y-3">
                        <div className="relative w-full h-24 rounded-md flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                          <img
                            src={customLogoUrl}
                            alt="Custom Logo"
                            className="max-h-20 object-contain"
                          />
                          <button
                            onClick={() =>
                              setCustomLogoUrl && setCustomLogoUrl(null)
                            }
                            className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                            title="Remove Logo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block text-gray-500">
                            Logo Position
                          </Label>
                          <Select
                            sizing="sm"
                            value={customLogoLocation || "top-left"}
                            onChange={(e) =>
                              setCustomLogoLocation &&
                              setCustomLogoLocation(e.target.value as any)
                            }
                          >
                            <option value="top-left">Top Left</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-right">Top Right</option>
                          </Select>
                        </div>
                        
                        <div className="mt-4">
                          <Label className="text-xs mb-1 block">Logo Shape</Label>
                          <Select
                            sizing="sm"
                            value={customLogoShape || "rectangle"}
                            onChange={(e) =>
                              setCustomLogoShape &&
                              setCustomLogoShape(e.target.value as any)
                            }
                          >
                            <option value="rectangle">Rectangle (Default)</option>
                            <option value="rounded">Rounded Corners (20%)</option>
                            <option value="circle">Circle / Oval</option>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <FileInput
                          id="logo-upload"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Label
                          htmlFor="logo-upload"
                          className="w-full h-24 border-2 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <ImageIcon size={24} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500 font-semibold">
                            Upload Logo (PNG/JPG)
                          </span>
                        </Label>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">
                      Custom Footer Text
                    </Label>
                    <Textarea
                      value={customFooterText || ""}
                      onChange={(e) =>
                        setCustomFooterText && setCustomFooterText(e.target.value)
                      }
                      rows={3}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">
                      Signatures (comma separated)
                    </Label>
                    <TextInput
                      value={customSignatures || ""}
                      onChange={(e) =>
                        setCustomSignatures && setCustomSignatures(e.target.value)
                      }
                      placeholder="e.g. PREPARED BY, VERIFIED BY"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Date & Location</Label>
                    <TextInput
                      value={customDateLocation || ""}
                      onChange={(e) =>
                        setCustomDateLocation &&
                        setCustomDateLocation(e.target.value)
                      }
                      placeholder="e.g. Washington D.C., January 01, 2025"
                    />
                  </div>
                </div>

                {/* Layout */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">
                    Print Layout
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      color={printLayout === "portrait" ? "info" : "light"}
                      size="sm"
                      onClick={() => setPrintLayout && setPrintLayout("portrait")}
                      className="flex-1"
                    >
                      Portrait
                    </Button>
                    <Button
                      color={printLayout === "landscape" ? "info" : "light"}
                      size="sm"
                      onClick={() =>
                        setPrintLayout && setPrintLayout("landscape")
                      }
                      className="flex-1"
                    >
                      Landscape
                    </Button>
                  </div>
                </div>

                {/* Columns */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b pb-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Data Columns
                    </h4>
                    <span
                      className="text-[10px] text-indigo-600 font-bold cursor-pointer hover:underline"
                      onClick={() =>
                        setHiddenColumns && setHiddenColumns(new Set())
                      }
                    >
                      Show All
                    </span>
                  </div>

                  <div className="space-y-1">
                    {allDataKeys && allDataKeys.length > 0 ? (
                      allDataKeys.map((col) => {
                        const isHidden = hiddenColumns?.has(col);
                        return (
                          <div
                            key={col}
                            onClick={() => toggleColumn(col)}
                            className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all ${isHidden ?"bg-gray-50 dark:bg-gray-800  opacity-50":"bg-white dark:bg-gray-700  shadow-sm hover:border-indigo-300"}`}
                          >
                            <span className="text-xs font-semibold">
                              {col.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            {isHidden ? (
                              <EyeOff size={16} className="text-gray-400" />
                            ) : (
                              <Eye size={16} className="text-indigo-600" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-xs text-gray-400 italic">
                        Generate a report to customize columns
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
              <Button
                onClick={() => setIsCustomizeOpen && setIsCustomizeOpen(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-[10px]"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default ReportFilterBar;
