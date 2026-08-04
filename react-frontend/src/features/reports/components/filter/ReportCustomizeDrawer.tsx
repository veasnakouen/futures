import React from "react";
import { createPortal } from "react-dom";
import { Label, Select, TextInput, Button, Textarea, FileInput } from "@/lib/flowbite-compat";
import { X, Eye, EyeOff, Image as ImageIcon, Trash2 } from "lucide-react";

interface Props {
  props: any;
  state: any;
}

export default function ReportCustomizeDrawer({ props, state }: Props) {
  const {
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
  } = props;

  const { toggleColumn, handleLogoUpload } = state;

  if (!isCustomizeOpen || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        onClick={() => setIsCustomizeOpen && setIsCustomizeOpen(false)}
      />
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col animate-fade-in-right">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
          <h3 className="font-black uppercase tracking-widest text-xs">
            Report Settings
          </h3>
          <button
            onClick={() => setIsCustomizeOpen && setIsCustomizeOpen(false)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
          {/* Titles */}
          <div className="space-y-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Document Headers
            </h4>
            <div>
              <Label className="text-xs mb-1 block">Main Title</Label>
              <TextInput
                value={customTitle || ""}
                onChange={(e) => setCustomTitle && setCustomTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Subtitle</Label>
              <TextInput
                value={customSubtitle || ""}
                onChange={(e) => setCustomSubtitle && setCustomSubtitle(e.target.value)}
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
                      onClick={() => setCustomLogoUrl && setCustomLogoUrl(null)}
                      className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors cursor-pointer"
                      title="Remove Logo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block text-gray-500">Logo Position</Label>
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
                        setCustomLogoShape && setCustomLogoShape(e.target.value as any)
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
              <Label className="text-xs mb-1 block">Custom Footer Text</Label>
              <Textarea
                value={customFooterText || ""}
                onChange={(e) => setCustomFooterText && setCustomFooterText(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Signatures (comma separated)</Label>
              <TextInput
                value={customSignatures || ""}
                onChange={(e) => setCustomSignatures && setCustomSignatures(e.target.value)}
                placeholder="e.g. PREPARED BY, VERIFIED BY"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Date & Location</Label>
              <TextInput
                value={customDateLocation || ""}
                onChange={(e) =>
                  setCustomDateLocation && setCustomDateLocation(e.target.value)
                }
                placeholder="e.g. Washington D.C., January 01, 2025"
              />
            </div>
          </div>

          {/* Layout */}
          <div className="space-y-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Print Layout
            </h4>
            <div className="flex gap-2">
              <Button
                color={printLayout === "portrait" ? "info" : "light"}
                size="sm"
                onClick={() => setPrintLayout && setPrintLayout("portrait")}
                className="flex-1 cursor-pointer"
              >
                Portrait
              </Button>
              <Button
                color={printLayout === "landscape" ? "info" : "light"}
                size="sm"
                onClick={() => setPrintLayout && setPrintLayout("landscape")}
                className="flex-1 cursor-pointer"
              >
                Landscape
              </Button>
            </div>
          </div>

          {/* Columns */}
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 pb-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Data Columns
              </h4>
              <span
                className="text-[10px] text-indigo-600 font-bold cursor-pointer hover:underline"
                onClick={() => setHiddenColumns && setHiddenColumns(new Set())}
              >
                Show All
              </span>
            </div>

            <div className="space-y-1">
              {allDataKeys && allDataKeys.length > 0 ? (
                allDataKeys.map((col: string) => {
                  const isHidden = hiddenColumns?.has(col);
                  return (
                    <div
                      key={col}
                      onClick={() => toggleColumn(col)}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all ${
                        isHidden
                          ? "bg-gray-50 dark:bg-gray-800 opacity-50"
                          : "bg-white dark:bg-gray-700 shadow-sm hover:border-indigo-300"
                      }`}
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

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <Button
            onClick={() => setIsCustomizeOpen && setIsCustomizeOpen(false)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-[10px] cursor-pointer"
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </>,
    document.body
  );
}
