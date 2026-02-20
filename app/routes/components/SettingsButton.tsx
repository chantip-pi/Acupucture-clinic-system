import React from "react";
import { useNavigate } from "@remix-run/react";
import { IoSettingsSharp } from "react-icons/io5";

interface SettingsButtonProps {
  isActive: boolean;
  isManager: boolean;
}

const SettingsButton = React.memo(({ isActive, isManager }: SettingsButtonProps) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: isManager ? "block" : "none" }}>
      <button
        onClick={() => navigate("/clinicHoursSettingsPage")}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition ${
          isActive
            ? "!bg-white text-brand"
            : "hover:!bg-white hover:text-brand"
        }`}
        style={{ backgroundColor: isActive ? "white" : "transparent" }}
      >
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          isActive ? "bg-brand/20" : "bg-white/10"
        }`}>
          <IoSettingsSharp size={18} />
        </span>
        <span>Settings</span>
      </button>
    </div>
  );
});

SettingsButton.displayName = "SettingsButton";

export default SettingsButton;
