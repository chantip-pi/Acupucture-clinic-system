import { useState, useEffect } from "react";
import { IoMdHome } from "react-icons/io";
import { FaUser, FaWrench } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { Outlet, useNavigate } from "@remix-run/react";
import { useRequireAuth } from "~/presentation/hooks/staff/useRequireAuth";
import { FaClipboardList } from "react-icons/fa";
import {
  clearUserSession,
  getUserSession,
} from "~/presentation/session/userSession";
import AcupunctureDropDown from "./components/AcupunctureDropDown";
import Suggest from "./_SNB.Suggest";

const navItems = [
  { label: "Home", icon: <IoMdHome size={22} />, to: "/home" },
  { label: "Manage Staff", icon: <FaUserDoctor size={18} />, to: "/staffListView" },
  { label: "Manage Patient", icon: <FaUser size={18} />, to: "/patientList" },
];

function SideNavBar() {
  const navigate = useNavigate();
  useRequireAuth();
  const [currentUser, setCurrentUser] = useState("Guest");
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);

  const handleLogOut = () => {
    clearUserSession();
    navigate("/logIn");
  };

  useEffect(() => {
    const session = getUserSession();
    setCurrentUser(session?.nameSurname ?? "Guest");
  }, []);

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside
        className="flex h-full min-h-screen w-72 flex-col justify-between bg-brand text-white"
        style={{ boxShadow: "4px 0 20px rgba(0,0,0,0.1)" }}
      >
        <div className="px-6 py-8">
          <p className="text-md uppercase tracking-widest text-white/80">Clinic Application</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{currentUser}</h1>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <button
                  onClick={() => navigate(item.to)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition hover:!bg-white hover:text-brand"
                  style={{ backgroundColor: "transparent" }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
            <AcupunctureDropDown/>
          </ul>
        </nav>

        <div className="px-4 pb-8">
          <button
            className="w-full rounded-xl bg-white py-2 font-semibold text-brand hover:bg-white/90"
            onClick={handleLogOut}
          >
            Log out
          </button>
        </div>
      </aside>
      <div className="flex-1 relative">
        <Outlet />

        {/* Floating Suggest Assistant Button */}
        <button
          type="button"
          onClick={() => setIsSuggestOpen(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-[#1FA1AF] text-white shadow-lg px-5 py-3 flex items-center gap-2 hover:bg-[#178995] transition-colors"
        >
          <FaClipboardList size={18} />
          <span className="font-semibold text-sm">Suggest Assistant</span>
        </button>

        {/* Right-side Suggest Panel */}
        {isSuggestOpen && (
          <div className="fixed inset-y-0 right-0 z-50 flex">
            {/* Optional backdrop on the rest of the screen */}
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setIsSuggestOpen(false)}
            />

            <div className="relative h-full w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col">
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

              <div className="flex-1 overflow-y-auto p-2">
                <Suggest />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideNavBar;
