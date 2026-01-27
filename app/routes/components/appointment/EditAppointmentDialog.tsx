import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import DatePicker from "react-datepicker";

interface EditAppointmentDialogProps {
  isOpen: boolean;
  onEditAppointment: () => void;
  onCancelAppointment: () => void;
  onClose: () => void;
  isLoading?: boolean;
  selectedPatientName: string;
  selectedDoctorName: string;
  selectedDate: Date | null;
  reason: string;
  formError?: string;
  onDateChange: (date: Date | null) => void;
  onReasonChange: (reason: string) => void;
}

const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({
  isOpen,
  onEditAppointment,
  onCancelAppointment,
  onClose,
  isLoading = false,
  selectedPatientName,
  selectedDoctorName,
  selectedDate,
  reason,
  formError,
  onDateChange,
  onReasonChange,
}) => {
  if (!isOpen) return null;

  const handleDateTimeChange = (date: Date | null) => {
    onDateChange(date);
  };

  const minTime = new Date();
  minTime.setHours(9, 0, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(17, 0, 0, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[450px] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faX} className="text-sm" />
        </button>

        <h2 className="text-xl font-semibold mb-6 pr-8">Edit Appointment</h2>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {formError}
          </div>
        )}

        <div className="space-y-4">
          {/* Patient Display (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient
            </label>
            <div className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-700 bg-gray-50 cursor-not-allowed">
              {selectedPatientName}
            </div>
          </div>

          {/* Doctor Display (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor
            </label>
            <div className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-700 bg-gray-50 cursor-not-allowed">
              {selectedDoctorName}
            </div>
          </div>

          {/* Date and Time Selection (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date & Time <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateTimeChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="dd/MM/yyyy HH:mm"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:border-[#2F919C] focus:ring-2 focus:ring-[#2F919C]/20 focus:outline-none"
              placeholderText="Select date and time"
              isClearable
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
              timeCaption="Time"
              minTime={minTime}
              maxTime={maxTime}
              disabled={isLoading}
            />
          </div>

          {/* Reason Input (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Appointment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:border-[#2F919C] focus:ring-2 focus:ring-[#2F919C]/20 focus:outline-none resize-none"
              placeholder="Enter reason for appointment..."
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          {/* Cancel Appointment Button (Left side) */}
          <button
            onClick={onCancelAppointment}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {isLoading ? "Canceling..." : "Cancel Appointment"}
          </button>

          {/* Close and Save Buttons (Right side) */}
          <div className="flex gap-3">
          <button
              onClick={onEditAppointment}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-white bg-[#2F919C] hover:bg-[#257882] disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              Close
            </button>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentDialog;