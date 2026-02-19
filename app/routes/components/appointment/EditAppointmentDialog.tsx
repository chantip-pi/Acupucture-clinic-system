import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { getAvailableTimeSlotsForDate, getClinicSchedule } from "~/presentation/hooks/getClinicHours";

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
  const [timeOpen, setTimeOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Extract time from selectedDate when component mounts or selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setSelectedTime(timeString);
    } else {
      setSelectedTime("");
    }
  }, [selectedDate]);

  // Get available time slots based on clinic schedule
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    try {
      return getAvailableTimeSlotsForDate(selectedDate);
    } catch (error) {
      console.error("Error getting time slots:", error);
      return [];
    }
  }, [selectedDate]);

  // Filter available dates (only show days that clinic is open)
  const isDateAvailable = (date: Date) => {
    try {
      const schedule = getClinicSchedule();
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = dayNames[date.getDay()];
      const daySchedule = schedule.find(d => d.dayName === dayName);
      return daySchedule?.isOpen || false;
    } catch (error) {
      console.error("Error checking date availability:", error);
      return false;
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Reset time when date changes
      setSelectedTime("");
      // Set date without time
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);
      onDateChange(dateOnly);
    } else {
      setSelectedTime("");
      onDateChange(null);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      onDateChange(newDate);
    }
    setTimeOpen(false);
  };

  if (!isOpen) return null;

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

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="EEE, d MMM yyyy"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:border-[#2F919C] focus:ring-2 focus:ring-[#2F919C]/20 focus:outline-none"
              placeholderText="Select date"
              isClearable
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              minDate={new Date()}
              filterDate={isDateAvailable}
              disabled={isLoading}
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Time <span className="text-red-500">*</span>
            </label>
            <Popover open={timeOpen} onOpenChange={setTimeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={timeOpen}
                  className="w-full justify-between"
                  disabled={!selectedDate || isLoading}
                >
                  {selectedTime || "Select time..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[402px] p-0">
                <Command>
                  <CommandInput placeholder="Search time..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No time slot available.</CommandEmpty>
                    <CommandGroup>
                      {availableTimeSlots.map((time) => (
                        <CommandItem
                          key={time}
                          value={time}
                          onSelect={() => handleTimeChange(time)}
                        >
                          {time}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedTime === time ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {!selectedDate && (
              <p className="mt-1 text-xs text-gray-500">Please select a date first</p>
            )}
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