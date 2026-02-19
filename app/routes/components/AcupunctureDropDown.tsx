import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { ChevronDown } from "lucide-react";
import { FaDiagnoses } from "react-icons/fa";

const AcupunctureDropDown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
          <button
            onClick={() => {
              navigate("/acupunctureLibrary");
              setOpen(false);
            }}
            className="block w-full px-3 py-2 text-left text-sm font-medium transition hover:text-white"
          >
            Acupuncture Library
          </button>
          <button
            onClick={() => {
              navigate("/meridianLibrary");
              setOpen(false);
            }}
            className="block w-full px-3 py-2 text-left text-sm font-medium transition hover:text-white"
          >
            Meridian Library
          </button>
        </div>
      )}
    </>
  );
};

export default AcupunctureDropDown;