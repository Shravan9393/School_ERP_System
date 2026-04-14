import { motion } from "motion/react";
import { Home, Search, LayoutDashboard, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { icon: <Home size={20} />, label: "Home", action: "home" },
  { icon: <Search size={20} />, label: "Search", action: "search" },
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", action: "dashboard" },
  { icon: <Bell size={20} />, label: "Alerts", action: "notifications" },
  { icon: <User size={20} />, label: "Profile", action: "profile" },
];

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleAction = (action: string) => {
    if (!user) { navigate("/login"); return; }
    const base = `/dashboard/${user.role}`;
    switch (action) {
      case "home": navigate("/"); break;
      case "dashboard": navigate(base); break;
      case "notifications": navigate(`${base}/notifications`); break;
      case "profile": navigate(`${base}/profile`); break;
      default: break;
    }
  };

  const isActive = (action: string) => {
    if (action === "home") return location.pathname === "/";
    if (action === "dashboard") return location.pathname === `/dashboard/${user?.role}`;
    if (action === "notifications") return location.pathname.includes("notifications");
    if (action === "profile") return location.pathname.includes("profile");
    return false;
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden"
      style={{ width: "calc(100% - 32px)", maxWidth: 360 }}
    >
      <div
        className="flex items-center justify-around px-4 py-3 rounded-2xl border border-white/[0.15] shadow-2xl"
        style={{
          background: "rgba(26,46,34,0.92)",
          backdropFilter: "blur(24px)",
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.action);
          return (
            <motion.button
              key={item.action}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleAction(item.action)}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  active
                    ? "bg-[#588157]/40 text-white border border-[#588157]/50"
                    : "text-[#A3B18A]"
                }`}
              >
                {item.icon}
              </div>
              <span className={`text-[10px] ${active ? "text-white" : "text-[#A3B18A]"}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
