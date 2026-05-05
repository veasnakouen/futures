import React from 'react';
import { Card, Badge, Spinner } from 'flowbite-react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import ClientSummaryReport from './ClientSummaryReport';
import AttendanceReport from './AttendanceReport';

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
}

const ReportPreviewer: React.FC<ReportPreviewerProps> = ({
  selectedReport, totalRecords, currentPage, totalPages, loading, error, isModern, modernData, reportImages, onPageChange
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-[700px]">
      <Card className="flex-1 dark:bg-gray-800 border-none shadow-sm overflow-hidden flex flex-col p-0 rounded-lg">
        <div className="p-6 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Badge color="info" className="rounded-lg px-4 py-1.5 font-black uppercase text-[10px] tracking-widest shadow-sm">Preview Node</Badge>
            <span className="text-xs font-black dark:text-gray-300 text-gray-500 uppercase tracking-widest">{selectedReport}</span>
            {totalRecords > 0 && <Badge color="success" className="ml-3 rounded-full font-black text-[9px] uppercase tracking-widest px-3 py-1">{totalRecords} Datasets</Badge>}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Matrix {currentPage} / {totalPages}</span>
            <div className="flex gap-2">
                <button 
                   disabled={currentPage <= 1 || loading} 
                   onClick={() => onPageChange(currentPage - 1)} 
                   className="p-3 rounded-lg border dark:border-gray-600 disabled:opacity-20 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
                >
                   <ChevronLeft size={20} className="dark:text-white"/>
                </button>
                <button 
                   disabled={currentPage >= totalPages || loading} 
                   onClick={() => onPageChange(currentPage + 1)} 
                   className="p-3 rounded-lg border dark:border-gray-600 disabled:opacity-20 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
                >
                   <ChevronRight size={20} className="dark:text-white"/>
                </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900/50 p-6 lg:p-16 flex justify-center no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Spinner size="xl" />
              <p className="mt-6 font-black text-gray-400 uppercase tracking-[0.3em] text-[10px] animate-pulse">Rendering Analytic Stream...</p>
            </div>
          ) : error ? (
            <div className="max-w-md text-center py-32 animate-fade-in">
              <AlertCircle size={80} className="mx-auto text-gray-300 mb-6 opacity-30" />
              <h3 className="text-2xl font-black dark:text-white mb-2 uppercase tracking-tight">Stream Intersection Failure</h3>
              <p className="text-sm font-bold text-gray-500 italic uppercase tracking-wider">{error}</p>
            </div>
          ) : (
            <div className="space-y-12 shadow-2xl max-w-5xl w-full bg-white rounded-sm overflow-hidden animate-slide-in">
                {isModern ? (
                   selectedReport === 'ClientSummaryReport' ? (
                      <ClientSummaryReport 
                         data={modernData} 
                         totalRecords={totalRecords}
                         currentPage={currentPage}
                         totalPages={totalPages}
                      />
                   ) : (
                      <AttendanceReport data={modernData} />
                   )
                ) : (
                  reportImages.map((img, idx) => (
                     <img key={idx} src={`data:image/png;base64,${img}`} alt={`Node Matrix Page ${idx + 1}`} className="w-full h-auto bg-white border-b last:border-b-0 shadow-lg dark:border-gray-700" />
                  ))
               )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportPreviewer;
