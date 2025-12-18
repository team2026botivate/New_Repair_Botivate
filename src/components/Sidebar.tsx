import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Settings as SettingsIcon,
  LogOut,
  X,
  ChevronDown,
  Truck,
  Package,
  DollarSign,
  CalendarDays,
  FileText,
  Home,
  Users,
  Activity,
  Search,
  Store,
  Receipt,
  ThumbsUp,
} from "lucide-react";
import useAuthStore from "../store/authStore";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Automatically expand menus based on current path
  useEffect(() => {
    const path = location.pathname;
    if (
      path.includes("/indent/tech-assigned") ||
      path.includes("/indent/work-tracking") ||
      path.includes("/indent/inspection")
    ) {
      setExpandedMenus(["inhouse"]);
    } else if (
      path.includes("/select-vendor") ||
      path.includes("/get-offer") ||
      path.includes("/approverate")
    ) {
      setExpandedMenus(["outhouse"]);
    } else {
      setExpandedMenus([]);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = (menuName: string) => {
    const isExpanding = !expandedMenus.includes(menuName);
    setExpandedMenus((prev) =>
      prev.includes(menuName) ? [] : [menuName]
    );

    if (isExpanding) {
      if (menuName === "inhouse") navigate("/indent/tech-assigned");
      if (menuName === "outhouse") navigate("/select-vendor");
    }
  };

  const isMenuExpanded = (menuName: string) => expandedMenus.includes(menuName);

  const isParentActive = (menuName: string) => {
    const path = location.pathname;
    if (menuName === "inhouse") {
      return (
        path.includes("/indent/tech-assigned") ||
        path.includes("/indent/work-tracking") ||
        path.includes("/indent/inspection")
      );
    }
    if (menuName === "outhouse") {
      return (
        path.includes("/select-vendor") ||
        path.includes("/get-offer") ||
        path.includes("/approverate")
      );
    }
    return false;
  };

  const navigationItem = (
    icon: React.ReactNode,
    label: string,
    path: string,
    isAdminOnly: boolean = true,
    hasSubmenu: boolean = false,
    menuName: string = "",
    end: boolean = false
  ) => {
    if (isAdminOnly && user?.role !== "admin") return null;

    if (hasSubmenu) {
      const isActive = isParentActive(menuName);
      return (
        <button
          onClick={() => toggleMenu(menuName)}
          className={`flex items-center justify-between gap-3 py-2 px-4 rounded-lg transition-colors w-full text-left ${
            isMenuExpanded(menuName)
              ? "text-sky-600 font-semibold bg-sky-50"
              : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
          }`}
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </div>
          <ChevronDown
            size={14}
            className={`transition-transform flex-shrink-0 ${
              isMenuExpanded(menuName) ? "rotate-180" : ""
            }`}
          />
        </button>
      );
    }

    return (
      <NavLink
        to={path}
        end={end}
        className={({ isActive }) =>
          `flex items-center gap-3 py-2 px-4 rounded-lg transition-colors ${
            isActive
              ? "bg-sky-500 text-white shadow-md"
              : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
          }`
        }
        onClick={onClose}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </NavLink>
    );
  };

  const submenuItem = (label: string, path: string, icon: React.ReactNode) => (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 py-1.5 px-8 rounded-lg transition-colors text-xs ${
          isActive
            ? "bg-sky-500 text-white shadow-md font-medium"
            : "text-gray-500 hover:bg-sky-50 hover:text-sky-600"
        }`
      }
      onClick={onClose}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header with Logo */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img
            src="/Logo.jpeg"
            alt="Repair System"
            className="w-12 h-12 object-cover flex-shrink-0 rounded-full bg-sky-50 border border-sky-100 p-0.5"
          />
          <p className="text-gray-800 font-bold text-sm whitespace-nowrap">
            Repair <span className="text-sky-500">System</span>
          </p>
        </div>
        {onClose && (
           <button
            onClick={() => onClose?.()}
            className="p-2 text-gray-400 rounded-md lg:hidden hover:text-gray-600 focus:outline-none flex-shrink-0"
          >
            <span className="sr-only">Close sidebar</span>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links - Hide scrollbar */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Dashboard - Admin Only */}
        {navigationItem(
          <LayoutDashboard size={18} className="flex-shrink-0" />,
          "Dashboard",
          "/dashboard",
          true
        )}

        {/* Indent - Admin Only */}
        {navigationItem(
          <ClipboardList size={18} className="flex-shrink-0" />,
          "Indent",
          "/indent",
          true,
          false,
          "",
          true
        )}

        {/* Approval - Admin Only */}
        {navigationItem(
          <CheckCircle size={18} className="flex-shrink-0" />,
          "Approval",
          "/approval",
          true
        )}

        {/* InHouse - Admin Only with Submenu */}
        {user?.role === "admin" && (
          <>
            {navigationItem(
              <Home size={18} className="flex-shrink-0" />,
              "InHouse",
              "#",
              true,
              true,
              "inhouse"
            )}
            {isMenuExpanded("inhouse") && (
              <div className="space-y-0.5 mt-1 mb-1">
                {submenuItem("Tech Assigned", "/indent/tech-assigned", <Users size={14} />)}
                {submenuItem("Work Tracking", "/indent/work-tracking", <Activity size={14} />)}
                {submenuItem("Inspection", "/indent/inspection", <Search size={14} />)}
              </div>
            )}
          </>
        )}

        {/* OutHouse - Admin Only with Submenu */}
        {user?.role === "admin" && (
          <>
            {navigationItem(
              <Truck size={18} className="flex-shrink-0" />,
              "OutHouse",
              "#",
              true,
              true,
              "outhouse"
            )}
            {isMenuExpanded("outhouse") && (
              <div className="space-y-0.5 mt-1 mb-1">
                {submenuItem("Select Vendor", "/select-vendor", <Store size={14} />)}
                {submenuItem("Get Offer", "/get-offer", <Receipt size={14} />)}
                {submenuItem("Rate Approval", "/approverate", <ThumbsUp size={14} />)}
              </div>
            )}
          </>
        )}

        {/* Send Machine - Shared */}
        {navigationItem(
          <Truck size={18} className="flex-shrink-0" />,
          "Send Machine",
          "/sentmachine",
          false
        )}

        {/* Store IN - Shared */}
        {navigationItem(
          <Package size={18} className="flex-shrink-0" />,
          "Store IN",
          "/storein",
          false
        )}

        {/* Payment - Admin Only */}
        {navigationItem(
          <DollarSign size={18} className="flex-shrink-0" />,
          "Payment",
          "/payment",
          true
        )}

        {/* Calendar - Shared */}
        {navigationItem(
          <CalendarDays size={18} className="flex-shrink-0" />,
          "Calendar",
          "/calendar",
          false
        )}

        {/* Daily Report - Shared */}
        {navigationItem(
          <FileText size={18} className="flex-shrink-0" />,
          "Daily Report",
          "/dailyreport",
          false
        )}

        {/* Settings - Admin Only */}
        {navigationItem(
          <SettingsIcon size={18} className="flex-shrink-0" />,
          "Settings",
          "/settings",
          true
        )}
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={() => {
            handleLogout();
            onClose?.();
          }}
          className="flex items-center gap-3 py-2 px-4 rounded-lg text-gray-600 hover:bg-sky-50 hover:text-sky-600 transition-colors w-full"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;