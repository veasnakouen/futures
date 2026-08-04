import React from "react";
import { Button } from "@/lib/flowbite-compat";
import { Settings2, Search, Download } from "lucide-react";

interface Props {
  props: any;
}

export default function ReportFilterActionButtons({ props }: Props) {
  const {
    setIsCustomizeOpen,
    onGenerate,
    onExportToggle,
    isExportOpen,
    exportMenu,
  } = props;

  return (
    <div className="flex items-center gap-3">
      <Button
        color="light"
        size="sm"
        onClick={() => setIsCustomizeOpen && setIsCustomizeOpen(true)}
        className="rounded-xl border-none shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px] cursor-pointer"
      >
        <Settings2 size={16} className="mr-2" />{" "}
        <span className="hidden xl:inline">Customize</span>
      </Button>

      <Button
        size="sm"
        onClick={onGenerate}
        className="flex-1 lg:px-8 rounded-xl border-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px] cursor-pointer"
      >
        <Search size={16} className="mr-2" /> Generate
      </Button>

      <div className="relative">
        <Button
          size="sm"
          onClick={onExportToggle}
          className="rounded-xl border-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 px-6 font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 cursor-pointer"
        >
          <Download size={16} className="lg:mr-2" />{" "}
          <span className="hidden lg:inline">Extract</span>
        </Button>
        {isExportOpen && exportMenu}
      </div>
    </div>
  );
}
