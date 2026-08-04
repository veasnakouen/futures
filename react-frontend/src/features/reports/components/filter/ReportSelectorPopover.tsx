import React from "react";
import { Label, Popover, TextInput } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import { ChevronDown } from "lucide-react";

interface Props {
  props: any;
  state: any;
}

export default function ReportSelectorPopover({ props, state }: Props) {
  const { REPORT_LIST, selectedReport, setSelectedReport } = props;
  const { searchTerm, setSearchTerm } = state;

  return (
    <div className="flex-1">
      <Label
        htmlFor="report"
        className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400"
      >
        Target Analytic Node
      </Label>
      <Popover
        content={
          <div className="flex flex-col w-[320px] max-h-[350px] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl custom-scrollbar overflow-hidden border border-gray-200 dark:border-gray-700 z-[100]">
            <div className="p-2 border-b border-gray-100/60 dark:border-gray-800/30 bg-white/95 dark:bg-gray-800/95 z-10 sticky top-0">
              <SearchInput
                placeholder="Search reports..."
                value={searchTerm}
                onChange={setSearchTerm}
                containerClassName="[&_input]:bg-gray-50 [&_input]:dark:bg-gray-900"
              />
            </div>
            <div className="flex flex-col overflow-y-auto p-2">
              <button
                onClick={() => {
                  setSelectedReport("custom_designer");
                  setSearchTerm("");
                  document.getElementById("report-dropdown-trigger")?.click();
                }}
                className={`report-item-btn w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all mb-2 cursor-pointer ${
                  selectedReport === "custom_designer"
                    ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                ⚡ Build Custom Report
              </button>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 pb-1 border-b border-gray-100/60 dark:border-gray-800/30 mb-1">
                Standard Reports
              </div>
              {REPORT_LIST.filter((r: any) =>
                r.label.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((r: any) => (
                <button
                  key={r.key}
                  onClick={() => {
                    setSelectedReport(r.key);
                    setSearchTerm("");
                    document.getElementById("report-dropdown-trigger")?.click();
                  }}
                  className={`report-item-btn w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    selectedReport === r.key
                      ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
              {REPORT_LIST.filter((r: any) =>
                r.label.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div id="report-dropdown-trigger" className="relative cursor-pointer rounded-xl">
          <TextInput
            readOnly
            value={
              selectedReport === "custom_designer"
                ? "⚡ Build Custom Report"
                : REPORT_LIST.find((r: any) => r.key === selectedReport)?.label || "Select Report"
            }
            className="cursor-pointer [&_input]:cursor-pointer [&_input]:font-bold [&_input]:bg-gray-50 [&_input]:dark:bg-gray-700/50 [&_input]:rounded-xl"
            rightIcon={() => <ChevronDown size={14} className="text-gray-400" />}
          />
        </div>
      </Popover>
    </div>
  );
}
