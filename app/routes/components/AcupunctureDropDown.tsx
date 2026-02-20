import React, { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { ChevronDown } from "lucide-react";
import { FaDiagnoses } from "react-icons/fa";

interface AcupunctureDropDownProps {
  currentPath?: string;
}

interface DropdownItemProps {
  label: string;
  to: string;
  isActive: boolean;
  onClick: () => void;
}

const DropdownItem = React.memo(({ label, to, isActive, onClick }: DropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-3 py-2 text-left text-sm font-medium transition rounded ${
        isActive 
          ? "bg-white text-brand font-semibold" 
          : "hover:text-white"
      }`}
    >
      {label}
    </button>
  );
});

DropdownItem.displayName = "DropdownItem";

const AcupunctureDropDown = ({ currentPath }: AcupunctureDropDownProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Check if any dropdown item is active
  const isIllnessLibraryActive = currentPath === "/illnessLibrary";
  const isMeridianLibraryActive = currentPath === "/meridianLibrary";
  const isAnyItemActive = isIllnessLibraryActive || isMeridianLibraryActive;

  // Auto-open dropdown if any item is active
  useEffect(() => {
    if (isAnyItemActive) {
      setOpen(true);
    }
  }, [isAnyItemActive]);

  const handleIllnessLibraryClick = () => {
    navigate("/illnessLibrary");
    setOpen(false);
  };

  const handleMeridianLibraryClick = () => {
    navigate("/meridianLibrary");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition hover:!bg-white hover:text-brand"
        style={{ backgroundColor: "transparent" }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
          <FaDiagnoses size={25} />
        </span>
        <span className="flex-1">Acupuncture</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="ml-8 space-y-2 border-l border-white/20 pl-4">
          <DropdownItem
            label="Illness Library"
            to="/illnessLibrary"
            isActive={isIllnessLibraryActive}
            onClick={handleIllnessLibraryClick}
          />
          <DropdownItem
            label="Meridian Library"
            to="/meridianLibrary"
            isActive={isMeridianLibraryActive}
            onClick={handleMeridianLibraryClick}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(AcupunctureDropDown);