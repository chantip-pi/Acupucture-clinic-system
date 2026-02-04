import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[300px]">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded text-white bg-[#2F919C] hover:bg-[#257882] disabled:opacity-50"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>

  );
};

export default ConfirmDialog;
