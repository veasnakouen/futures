import { useState, useEffect } from 'react'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom'
import './i18n'
import './index.css'

// Services & Components
import authService from './services/authService'
import websocketService from './services/websocketService'
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'

import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientProfilePage from './pages/ClientProfilePage';
import CVPage from './pages/CVPage';
import LogbookPage from './pages/LogbookPage';
import PlacementsPage from './pages/PlacementsPage';
import CasesPage from './pages/CasesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import EmployeesPage from './pages/EmployeesPage';
import InventoryPage from './pages/InventoryPage';
import SupportPage from './pages/SupportPage';
import EmployersPage from './pages/EmployersPage';
import VacanciesPage from './pages/VacanciesPage';
import PayrollPage from './pages/PayrollPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';

// --- Main App Component ---

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      websocketService.connect(() => {
        websocketService.subscribe('/topic/updates', (msg) => {
          setNotifications(prev => [msg.content || 'New update received', ...prev].slice(0, 5));
        });
      });
    }

    // Security: Auto-logout after 30 mins inactivity
    let timeout: any;
    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (authService.getCurrentUser()) {
          authService.logout();
          window.location.href = '/login';
        }
      }, 30 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      websocketService.disconnect();
      events.forEach(event => document.removeEventListener(event, resetTimer));
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <Router>
        <Toaster 
          position="top-right" 
          reverseOrder={false} 
          toastOptions={{ 
            className: 'dark:bg-slate-900/80 dark:text-white rounded-lg shadow-2xl border dark:border-white/10 backdrop-blur-xl font-bold tracking-tight',
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#0f172a',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
            },
            success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }} 
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage isDark={isDark} setIsDark={setIsDark} notifications={notifications} />} />
            <Route path="/clients" element={<ClientsPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/clients/:id" element={<ClientProfilePage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/clients/:id/cv" element={<CVPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/logbook" element={<LogbookPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/placements" element={<PlacementsPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/cases" element={<CasesPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/reports" element={<ReportsPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/settings" element={<SettingsPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/employees" element={<EmployeesPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/inventory" element={<InventoryPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/support" element={<SupportPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/employers" element={<EmployersPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/vacancies" element={<VacanciesPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/payroll" element={<PayrollPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/chat" element={<ChatPage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/admin" element={<AdminPage isDark={isDark} setIsDark={setIsDark} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
  )
}

export default App
