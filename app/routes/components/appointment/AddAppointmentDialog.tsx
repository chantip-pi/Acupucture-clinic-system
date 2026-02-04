import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
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

interface AddAppointmentDialogProps {
  isOpen: boolean;
  onAddAppointment: () => void;
  onClose: () => void;
  isLoading?: boolean;
  patients?: Array<{ id: number; nameSurname: string }>;
  doctors?: Array<{ id: number; nameSurname: string }>;
  selectedPatient: number | null;
  selectedDoctor: number | null;
  selectedDate: Date | null;
  reason: string;
  formError?: string;
  onPatientChange: (patientId: number | null) => void;
  onDoctorChange: (doctorId: number | null) => void;
  onDateChange: (date: Date | null) => void;
  onReasonChange: (reason: string) => void;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
  isOpen,
  onAddAppointment,
  onClose,
  isLoading = false,
  patients = [],
  doctors = [],
  selectedPatient,
  selectedDoctor,
  selectedDate,
  reason,
  formError,
  onPatientChange,
  onDoctorChange,
  onDateChange,
  onReasonChange,
}) => {
  const [patientOpen, setPatientOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);

  if (!isOpen) return null;

  const handleDateTimeChange = (date: Date | null) => {
    onDateChange(date);
  };

  const selectedPatientName = patients.find(p => p.id === selectedPatient)?.nameSurname || "";
  const selectedDoctorName = doctors.find(d => d.id === selectedDoctor)?.nameSurname || "";

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

        <h2 className="text-xl font-semibold mb-6 pr-8">Add Appointment</h2>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {formError}
          </div>
        )}

        <div className="space-y-4">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient <span className="text-red-500">*</span>
            </label>
            <Popover open={patientOpen} onOpenChange={setPatientOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={patientOpen}
                  className="w-full justify-between"
                >
                  {selectedPatientName || "Select patient..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[402px] p-0">
                <Command>
                  <CommandInput placeholder="Search patient..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No patient found.</CommandEmpty>
                    <CommandGroup>
                      {patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          value={patient.nameSurname}
                          onSelect={() => {
                            onPatientChange(selectedPatient === patient.id ? null : patient.id);
                            setPatientOpen(false);
                          }}
                        >
                          {patient.nameSurname}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedPatient === patient.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={doctorOpen}
                  className="w-full justify-between"
                >
                  {selectedDoctorName || "Select doctor..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[402px] p-0">
                <Command>
                  <CommandInput placeholder="Search doctor..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No doctor found.</CommandEmpty>
                    <CommandGroup>
                      {doctors.map((doctor) => (
                        <CommandItem
                          key={doctor.id}
                          value={doctor.nameSurname}
                          onSelect={() => {
                            onDoctorChange(selectedDoctor === doctor.id ? null : doctor.id);
                            setDoctorOpen(false);
                          }}
                        >
                          {doctor.nameSurname}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedDoctor === doctor.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date and Time Selection */}
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
              dateFormat="EEE, d MMM yyyy, HH:mm"
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
            />
          </div>

          {/* Reason Input */}
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
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>

          <button
            onClick={onAddAppointment}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-white bg-[#2F919C] hover:bg-[#257882] disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {isLoading ? "Creating..." : "Create Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentDialog;