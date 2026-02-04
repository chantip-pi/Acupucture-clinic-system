import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useMemo } from "react";
import { Check, ChevronsUpDown, Calendar, User, Stethoscope } from "lucide-react";
import DatePicker from "react-datepicker";
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
import { Appointment } from "~/domain/entities/Appointment";
import { useGetDoctorList } from "~/presentation/hooks/staff/useGetDoctorList";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";


interface AddMedicalRecordDialogProps {
  isOpen: boolean;
  onStartMedicalRecord: (recordData: {
    appointmentId?: number;
    doctorId: number;
    patientId: number;
    dateTime: string;
    patientName: string;
    doctorName: string;
  }) => void;
  onClose: () => void;
  appointments?: Appointment[];
  patient: { id: number; nameSurname: string };
  doctors?: Array<{ id: number; nameSurname: string }>;
  formError?: string;
}

const AddMedicalRecordDialog: React.FC<AddMedicalRecordDialogProps> = ({
  isOpen,
  onStartMedicalRecord,
  onClose,
  appointments = [],
  patient,
  formError,
}) => {
  const { doctors: doctorList } = useGetDoctorList();
  
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Manual input state
  const [isManualMode, setIsManualMode] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter for scheduled appointments only and sort by date (latest first)
  const scheduledAppointments = useMemo(() => 
    appointments
      .filter(apt => apt.status === "scheduled")
      .sort((a, b) => new Date(b.appointmentDateTime).getTime() - new Date(a.appointmentDateTime).getTime()),
    [appointments]
  );

  // When appointment is selected, auto-fill doctor and date/time
  useEffect(() => {
    if (selectedAppointmentId && !isManualMode) {
      const appointment = scheduledAppointments.find(apt => apt.appointmentId === selectedAppointmentId);
      if (appointment) {
        setSelectedDoctor(appointment.doctorId);
        setSelectedDate(new Date(appointment.appointmentDateTime));
      }
    }
  }, [selectedAppointmentId, isManualMode, scheduledAppointments]);

  // Reset all state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAppointmentId(null);
      setIsManualMode(false);
      setSelectedDoctor(null);
      setSelectedDate(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedAppointment = scheduledAppointments.find(apt => apt.appointmentId === selectedAppointmentId);
  const selectedDoctorName = doctorList.find(d => d.staffId === selectedDoctor)?.nameSurname || "";



  const handleStartMedicalRecord = () => {
    if (!selectedDoctor || !selectedDate) return;

    setIsLoading(true);
    onStartMedicalRecord({
      appointmentId: selectedAppointmentId ?? undefined,
      doctorId: selectedDoctor,
      patientId: patient.id,
      dateTime: selectedDate.toISOString(),
      patientName: patient.nameSurname,
      doctorName: selectedDoctorName
    });
  };

  const isFormValid = selectedDoctor && selectedDate && patient.id;

  const minTime = new Date();
  minTime.setHours(9, 0, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(17, 0, 0, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[30vw] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faX} className="text-sm" />
        </button>

        <h2 className="text-xl font-semibold mb-6 pr-8">Start Medical Record</h2>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {formError}
          </div>
        )}

        {/* Toggle between appointment-based and manual */}
        <div className="mb-4 flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              setIsManualMode(false);
              setSelectedAppointmentId(null);
              setSelectedDoctor(null);
              setSelectedDate(null);
            }}
            disabled={isLoading || scheduledAppointments.length === 0}
            className={cn(
              "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
              !isManualMode 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900",
              scheduledAppointments.length === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            Appointment
          </button>
          <button
            onClick={() => {
              setIsManualMode(true);
              setSelectedAppointmentId(null);
              setSelectedDoctor(null);
              setSelectedDate(null);
            }}
            disabled={isLoading}
            className={cn(
              "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
              isManualMode 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Walk-in
          </button>
        </div>

        <div className="space-y-4">
          {!isManualMode ? (
            // FROM APPOINTMENT MODE
            <>
              {scheduledAppointments.length === 0 ? (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-xs">
                  <strong>No Appointments Available:</strong> Please switch to Walk-in to create a medical record.
                </div>
              ) : (
                <>
                  {/* Appointment Selection (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Appointment 
                    </label>
                    <Popover open={appointmentOpen} onOpenChange={setAppointmentOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={appointmentOpen}
                          className="w-full justify-between h-auto py-3"
                          disabled={isLoading}
                        >
                          <div className="text-left">
                            {selectedAppointment ? (
                              <div className="space-y-1">
                                <div className="font-medium">{selectedAppointment.patientName}</div>
                                <div className="text-xs text-gray-500">
                                  {DateTimeHelper.formatDateTime(new Date(selectedAppointment.appointmentDateTime))}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">Select appointment</span>
                            )}
                          </div>
                          <ChevronsUpDown className="opacity-50 ml-2 shrink-0" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[452px] p-0">
                        <Command>
                          <CommandInput placeholder="Search by doctor or date" className="h-9" />
                          <CommandList>
                            <CommandEmpty>No appointment found.</CommandEmpty>
                            <CommandGroup>
                              {scheduledAppointments.map((appointment) => (
                                <CommandItem
                                  key={appointment.appointmentId}
                                  value={`${appointment.patientName} ${appointment.doctorName} ${DateTimeHelper.formatDateTime(new Date(appointment.appointmentDateTime))}`}
                                  onSelect={() => {
                                    setSelectedAppointmentId(appointment.appointmentId);
                                    setAppointmentOpen(false);
                                  }}
                                  className="py-3"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium">{appointment.patientName}</div>
                                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {DateTimeHelper.formatDateTime(new Date(appointment.appointmentDateTime))}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Stethoscope className="w-3 h-3" />
                                        Dr. {appointment.doctorName}
                                      </div>
                                    </div>
                                  </div>
                                  <Check
                                    className={cn(
                                      "ml-2 shrink-0",
                                      selectedAppointmentId === appointment.appointmentId ? "opacity-100" : "opacity-0"
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

                  {selectedAppointment && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-xs">
                      <strong>Note:</strong> Doctor and date/time are pre-filled from the appointment. You can modify them below if needed.
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-xs">
              <strong>Walk-in Patient:</strong> Enter all required details to create a medical record.
            </div>
          )}

          {/* Only show patient/doctor/datetime fields if in manual mode OR (in appointment mode with appointments available) */}
          {(isManualMode || (!isManualMode && scheduledAppointments.length > 0)) && (
            <>
              {/* Patient - Pre-selected and Disabled */}
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient <span className="text-red-500">*</span>
            </label>
            <Button
              variant="outline"
              className="w-full justify-between bg-gray-50 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 opacity-50" />
                {patient.nameSurname}
              </div>
            </Button>
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
                  disabled={isLoading}
                >
                  {selectedDoctorName ? (
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 opacity-50" />
                      {selectedDoctorName}
                    </div>
                  ) : (
                    "Select doctor..."
                  )}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[452px] p-0">
                <Command>
                  <CommandInput placeholder="Search doctor..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No doctor found.</CommandEmpty>
                    <CommandGroup>
                      {doctorList.map((doctor) => (
                        <CommandItem
                          key={doctor.staffId}
                          value={doctor.nameSurname}
                          onSelect={() => {
                            setSelectedDoctor(doctor.staffId);
                            setDoctorOpen(false);
                          }}
                        >
                          {doctor.nameSurname}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedDoctor === doctor.staffId ? "opacity-100" : "opacity-0"
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
              Date & Time <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="EEE, d MMM yyyy, HH:mm"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:border-[#2F919C] focus:ring-2 focus:ring-[#2F919C]/20 focus:outline-none"
              placeholderText="Select date and time"
              isClearable
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              minDate={new Date()}
              timeCaption="Time"
              minTime={minTime}
              maxTime={maxTime}
              disabled={isLoading}
            />
            {!isManualMode && selectedAppointment && (
              <p className="mt-1 text-xs text-gray-500">
                Pre-filled from appointment. You can change if patient arrived at a different time.
              </p>
            )}
          </div>

          {/* Appointment Details (if selected) */}
          {selectedAppointment && !isManualMode && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">Appointment Information</h3>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">Scheduled:</span>
                  <span className="font-medium text-slate-900">
                    {DateTimeHelper.formatDateTime(new Date(selectedAppointment.appointmentDateTime))}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Reason</div>
                  <div className="text-slate-700">{selectedAppointment.reason}</div>
                </div>
              </div>
            </div>
          )}
            </>
          )}
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
            onClick={handleStartMedicalRecord}
            disabled={isLoading || !isFormValid}
            className="px-4 py-2 rounded-md text-white bg-[#2F919C] hover:bg-[#257882] disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {isLoading ? "Starting..." : "Start Medical Record"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecordDialog;