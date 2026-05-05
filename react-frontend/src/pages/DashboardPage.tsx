import { useState, useEffect } from 'react'
import { Card, Spinner } from 'flowbite-react'
import { Shield } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useTranslation } from 'react-i18next'

// Modular Components
import StatsOverview from '../components/dashboard/StatsOverview'
import TrendChart from '../components/dashboard/TrendChart'
import StatusDistribution from '../components/dashboard/StatusDistribution'
import NotificationStream from '../components/dashboard/NotificationStream'
import CriticalTasks from '../components/dashboard/CriticalTasks'

const DashboardPage = ({ isDark, setIsDark, notifications }: any) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.error("Dashboard data load error:", err);
        const msg = err.response?.data?.message || err.message || "Unknown error";
        const status = err.response?.status ? ` (Status: ${err.response.status})` : "";
        setError(`Failed to load dashboard data: ${msg}${status}`);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout isDark={isDark} setIsDark={setIsDark} title={t('dashboard')}>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-500 animate-pulse font-black uppercase text-[10px] tracking-widest">Analyzing system metrics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title={t('dashboard')}>
      <div className="space-y-8 animate-fade-in pb-12 max-w-[1600px] mx-auto">
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-6 rounded-lg">
            <p className="text-red-600 dark:text-red-400 font-black uppercase text-xs flex items-center gap-3">
              <Shield size={20} /> {error}
            </p>
          </Card>
        )}

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-3">
                 <div className="inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-widest uppercase bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> {t('system_online')}
                 </div>
                 <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t('welcome_back')}, Admin</h3>
                 <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                   Real-time operational visibility across all system nodes.
                 </p>
              </div>
              <div className="flex flex-wrap gap-4">
                 <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 rounded-lg border border-gray-100 dark:border-gray-600 shadow-inner">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total System Impact</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">{stats?.totalClients?.toLocaleString()}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Modular Sections */}
        <StatsOverview stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TrendChart data={stats?.registrationTrend || []} />
          </div>
          <div>
            <StatusDistribution data={stats?.statusDistribution || []} total={stats?.totalClients || 0} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NotificationStream notifications={notifications} />
          <CriticalTasks />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
