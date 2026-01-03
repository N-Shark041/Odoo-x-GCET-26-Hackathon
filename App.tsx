
import React, { useState, useEffect } from 'react';
import { User, UserRole, AttendanceRecord, LeaveRequest, PayrollRecord, LeaveStatus, UserStatus } from './types';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Layout from './components/Layout/Layout';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ProfileView from './components/Profile/ProfileView';
import AttendanceTracker from './components/Attendance/AttendanceTracker';
import LeaveManagement from './components/Leave/LeaveManagement';
import PayrollModule from './components/Payroll/PayrollModule';
import EmployeeDetailView from './components/Admin/EmployeeDetailView';
import axiosInstance from './config/api';

// Simplified API Helper using the centralized axios instance
const api = {
  get: (url: string) => axiosInstance.get(url)
    .then(res => res.data.success ? res.data.data : [])
    .catch(() => []),
  post: (url: string, body: any) => axiosInstance.post(url, body)
    .then(res => res.data),
  patch: (url: string, body: any) => axiosInstance.patch(url, body)
    .then(res => res.data),
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'signup' | 'dashboard' | 'profile' | 'attendance' | 'leave' | 'payroll' | 'employee-detail'>('login');
  const [darkMode, setDarkMode] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);

  const fetchAttendance = (userId: string) => {
    api.get(`/attendance/${userId}`).then(setAttendance);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('odoodo_user');
    const token = localStorage.getItem('odoodo_token');
    if (savedUser && token) {
      setCurrentUser(JSON.parse(savedUser));
      setView('dashboard');
    }
    const savedDarkMode = localStorage.getItem('odoodo_darkmode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === UserRole.ADMIN) {
        api.get('/employees').then(setUsers);
        api.get('/leaves').then(setLeaves);
      } else {
        fetchAttendance(currentUser.id);
        api.get(`/leaves?userId=${currentUser.id}`).then(setLeaves);
        api.get(`/payrolls?userId=${currentUser.id}`).then(setPayrolls);
      }
    }
  }, [currentUser]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('odoodo_darkmode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleLogin = (loginData: { token: string, user: User }) => {
    setCurrentUser(loginData.user);
    localStorage.setItem('odoodo_user', JSON.stringify(loginData.user));
    localStorage.setItem('odoodo_token', loginData.token);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('odoodo_user');
    localStorage.removeItem('odoodo_token');
    setView('login');
  };

  const renderView = () => {
    if (!currentUser) return null;

    switch (view) {
      case 'dashboard':
        return currentUser.role === UserRole.ADMIN ? (
          <AdminDashboard 
            users={users} 
            attendance={attendance} 
            leaves={leaves} 
            onSelectUser={(u) => { setSelectedEmployeeId(u.id); setView('employee-detail'); }}
            onApproveLeave={(id) => api.patch(`/leaves/${id}`, { status: LeaveStatus.APPROVED }).then(() => api.get('/leaves').then(setLeaves))}
            onRejectLeave={(id) => api.patch(`/leaves/${id}`, { status: LeaveStatus.REJECTED }).then(() => api.get('/leaves').then(setLeaves))}
          />
        ) : (
          <EmployeeDashboard 
            user={currentUser} 
            attendance={attendance} 
            leaves={leaves} 
            onNavigate={(v) => setView(v as any)} 
          />
        );
      case 'profile':
        return <ProfileView user={currentUser} isEditingOwn={true} currentUserRole={currentUser.role} onUpdate={(u) => setCurrentUser(u)} />;
      case 'attendance':
        return (
          <AttendanceTracker 
            user={currentUser} 
            records={attendance} 
            onUpdateAttendance={async () => {
              const res = await api.post('/attendance/toggle', { userId: currentUser.id });
              if (res.success) {
                 fetchAttendance(currentUser.id);
              } else {
                 alert(res.error || "Shift error");
              }
            }} 
            isAdmin={false} 
          />
        );
      case 'leave':
        return <LeaveManagement user={currentUser} isAdmin={currentUser.role === UserRole.ADMIN} leaves={leaves} users={users} onSubmitLeave={(l) => api.post('/leaves', l).then(() => api.get('/leaves').then(setLeaves))} onStatusChange={(id, status, comment) => api.patch(`/leaves/${id}`, { status, adminComment: comment }).then(() => api.get('/leaves').then(setLeaves))} />;
      case 'payroll':
        return <PayrollModule currentUser={currentUser} users={users} payrolls={payrolls} onUpdatePayroll={() => {}} onAddPayroll={(p) => api.post('/payrolls', p).then(() => api.get('/payrolls').then(setPayrolls))} />;
      case 'employee-detail':
        const target = users.find(u => u.id === selectedEmployeeId);
        return target ? <EmployeeDetailView employee={target} attendance={[]} leaves={[]} payrolls={[]} onUpdateEmployee={() => {}} onUpdateAttendance={() => {}} onUpdateLeave={() => {}} onBack={() => setView('dashboard')} /> : null;
      default:
        return <div className="p-10 text-center text-gray-400">View coming soon...</div>;
    }
  };

  if (view === 'login') return <Login onLogin={handleLogin} onGoToSignUp={() => setView('signup')} users={users} />;
  if (view === 'signup') return <SignUp onSignUp={(user) => { handleLogin({ token: 'mock', user }); }} onGoToLogin={() => setView('login')} />;

  return (
    <Layout 
      user={currentUser!} 
      onLogout={handleLogout} 
      darkMode={darkMode} 
      onToggleDarkMode={toggleDarkMode}
      activeView={view}
      onViewChange={setView}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
