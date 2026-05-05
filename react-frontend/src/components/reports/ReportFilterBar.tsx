import React, { useState } from 'react';
import { Card, Label, Select, TextInput, Button, Datepicker, Popover } from 'flowbite-react';
import { Search, Calendar, Download } from 'lucide-react';

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
}

const ReportFilterBar: React.FC<ReportFilterBarProps> = ({
  REPORT_LIST, selectedReport, setSelectedReport, startDate, setStartDate, endDate, setEndDate, onGenerate, onExportToggle, isExportOpen, exportMenu
}) => {
  
  const handleDateChange = (field: 'start' | 'end', date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      if (field === 'start') setStartDate(dateString);
      else setEndDate(dateString);
    }
  };

  return (
    <>
    <Card className="dark:bg-gray-800 border-none shadow-sm p-4 rounded-lg border dark:border-gray-700/50">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-6">
        <div className="flex-1">
          <Label htmlFor="report" className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Target Analytic Node</Label>
          <Select id="report" value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)} className="rounded-lg w-full border-none bg-gray-50 dark:bg-gray-700/50 font-bold">
            {REPORT_LIST.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
          </Select>
        </div>

        <div className="grid grid-cols-2 lg:flex gap-4">
          <div className="w-full lg:w-48">
            <Label className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Filter Start</Label>
            <Popover
              content={
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700">
                  <Datepicker 
                    inline={true}
                    value={startDate ? new Date(startDate) : new Date()}
                    onChange={(date) => handleDateChange('start', date)}
                  />
                </div>
              }
              placement="bottom"
              trigger="click"
            >
              <div className="relative cursor-pointer">
                <TextInput 
                  readOnly 
                  value={startDate || ''} 
                  placeholder="Start Date..."
                  className="cursor-pointer"
                  rightIcon={() => <Calendar size={14} className="text-gray-400" />}
                />
              </div>
            </Popover>
          </div>

          <div className="w-full lg:w-48">
            <Label className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Filter End</Label>
            <Popover
              content={
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700">
                  <Datepicker 
                    inline={true}
                    value={endDate ? new Date(endDate) : new Date()}
                    onChange={(date) => handleDateChange('end', date)}
                  />
                </div>
              }
              placement="bottom"
              trigger="click"
            >
              <div className="relative cursor-pointer">
                <TextInput 
                  readOnly 
                  value={endDate || ''} 
                  placeholder="End Date..."
                  className="cursor-pointer"
                  rightIcon={() => <Calendar size={14} className="text-gray-400" />}
                />
              </div>
            </Popover>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onGenerate} className="flex-1 lg:px-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 border-none shadow-xl shadow-indigo-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px] h-12">
            <Search size={18} className="mr-2" /> Generate
          </Button>
          
          <div className="relative">
            <Button color="light" onClick={onExportToggle} className="rounded-lg border-gray-200 dark:border-gray-700 h-12 px-6 font-black uppercase text-[10px] tracking-widest">
              <Download size={18} className="lg:mr-2" /> <span className="hidden lg:inline">Extract</span>
            </Button>
            {isExportOpen && exportMenu}
          </div>
        </div>
      </div>
    </Card>
    </>
  );
};

export default ReportFilterBar;
