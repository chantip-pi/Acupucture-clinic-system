import { useState, useEffect, useMemo } from "react";
import React from "react";
import { IoMdHome } from "react-icons/io";
import { FaUser, FaWrench } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { Outlet, useNavigate, useLocation } from "@remix-run/react";
import { useRequireAuth } from "~/presentation/hooks/staff/useRequireAuth";
import { FaClipboardList } from "react-icons/fa";
import {
  clearUserSession,
  getUserSession,
} from "~/presentation/session/userSession";
import AcupunctureDropDown from "./components/AcupunctureDropDown";
import NavigationItem from "./components/NavigationItem";
import SettingsButton from "./components/SettingsButton";
import Suggest from "./_SNB.Suggest";
import { IoSettingsSharp } from "react-icons/io5";

const navItems = [
  { label: "Home", icon: <IoMdHome size={22} />, to: "/home" },
  {
    label: "Manage Staff",
    icon: <FaUserDoctor size={18} />,
    to: "/staffListView",
  },
  { label: "Manage Patient", icon: <FaUser size={18} />, to: "/patientList" },
];

function SideNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  useRequireAuth();
  const [currentUser, setCurrentUser] = useState("Guest");
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [assistantWidth, setAssistantWidth] = useState(420);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isManager, setIsManager] = useState(false);

  const handleToggleSuggest = () => {
    setIsSuggestOpen((prev) => !prev);
  };

  const handleStartResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = assistantWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const nextWidth = Math.min(Math.max(startWidth + deltaX, 320), 700);
      setAssistantWidth(nextWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleLogOut = () => {
    clearUserSession();
    navigate("/logIn");
  };

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      setIsDoctor(false);
      setIsManager(false);
      return;
    }
    setIsDoctor(session.title?.toLowerCase() === "doctor");
    setIsManager(session.title?.toLowerCase() === "manager");
    setCurrentUser(session?.nameSurname ?? "Guest");
  }, []);

  return (
    <div className="flex h-screen bg-surface-muted">
      <aside
        className="fixed left-0 top-0 h-screen w-72 flex flex-col justify-between bg-brand text-white z-10"
        style={{ boxShadow: "4px 0 20px rgba(0,0,0,0.1)" }}
      >
        <div className="px-6 py-8">
          <p className="text-md uppercase tracking-widest text-white/80">
            Clinic Application
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            {currentUser}
          </h1>
        </div>

        <div className="flex-1 px-4 flex flex-col">
          <nav className="flex-1">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <NavigationItem
                  key={item.to}
                  label={item.label}
                  icon={item.icon}
                  to={item.to}
                  isActive={location.pathname === item.to}
                />
              ))}
              <AcupunctureDropDown currentPath={location.pathname} />
              <SettingsButton
                isActive={location.pathname === "/clinicHoursSettingsPage"}
                isManager={isManager}
              />
            </ul>
          </nav>
        </div>

        <div className="px-4 pb-8">
          <button
            className="w-full rounded-xl bg-white py-2 font-semibold text-brand hover:bg-white/90"
            onClick={handleLogOut}
          >
            Log out
          </button>
        </div>
      </aside>
      <div className="flex-1 relative ml-72">
        <Outlet />

        {/* Floating Suggest Assistant Button */}
        {(isDoctor || isManager) && (
          <button
            type="button"
            onClick={handleToggleSuggest}
            className="fixed bottom-6 right-6 z-40 rounded-full bg-[#1FA1AF] text-white shadow-lg px-5 py-3 flex items-center gap-2 hover:bg-[#178995] transition-colors"
          >
            <FaClipboardList size={18} />
            <span className="font-semibold text-sm">
              {isSuggestOpen ? "Hide Suggest" : "Suggest Assistant"}
            </span>
          </button>
        )}

        {/* Right-side Suggest Panel */}
        {isSuggestOpen && (
          <div
            className="fixed inset-y-4 right-4 z-50 flex"
            style={{ width: assistantWidth }}
          >
            {/* Resize handle */}
            <div
              className="w-1 cursor-col-resize bg-slate-200 hover:bg-slate-400 transition-colors rounded-l-full"
              onMouseDown={handleStartResize}
            />

            <div className="relative h-full flex-1 bg-white shadow-2xl border border-gray-200 flex flex-col rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-slate-50">
                <div className="flex items-center gap-2">
                  <FaClipboardList size={18} className="text-[#1FA1AF]" />
                  <h2 className="font-semibold text-gray-800 text-sm">
                    Suggest Assistant
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSuggestOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Close
                </button>
              </div>

              <div className="flex-1  p-2">
                <Suggest />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(SideNavBar);
