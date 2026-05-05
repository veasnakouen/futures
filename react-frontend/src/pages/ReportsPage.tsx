import { useState, useCallback, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useTranslation } from 'react-i18next'

// Modular Components
import ReportFilterBar from '../components/reports/ReportFilterBar'
import ReportPreviewer from '../components/reports/ReportPreviewer'
import ReportExportMenu from '../components/reports/ReportExportMenu'

const REPORT_LIST = [
  { key: 'ClientSummaryReport', label: 'Client Summary Report' },
  { key: 'AttendanceReport', label: 'Attendance Summary' },
  { key: 'EmployeeSeekerListreport', label: 'Employee Seeker List' },
  { key: 'PlacementSummaryReport', label: 'Placement Summary' },
  { key: 'EmployersReport', label: 'Employers' },
  { key: 'JobVancancyAvailable', label: 'Job Vacancies Available' },
  { key: 'BeneficiariesReport', label: 'Beneficiaries Report' },
  { key: 'Businesssetupmonitoiring', label: 'Business Monitoring' },
  { key: 'BusinessSetUpReport', label: 'Business Set Up' },
  { key: 'ClientLookforbussinesssSetupReport', label: 'Business Setup Search' },
  { key: 'ClientReferralFromMTProgramReport', label: 'Client Referrals' },
  { key: 'ClientsRemainingInPlacementReport', label: 'Remaining in Placement' },
  { key: 'CurriculumVitaeByClientReport', label: 'Curriculum Vitae (CV)' },
  { key: 'FurtherEuducationseekerListReport', label: 'Further Education Seekers' },
  { key: 'JobReadinessReport', label: 'Job Readiness' },
  { key: 'LogBookReport', label: 'Log Book' },
  { key: 'PlacementMonitoringAndDropoutReport', label: 'Monitoring & Dropout' },
  { key: 'SocialSupportCaseReport', label: 'Social Support Case' },
  { key: 'VtcStudentlReport', label: 'VTC Students' },
];

const ReportsPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState(REPORT_LIST[0].key);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportImages, setReportImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [modernData, setModernData] = useState<any[]>([]);
  const [isModern, setIsModern] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState(new Date().getFullYear() + '-01-01');
  const [endDate, setEndDate] = useState(new Date().getFullYear() + '-12-31');

  const fetchReport = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    setModernData([]);
    setReportImages([]);
    
    // Check if this is a modern report
    if (selectedReport === 'ClientSummaryReport' || selectedReport === 'AttendanceReport') {
      setIsModern(true);
      try {
        const endpoint = selectedReport === 'ClientSummaryReport' ? '/reports/client-summary' : '/api/hr/attendance';
        const response = await api.get(endpoint, {
          params: { page: page - 1, size: 20 }
        });
        setModernData(response.data.content || response.data);
        setTotalRecords(response.data.totalElements || response.data.length);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage((response.data.currentPage || 0) + 1);
      } catch (err: any) {
        setError('Failed to fetch modern report data.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setIsModern(false);
    try {
      const response = await api.get('/reports/GetReportPage', {
        params: {
          reportName: selectedReport,
          page: page,
          startdate: startDate,
          enddate: endDate,
        }
      });
      setReportImages(response.data.imagesBase64 || []);
      setTotalPages(Math.max(1, response.data.totalPages));
      setCurrentPage(response.data.currentPage);
      setTotalRecords(response.data.totalRecords || 0);
    } catch (err: any) {
      setError('Reporting service temporarily unavailable. Ensure RDLC middleware is configured.');
    } finally {
      setLoading(false);
    }
  }, [selectedReport, startDate, endDate]);

  useEffect(() => {
    fetchReport(1);
  }, [selectedReport]);

  const handleDownload = (format: string) => {
     window.open(`http://10.202.34.118:8081/api/reports/DownloadReport?reportName=${selectedReport}&format=${format}&startdate=${startDate}&enddate=${endDate}`, '_blank');
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title={t('reports')}>
      <div className="space-y-8 animate-fade-in h-full flex flex-col max-w-[1600px] mx-auto pb-12">
        <ReportFilterBar 
          REPORT_LIST={REPORT_LIST}
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onGenerate={() => fetchReport(1)}
          onExportToggle={() => setExportOpen(!exportOpen)}
          isExportOpen={exportOpen}
          exportMenu={<ReportExportMenu onClose={() => setExportOpen(false)} onDownload={handleDownload} />}
        />

        <ReportPreviewer 
          selectedReport={selectedReport}
          totalRecords={totalRecords}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          error={error}
          isModern={isModern}
          modernData={modernData}
          reportImages={reportImages}
          onPageChange={fetchReport}
        />
      </div>
    </Layout>
  );
};

export default ReportsPage;
