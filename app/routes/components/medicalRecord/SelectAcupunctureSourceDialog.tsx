import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface SelectAcupunctureSourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPickLibrary: () => void;
  onPickManual: () => void;
}

const SelectAcupunctureSourceDialog: React.FC<SelectAcupunctureSourceDialogProps> = ({
  isOpen,
  onClose,
  onPickLibrary,
  onPickManual,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faX} className="text-base" />
        </button>
        
        {/* Title */}
        <h2 className="text-xl font-semibold mb-6 pr-8">
          Select Acupuncture Point Source
        </h2>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPickLibrary}
            className="w-full px-6 py-3 rounded-lg text-white bg-[#2F919C] hover:bg-[#257882] transition-colors font-medium"
          >
            Pick from Library
          </button>

          <button
            onClick={onPickManual}
            className="w-full px-6 py-3 rounded-lg text-white bg-[#2F919C] hover:bg-[#257882] transition-colors font-medium"
          >
            Pick Manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectAcupunctureSourceDialog;