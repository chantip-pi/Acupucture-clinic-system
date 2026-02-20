import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  SectionHeading,
  Button,
} from "~/presentation/designSystem";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox } from "app/components/ui/checkbox";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  dayName: string;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

interface ClinicSettings {
  schedule: DaySchedule[];
  appointmentInterval: number; // in minutes
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const INTERVAL_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
];

const ClinicHoursSettings = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [appointmentInterval, setAppointmentInterval] = useState<number>(30);
  const [hasChanges, setHasChanges] = useState(false);

  // Generate time options based on selected interval
  const generateTimeOptions = (interval: number): string[] => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const TIME_OPTIONS = generateTimeOptions(appointmentInterval);

  // Load saved schedule from localStorage or use defaults
  useEffect(() => {
    const savedSettings = localStorage.getItem("clinicHoursSettings");
    if (savedSettings) {
      const settings: ClinicSettings = JSON.parse(savedSettings);
      setSchedule(settings.schedule);
      setAppointmentInterval(settings.appointmentInterval || 30);
    } else {
      // Default schedule: Mon-Fri 10:00-17:00
      const defaultSchedule: DaySchedule[] = DAYS_OF_WEEK.map((day) => ({
        dayName: day,
        isOpen: !["Saturday", "Sunday"].includes(day),
        timeSlots: !["Saturday", "Sunday"].includes(day)
          ? [{ start: "10:00", end: "17:00" }]
          : [],
      }));
      setSchedule(defaultSchedule);
      setAppointmentInterval(30);
    }
  }, []);

  const toggleDayOpen = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].isOpen = !newSchedule[dayIndex].isOpen;
    
    // If turning off, clear time slots
    if (!newSchedule[dayIndex].isOpen) {
      newSchedule[dayIndex].timeSlots = [];
    } else if (newSchedule[dayIndex].timeSlots.length === 0) {
      // If turning on and no slots, add default slot
      newSchedule[dayIndex].timeSlots = [{ start: "10:00", end: "17:00" }];
    }
    
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const lastSlot = newSchedule[dayIndex].timeSlots[newSchedule[dayIndex].timeSlots.length - 1];
    
    // Default new slot starts after the last slot ends
    const newStart = lastSlot ? lastSlot.end : "10:00";
    const newEnd = "17:00";
    
    newSchedule[dayIndex].timeSlots.push({ start: newStart, end: newEnd });
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots.splice(slotIndex, 1);
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const handleIntervalChange = (newInterval: number) => {
    setAppointmentInterval(newInterval);
    setHasChanges(true);
  };

  const handleSave = () => {
    const settings: ClinicSettings = {
      schedule,
      appointmentInterval,
    };
    localStorage.setItem("clinicHoursSettings", JSON.stringify(settings));
    setHasChanges(false);
    alert("Clinic hours saved successfully!");
  };

  const handleReset = () => {
    const defaultSchedule: DaySchedule[] = DAYS_OF_WEEK.map((day) => ({
      dayName: day,
      isOpen: !["Saturday", "Sunday"].includes(day),
      timeSlots: !["Saturday", "Sunday"].includes(day)
        ? [{ start: "10:00", end: "17:00" }]
        : [],
    }));
    setSchedule(defaultSchedule);
    setAppointmentInterval(30);
    setHasChanges(true);
  };

  return (
    <Card>
      <SectionHeading
        title="Clinic Hours Settings"
        description="Configure your clinic's operating hours for each day of the week"
      />

      {/* Appointment Interval Setting */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Appointment Time Interval
            </h3>
            <p className="text-xs text-slate-600">
              Set the time gap between appointment slots
            </p>
          </div>
          <select
            value={appointmentInterval}
            onChange={(e) => handleIntervalChange(Number(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium focus:border-[#2F919C] focus:ring-2 focus:ring-[#2F919C]/20 focus:outline-none"
          >
            {INTERVAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {schedule.map((day, dayIndex) => (
          <div
            key={day.dayName}
            className="border border-slate-200 rounded-lg p-4 bg-slate-50"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={day.isOpen}
                  onCheckedChange={() => toggleDayOpen(dayIndex)}
                  className="data-[state=checked]:bg-brand data-[state=checked]:text-white data-[state=checked]:border-0"
                />
                <span className="text-lg font-semibold text-slate-900">
                  {day.dayName}
                </span>
                {!day.isOpen && (
                  <span className="text-sm text-slate-500">(Closed)</span>
                )}
              </div>

              {day.isOpen && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => addTimeSlot(dayIndex)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Time Slot
                </Button>
              )}
            </div>

            {/* Time Slots */}
            {day.isOpen && (
              <div className="space-y-3">
                {day.timeSlots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="flex items-center gap-3 bg-white p-3 rounded-md border border-slate-200"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-sm font-medium text-slate-700">
                        From:
                      </label>
                      <select
                        value={slot.start}
                        onChange={(e) =>
                          updateTimeSlot(dayIndex, slotIndex, "start", e.target.value)
                        }
                        className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-[#2F919C] focus:ring-2 focus:ring-[#2F919C]/20 focus:outline-none"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>

                      <label className="text-sm font-medium text-slate-700">
                        To:
                      </label>
                      <select
                        value={slot.end}
                        onChange={(e) =>
                          updateTimeSlot(dayIndex, slotIndex, "end", e.target.value)
                        }
                        className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-[#2F919C] focus:ring-2 focus:ring-[#2F919C]/20 focus:outline-none"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    {day.timeSlots.length > 1 && (
                      <button
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove time slot"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <Button variant="secondary" onClick={handleReset}>
          Reset to Default
        </Button>

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <p className="mt-4 text-sm text-amber-600 text-center">
          You have unsaved changes
        </p>
      )}
    </Card>
  );
};

export default ClinicHoursSettings;