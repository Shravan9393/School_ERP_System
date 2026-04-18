import { createBrowserRouter, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { CashierDashboard } from './pages/CashierDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ROLE_DASHBOARD } from './context/AuthContext';

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a2e20' }}>
      <div className="w-8 h-8 border-2 border-[#588157] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/login', Component: LoginPage },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardRedirect /></ProtectedRoute>,
  },
  {
    path: '/dashboard/student',
    element: <ProtectedRoute><StudentDashboard /></ProtectedRoute>,
  },
  {
    path: '/dashboard/teacher',
    element: <ProtectedRoute><TeacherDashboard /></ProtectedRoute>,
  },
  {
    path: '/dashboard/manager',
    element: <ProtectedRoute><ManagerDashboard /></ProtectedRoute>,
  },
  {
    path: '/dashboard/cashier',
    element: <ProtectedRoute><CashierDashboard /></ProtectedRoute>,
  },
  {
    path: '/dashboard/admin',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
