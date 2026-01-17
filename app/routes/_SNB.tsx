import React from "react";
import { IoMdHome } from "react-icons/io";
import { FaUser, FaWrench } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { RiExchange2Fill } from "react-icons/ri";
import { Outlet, useNavigate } from "@remix-run/react";
import { useRequireAuth } from "~/presentation/hooks/staff/useRequireAuth";
import { FaClipboardList } from "react-icons/fa";
import { FaDiagnoses } from "react-icons/fa";
import {
  clearUserSession,
  getUserSession,
} from "~/presentation/session/userSession";

const navItems = [
  { label: "Home", icon: <IoMdHome size={22} />, to: "/home" },
  { label: "Manage Staff", icon: <FaUserDoctor size={18} />, to: "/staffListView" },
  { label: "Manage Patient", icon: <FaUser size={18} />, to: "/patientList" },
  // { label: "Income / Expenses", icon: <RiExchange2Fill size={20} />, to: "/incomeExpenses" },
  // { label: "Equipment", icon: <FaWrench size={18} />, to: "/equipment" },
  { label: "Medical Record", icon: <FaClipboardList size={20} />, to: "/medicalRecord" },
  { label: "Acupuncture", icon: <FaDiagnoses size={25} />, to: "/acupunctureSelect"},
];

function SideNavBar() {
  const navigate = useNavigate();
  useRequireAuth();
  const [currentUser, setCurrentUser] = React.useState("Guest");

  const handleLogOut = () => {
    clearUserSession();
    navigate("/logIn");
  };

  React.useEffect(() => {
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
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default SideNavBar;
