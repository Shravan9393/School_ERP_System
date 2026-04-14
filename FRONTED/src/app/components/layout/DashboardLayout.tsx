import { useState, useEffect, useRef, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, Users, BookOpen, Clock, CreditCard, FileText, User, Bell, Settings,
  Calendar, BarChart2, LogOut, Menu, X, Search, ChevronRight, GraduationCap,
  LayoutDashboard, Clipboard, UserCheck, DollarSign, Receipt, Shield,
  Layers, Table2, AlignJustify
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';
interface NavItem {
  icon: React.ElementType;
  label: string;
  tab: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  title: string;
  subtitle?: string;
  notifications?: number;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  student: [
    { icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
    { icon: Clock, label: 'Attendance', tab: 'attendance' },
    { icon: CreditCard, label: 'Fee Portal', tab: 'fees' },
    { icon: FileText, label: 'Leave', tab: 'leave' },
    { icon: User, label: 'Profile', tab: 'profile' },
    { icon: Bell, label: 'Notifications', tab: 'notifications' },
  ],
  teacher: [
    { icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
    { icon: UserCheck, label: 'Attendance Records', tab: 'attendance' },
    { icon: BookOpen, label: 'Marks & Grades', tab: 'marks' },
    { icon: FileText, label: 'Leave Requests', tab: 'leave' },
    { icon: BarChart2, label: 'Performance', tab: 'performance' },
    { icon: Bell, label: 'Notifications', tab: 'notifications' },
  ],
  manager: [
    { icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
    { icon: Table2, label: 'Timetable', tab: 'timetable' },
    { icon: Layers, label: 'Sections', tab: 'sections' },
    { icon: Users, label: 'Assign Teachers', tab: 'assign' },
    { icon: AlignJustify, label: 'Schedules', tab: 'schedules' },
    { icon: Bell, label: 'Notifications', tab: 'notifications' },
  ],
  cashier: [
    { icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
    { icon: Search, label: 'Search Student', tab: 'search' },
    { icon: DollarSign, label: 'Record Payment', tab: 'payment' },
    { icon: Clipboard, label: 'Payment Logs', tab: 'logs' },
    { icon: Receipt, label: 'Receipts', tab: 'receipts' },
    { icon: Bell, label: 'Notifications', tab: 'notifications' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
    { icon: Users, label: 'User Management', tab: 'users' },
    { icon: GraduationCap, label: 'Students', tab: 'students' },
    { icon: BookOpen, label: 'Staff', tab: 'staff' },
    { icon: Shield, label: 'Role Assignment', tab: 'roles' },
    { icon: Settings, label: 'System Settings', tab: 'settings' },
  ],
};

const mobileNavItems = [
  { icon: Home, label: 'Home', tab: 'overview' },
  { icon: Search, label: 'Search', tab: 'search' },
  { icon: LayoutDashboard, label: 'Dashboard', tab: 'dashboard' },
  { icon: Bell, label: 'Alerts', tab: 'notifications' },
  { icon: User, label: 'Profile', tab: 'profile' },
];

const roleColors: Record<UserRole, string> = {
  student: '#588157',
  teacher: '#4a7c6f',
  manager: '#5a6e8a',
  cashier: '#7a6a4a',
  admin: '#6a4a7a',
};

export function DashboardLayout({ children, activeTab, onTabChange, title, subtitle, notifications = 3 }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mousemove', handleMouseMove); if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const navItems = user ? roleNavItems[user.role] : [];
  const accentColor = user ? roleColors[user.role] : '#588157';

  const mockNotifs = [
    { id: 1, title: 'Fee Reminder', msg: 'Term 2 fee due on 30th April', time: '2h ago', type: 'fee' },
    { id: 2, title: 'Attendance Alert', msg: 'Attendance below 75% in Physics', time: '1d ago', type: 'attendance' },
    { id: 3, title: 'Leave Approved', msg: 'Your leave for 5th April is approved', time: '2d ago', type: 'leave' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1e14 0%, #1a2e20 40%, #233b2a 100%)', fontFamily: 'var(--font-body)' }}>
      {/* Cursor Spotlight */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(88,129,87,0.12), transparent 70%)` }} />
      {/* Ambient orbs */}
      <div className="fixed top-20 right-20 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(88,129,87,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />


      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>

        {/* Sidebar panel */}
        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full z-50 flex flex-col lg:translate-x-0"
          style={{ width: 256, background: 'rgba(15,30,20,0.85)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRight: '1px solid rgba(163,177,138,0.12)' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'rgba(163,177,138,0.12)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${accentColor}, #3A5A40)` }}>
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Greenfield</p>
              <p style={{ fontSize: 10, color: '#A3B18A' }}>Academy ERP</p>
            </div>
            <button className="ml-auto lg:hidden text-[#A3B18A] hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <motion.button
                  key={item.tab}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => { onTabChange(item.tab); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                  style={{
                    background: isActive ? `rgba(88,129,87,0.2)` : 'transparent',
                    border: isActive ? '1px solid rgba(88,129,87,0.3)' : '1px solid transparent',
                  }}
                >
                  <Icon size={16} style={{ color: isActive ? '#A3B18A' : 'rgba(163,177,138,0.5)' }} />
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? '#DAD7CD' : 'rgba(218,215,205,0.5)' }}>
                    {item.label}
                  </span>
                  {isActive && <ChevronRight size={14} className="ml-auto" style={{ color: '#588157' }} />}
                </motion.button>
              );
            })}
          </nav>

          {/* User profile at bottom */}
          <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(163,177,138,0.12)' }}>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${accentColor}, #2d4a35)`, fontWeight: 700 }}>
                {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate" style={{ color: '#DAD7CD', fontWeight: 500 }}>{user?.name}</p>
                <p className="truncate capitalize" style={{ fontSize: 10, color: '#A3B18A' }}>{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="p-1 rounded-lg hover:bg-red-500/20 transition-colors group" title="Logout">
                <LogOut size={14} className="text-[#A3B18A] group-hover:text-red-400" />
              </button>
            </div>
          </div>
        </motion.aside>
      </>

      {/* Static sidebar spacer for large screens */}
      <div className="hidden lg:block" style={{ width: 256, flexShrink: 0 }} />

      {/* Main content wrapper */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-6 h-16"
          style={{ background: 'rgba(10,20,14,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
          <button className="lg:hidden p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setSidebarOpen(true)}>
            <Menu size={18} style={{ color: '#A3B18A' }} />
          </button>

          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: 15, fontWeight: 600 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: 11, color: '#A3B18A' }}>{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.1)' }}>
              <Search size={14} style={{ color: '#A3B18A' }} />
              <span style={{ fontSize: 12, color: 'rgba(163,177,138,0.6)' }}>Search...</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.1)' }}
                onClick={() => setShowNotifPanel(!showNotifPanel)}>
                <Bell size={16} style={{ color: '#A3B18A' }} />
                {notifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ fontSize: 9, background: '#e05252', fontWeight: 700 }}>{notifications}</span>
                )}
              </button>
              <AnimatePresence>
                {showNotifPanel && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-12 w-72 rounded-2xl overflow-hidden z-50"
                    style={{ background: 'rgba(15,30,20,0.95)', backdropFilter: 'blur(40px)', border: '1px solid rgba(163,177,138,0.15)' }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(163,177,138,0.1)' }}>
                      <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>Notifications</p>
                    </div>
                    {mockNotifs.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b" style={{ borderColor: 'rgba(163,177,138,0.06)' }}>
                        <p className="text-white" style={{ fontSize: 12, fontWeight: 500 }}>{n.title}</p>
                        <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 2 }}>{n.msg}</p>
                        <p style={{ fontSize: 10, color: 'rgba(163,177,138,0.5)', marginTop: 4 }}>{n.time}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs text-white cursor-pointer flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #2d4a35)`, fontWeight: 700, fontSize: 11 }}>
              {user?.avatar}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-4">
        <div className="flex items-center justify-around py-3 px-2 rounded-2xl"
          style={{ background: 'rgba(10,20,14,0.85)', backdropFilter: 'blur(30px)', border: '1px solid rgba(163,177,138,0.15)' }}>
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <motion.button key={item.tab} whileTap={{ scale: 0.85 }}
                onClick={() => onTabChange(item.tab)}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl"
                style={{ background: isActive ? 'rgba(88,129,87,0.2)' : 'transparent' }}>
                <Icon size={18} style={{ color: isActive ? '#A3B18A' : 'rgba(163,177,138,0.4)' }} />
                <span style={{ fontSize: 9, color: isActive ? '#A3B18A' : 'rgba(163,177,138,0.4)', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}