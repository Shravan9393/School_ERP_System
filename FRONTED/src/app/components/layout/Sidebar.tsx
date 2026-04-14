import { motion, AnimatePresence } from "motion/react";
import { useAuth, UserRole } from "../../context/AuthContext";
import {
  LayoutDashboard, Users, CalendarCheck, BookOpen,
  CreditCard, FileText, Bell, Settings, LogOut,
  GraduationCap, Clock, UserCog, Receipt, Search,
  ChevronLeft, ChevronRight, BarChart3, Shield, Home,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Overview", icon: <LayoutDashboard size={18} />, path: "/dashboard/student" },
    { label: "Attendance", icon: <CalendarCheck size={18} />, path: "/dashboard/student/attendance" },
    { label: "Fees", icon: <CreditCard size={18} />, path: "/dashboard/student/fees" },
    { label: "Leave", icon: <FileText size={18} />, path: "/dashboard/student/leave" },
    { label: "Profile", icon: <GraduationCap size={18} />, path: "/dashboard/student/profile" },
    { label: "Notifications", icon: <Bell size={18} />, path: "/dashboard/student/notifications" },
  ],
  teacher: [
    { label: "Overview", icon: <LayoutDashboard size={18} />, path: "/dashboard/teacher" },
    { label: "Attendance", icon: <CalendarCheck size={18} />, path: "/dashboard/teacher/attendance" },
    { label: "Marks", icon: <BookOpen size={18} />, path: "/dashboard/teacher/marks" },
    { label: "Performance", icon: <BarChart3 size={18} />, path: "/dashboard/teacher/performance" },
    { label: "Leave Approvals", icon: <FileText size={18} />, path: "/dashboard/teacher/leaves" },
    { label: "Notifications", icon: <Bell size={18} />, path: "/dashboard/teacher/notifications" },
  ],
  manager: [
    { label: "Overview", icon: <LayoutDashboard size={18} />, path: "/dashboard/manager" },
    { label: "Timetable", icon: <Clock size={18} />, path: "/dashboard/manager/timetable" },
    { label: "Sections", icon: <Users size={18} />, path: "/dashboard/manager/sections" },
    { label: "Assign Teachers", icon: <UserCog size={18} />, path: "/dashboard/manager/assign" },
    { label: "Schedules", icon: <CalendarCheck size={18} />, path: "/dashboard/manager/schedules" },
    { label: "Notifications", icon: <Bell size={18} />, path: "/dashboard/manager/notifications" },
  ],
  cashier: [
    { label: "Overview", icon: <LayoutDashboard size={18} />, path: "/dashboard/cashier" },
    { label: "Search Student", icon: <Search size={18} />, path: "/dashboard/cashier/search" },
    { label: "Record Payment", icon: <CreditCard size={18} />, path: "/dashboard/cashier/payment" },
    { label: "Payment Logs", icon: <Receipt size={18} />, path: "/dashboard/cashier/logs" },
    { label: "Verify Online", icon: <Shield size={18} />, path: "/dashboard/cashier/verify" },
    { label: "Notifications", icon: <Bell size={18} />, path: "/dashboard/cashier/notifications" },
  ],
  admin: [
    { label: "Overview", icon: <LayoutDashboard size={18} />, path: "/dashboard/admin" },
    { label: "Users", icon: <Users size={18} />, path: "/dashboard/admin/users" },
    { label: "Students", icon: <GraduationCap size={18} />, path: "/dashboard/admin/students" },
    { label: "Staff", icon: <UserCog size={18} />, path: "/dashboard/admin/staff" },
    { label: "Roles", icon: <Shield size={18} />, path: "/dashboard/admin/roles" },
    { label: "Settings", icon: <Settings size={18} />, path: "/dashboard/admin/settings" },
  ],
};

const roleLabels: Record<UserRole, string> = {
  student: "Student Portal",
  teacher: "Teacher Portal",
  manager: "Manager Portal",
  cashier: "Cashier Portal",
  admin: "Admin Portal",
};

const roleColors: Record<UserRole, string> = {
  student: "#A3B18A",
  teacher: "#88b5d0",
  manager: "#c4a98a",
  cashier: "#b8a0d0",
  admin: "#d09090",
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = roleNavItems[user.role];
  const roleColor = roleColors[user.role];

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative h-screen flex flex-col flex-shrink-0 border-r border-white/[0.08] overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(26,46,34,0.95) 0%, rgba(20,38,28,0.98) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-[#588157] border border-[#3A5A40] flex items-center justify-center text-white shadow-lg"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </motion.button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.08]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${roleColor}, #344E41)` }}
        >
          <GraduationCap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-white font-semibold text-sm whitespace-nowrap">Green Valley</p>
              <p className="text-[#A3B18A] text-xs whitespace-nowrap">Senior Secondary School</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Role label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pt-4 pb-2"
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: roleColor }}>
              {roleLabels[user.role]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        {items.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== `/dashboard/${user.role}` && location.pathname.startsWith(item.path));

          return (
            <motion.button
              key={item.path}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                isActive
                  ? "bg-[#588157]/30 text-white border border-[#588157]/40"
                  : "text-[#A3B18A] hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#A3B18A]"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/[0.08]">
        {/* Home button */}
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A3B18A] hover:bg-white/[0.05] hover:text-white transition-all mb-1"
        >
          <Home size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm whitespace-nowrap"
              >
                Home
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* User info */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]"
            >
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-[#A3B18A] text-xs truncate">{user.id}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
