import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Download, AlertCircle, Search, Filter, Printer,
  FileText, FileSpreadsheet, File as FileIcon, BarChart2
} from 'lucide-react';
import './index.css';

// ── Report catalogue: key must match backend RdlcMapping keys ──────────────
const REPORT_LIST: { key: string; label: string }[] = [
  { key: 'ClientSummaryReport',                  label: '1. Client Summary Report' },
  { key: 'EmploymentSeekerListReport',           label: '2. Employment Seeker List' },
  { key: 'PlacementSummaryReport',               label: '3. Placement Summary' },
  { key: 'ClientsRemainingInPlacementReport',    label: '4. Clients Remaining in Placement' },
  { key: 'JobReadinessReport',                   label: '5. Job Readiness' },
  { key: 'EmployersReport',                      label: '6. Employers' },
  { key: 'VancancysReport',                      label: '7. Job Vacancies Available' },
  { key: 'FurtherEuducationSeekerListReport',    label: '8. Further Education Seeker List' },
  { key: 'PlacementMonitoringAndDropoutReport',  label: '9. Placement Monitoring & Dropout' },
  { key: 'beneficiariesReport',                  label: '10. Beneficiaries / Dependents' },
  { key: 'clientReferralFromMTProgramReport',    label: '11. Client Referral From MT Program' },
  { key: 'LogBooksReport',                       label: '12. Log Books' },
  { key: 'CaseManagerReport',                    label: '13. Case Manager' },
  { key: 'BusinessSetupReport',                  label: '14. Business Setup' },
  { key: 'BusinessSetupMonitoringReport',        label: '15. Business Setup Monitoring' },
  { key: 'VTCstudentreport',                     label: '16. VTC Student' },
  { key: 'ClientLookforbussinesssSetupReport',   label: '17. Client Looking for Business Setup' },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const currentYear = new Date().getFullYear();
const DEFAULT_START = `${currentYear}-01-01`;
const DEFAULT_END   = `${currentYear}-12-31`;

const LS = {
  get: (k: string, fallback: string) => localStorage.getItem(k) ?? fallback,
  set: (k: string, v: string) => localStorage.setItem(k, v),
};

interface ReportPageData {
  currentPage: number;
  totalPages: number;
  imagesBase64: string[];
}

// ── Skeleton shimmer ───────────────────────────────────────────────────────
function SkeletonPage() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-bar w-full h-8 mb-4" />
      <div className="skeleton-bar w-3/4 h-4 mb-2" />
      <div className="skeleton-bar w-full h-4 mb-2" />
      <div className="skeleton-bar w-5/6 h-4 mb-2" />
      <div className="skeleton-bar w-full h-4 mb-2" />
      <div className="skeleton-bar w-2/3 h-4 mb-6" />
      <div className="skeleton-bar w-full h-40 mb-4" />
      <div className="skeleton-bar w-full h-40" />
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
function App() {
  const [selectedReport, setSelectedReport] = useState<string>(
    LS.get('rdlc_report', REPORT_LIST[0].key)
  );
  const [currentPage,  setCurrentPage]  = useState<number>(1);
  const [totalPages,   setTotalPages]   = useState<number>(1);
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);

  // Filters & Settings (persisted in localStorage)
  const [startDate,      setStartDate]      = useState<string>(LS.get('rdlc_start', DEFAULT_START));
  const [endDate,        setEndDate]        = useState<string>(LS.get('rdlc_end',   DEFAULT_END));
  const [searchText,     setSearchText]     = useState<string>('');
  const [recordsPerPage, setRecordsPerPage] = useState<string>(LS.get('rdlc_rpp',  '0'));
  const [paperSize,      setPaperSize]      = useState<string>(LS.get('rdlc_paper', 'A4'));

  const [loading, setLoading] = useState<boolean>(false);
  const [error,   setError]   = useState<string | null>(null);

  // Persist preferences
  useEffect(() => { LS.set('rdlc_report', selectedReport); }, [selectedReport]);
  useEffect(() => { LS.set('rdlc_start',  startDate);      }, [startDate]);
  useEffect(() => { LS.set('rdlc_end',    endDate);         }, [endDate]);
  useEffect(() => { LS.set('rdlc_rpp',    recordsPerPage);  }, [recordsPerPage]);
  useEffect(() => { LS.set('rdlc_paper',  paperSize);       }, [paperSize]);

  const fetchReportPage = useCallback(async (reportName: string, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ReportPageData>(`/Reports/GetReportPage`, {
        params: {
          reportName,
          page,
          startdate:      startDate      || undefined,
          enddate:        endDate        || undefined,
          searchtext:     searchText     || undefined,
          recordsPerPage: recordsPerPage !== '0' ? recordsPerPage : undefined,
          paperSize,
        },
      });
      setImagesBase64(response.data.imagesBase64 || []);
      setTotalPages(Math.max(1, response.data.totalPages));
      setCurrentPage(response.data.currentPage);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || err.message || 'Failed to load report page.');
      setImagesBase64([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, searchText, recordsPerPage, paperSize]);

  // Auto-load when report changes
  useEffect(() => {
    fetchReportPage(selectedReport, 1);
  }, [selectedReport]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyFilters = () => fetchReportPage(selectedReport, 1);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchReportPage(selectedReport, newPage);
    }
  };

  const getExportUrl = (format: string) => {
    const p = new URLSearchParams();
    p.append('reportName', selectedReport);
    p.append('format', format);
    if (startDate)  p.append('startdate',  startDate);
    if (endDate)    p.append('enddate',    endDate);
    if (searchText) p.append('searchtext', searchText);
    return `/Reports/DownloadReport?${p.toString()}`;
  };

  const handlePrint = () => {
    const w = window.open(getExportUrl('pdf'), '_blank');
    if (w) w.onload = () => w.print();
  };

  const selectedLabel = REPORT_LIST.find(r => r.key === selectedReport)?.label ?? selectedReport;

  return (
    <div className="app-container fade-in">
      <main className="glass-panel">
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Filter bar ── */}
        <div className="filter-bar">
          {/* Report selector */}
          <div className="filter-group report-select-group">
            <Filter size={18} className="filter-icon text-secondary" />
            <select
              id="report-select"
              className="custom-select"
              value={selectedReport}
              onChange={(e) => { setSelectedReport(e.target.value); }}
            >
              {REPORT_LIST.map(r => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Paper size */}
          <div className="filter-group select-group">
            <select
              id="paper-size-select"
              className="custom-select"
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              title="Physical Paper Size"
            >
              <option value="A4">A4 Size</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
              <option value="A3">A3 Size</option>
            </select>
          </div>

          {/* Records per page */}
          <div className="filter-group select-group">
            <select
              id="records-per-page-select"
              className="custom-select"
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(e.target.value)}
              title="Records Per Page"
            >
              <option value="0">All Records</option>
              <option value="10">10 / Page</option>
              <option value="25">25 / Page</option>
              <option value="50">50 / Page</option>
              <option value="100">100 / Page</option>
            </select>
          </div>

          {/* Date range */}
          <div className="filter-group date-group">
            <input
              id="start-date"
              type="date"
              className="custom-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Start Date"
            />
            <span className="separator">to</span>
            <input
              id="end-date"
              type="date"
              className="custom-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="End Date"
            />
          </div>

          {/* Search */}
          <div className="filter-group search-group">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                id="search-input"
                type="text"
                className="custom-input pl-10"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                placeholder="Search..."
              />
            </div>
            <button id="apply-btn" className="btn-secondary" onClick={handleApplyFilters}>
              Apply
            </button>
          </div>
        </div>

        {/* ── Controls row ── */}
        <div className="controls">
          <div className="pagination-controls">
            <button className="page-btn" title="First Page"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || loading || totalPages === 1}>
              <ChevronsLeft size={20} />
            </button>
            <button className="page-btn" title="Previous Page"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading || totalPages === 1}>
              <ChevronLeft size={20} />
            </button>

            <span className="page-info">
              {recordsPerPage === '0' ? 'Page' : 'Data Page'}&nbsp;
              <strong>{currentPage}</strong>&nbsp;of&nbsp;<strong>{totalPages}</strong>
            </span>

            <button className="page-btn" title="Next Page"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading || totalPages === 1}>
              <ChevronRight size={20} />
            </button>
            <button className="page-btn" title="Last Page"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || loading || totalPages === 1}>
              <ChevronsRight size={20} />
            </button>
          </div>

          <div className="report-label-badge">
            <BarChart2 size={14} />
            {selectedLabel}
          </div>

          <div className="action-buttons">
            <button id="print-btn" className="btn-icon" onClick={handlePrint} title="Print PDF">
              <Printer size={18} /> Print
            </button>

            <div className="dropdown">
              <button id="export-btn" className="btn-primary dropdown-toggle">
                <Download size={18} /> Export <ChevronRight size={16} className="dropdown-arrow rotate-90" />
              </button>
              <div className="dropdown-menu">
                <a href={getExportUrl('pdf')}   target="_blank" rel="noreferrer" className="dropdown-item">
                  <FileIcon size={16} /> PDF Document
                </a>
                <a href={getExportUrl('excel')} target="_blank" rel="noreferrer" className="dropdown-item">
                  <FileSpreadsheet size={16} /> Excel Spreadsheet
                </a>
                <a href={getExportUrl('word')}  target="_blank" rel="noreferrer" className="dropdown-item">
                  <FileText size={16} /> Word Document
                </a>
                <a href={getExportUrl('csv')}   target="_blank" rel="noreferrer" className="dropdown-item">
                  <FileText size={16} /> CSV Raw Data
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Report viewer ── */}
        <div className="viewer-container">
          {loading && (
            <div className="loading-overlay fade-in">
              <div className="skeleton-wrapper">
                <SkeletonPage />
              </div>
              <div className="loading-label">
                <div className="spinner" />
                <p>Rendering report…</p>
              </div>
            </div>
          )}

          <div className="images-stack">
            {imagesBase64 && imagesBase64.length > 0 ? (
              imagesBase64.map((img, idx) => (
                <img
                  key={idx}
                  src={`data:image/png;base64,${img}`}
                  alt={`Page ${currentPage} – Sheet ${idx + 1}`}
                  className="report-image fade-in"
                />
              ))
            ) : !loading && !error && (
              <div className="empty-state">
                <BarChart2 size={48} className="empty-icon" />
                <p>Select a report and press <strong>Apply</strong> to view data.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
