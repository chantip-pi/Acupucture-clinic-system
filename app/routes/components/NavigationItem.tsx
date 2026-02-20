import React from "react";
import { useNavigate } from "@remix-run/react";

interface NavigationItemProps {
  label: string;
  icon: React.ReactNode;
  to: string;
  isActive: boolean;
}

const NavigationItem = React.memo(({ label, icon, to, isActive }: NavigationItemProps) => {
  const navigate = useNavigate();

  return (
    <li>
      <button
        onClick={() => navigate(to)}
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
          {icon}
        </span>
        <span>{label}</span>
      </button>
    </li>
  );
});

NavigationItem.displayName = "NavigationItem";

export default NavigationItem;
