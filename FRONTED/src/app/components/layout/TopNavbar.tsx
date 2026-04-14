import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Search, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../ui/Badge";

const NOTIFICATIONS = [
  { id: 1, title: "Fee Payment Due", message: "Your tuition fee of ₹15,000 is due on 30th April.", time: "2h ago", type: "warning", read: false },
  { id: 2, title: "Attendance Alert", message: "Your attendance fell below 75% in March.", time: "1d ago", type: "danger", read: false },
  { id: 3, title: "Leave Approved", message: "Your leave application for Apr 15 has been approved.", time: "2d ago", type: "success", read: true },
  { id: 4, title: "Exam Schedule", message: "Final exams scheduled from May 5–20. Download timetable.", time: "3d ago", type: "info", read: true },
  { id: 5, title: "Holiday Notice", message: "School will remain closed on April 14 (Ambedkar Jayanti).", time: "5d ago", type: "info", read: true },
];

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export function TopNavbar({ onMobileMenuToggle, mobileMenuOpen }: TopNavbarProps) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const getRoleColor = () => {
    const map: Record<string, string> = {
      student: "#A3B18A",
      teacher: "#88b5d0",
      manager: "#c4a98a",
      cashier: "#b8a0d0",
      admin: "#d09090",
    };
    return map[user?.role || "student"] || "#A3B18A";
  };

  return (
    <div
      className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.08] flex-shrink-0"
      style={{
        background: "linear-gradient(90deg, rgba(26,46,34,0.92) 0%, rgba(20,38,28,0.95) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-[#A3B18A] hover:text-white transition-colors"
          onClick={onMobileMenuToggle}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="hidden md:block">
          <h1 className="text-white font-semibold text-base">
            {user?.role === "student" ? `Welcome, ${user.name.split(" ")[0]}` : `${user?.name}`}
          </h1>
          <p className="text-[#A3B18A] text-xs">
            {user?.role === "student"
              ? `Class ${user.class}-${user.section} · ID: ${user.id}`
              : `${user?.department || user?.role} · ID: ${user?.id}`}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-sm text-white placeholder-[#A3B18A] outline-none focus:border-[#588157]"
              autoFocus
            />
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/[0.12] flex items-center justify-center text-[#A3B18A] hover:text-white hover:bg-white/[0.12] transition-all"
        >
          <Search size={16} />
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/[0.12] flex items-center justify-center text-[#A3B18A] hover:text-white hover:bg-white/[0.12] transition-all relative"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute right-0 top-12 w-80 rounded-2xl border border-white/[0.12] shadow-2xl overflow-hidden z-50"
                style={{
                  background: "linear-gradient(135deg, rgba(26,46,34,0.98) 0%, rgba(20,38,28,0.99) 100%)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm">Notifications</h3>
                  <Badge variant="danger" size="sm">{unreadCount} new</Badge>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-b border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        !n.read ? "bg-white/[0.03]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            !n.read ? "bg-[#A3B18A]" : "bg-white/20"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium">{n.title}</p>
                          <p className="text-[#A3B18A] text-xs mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-white/30 text-xs mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-[#A3B18A] text-xs hover:text-white transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 ml-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${getRoleColor()}, #344E41)` }}
          >
            {user ? getInitials(user.name) : "U"}
          </div>
          <ChevronDown size={14} className="text-[#A3B18A] hidden md:block" />
        </div>
      </div>
    </div>
  );
}
