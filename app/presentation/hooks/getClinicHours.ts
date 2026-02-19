// ~/domain/utils/getClinicHours.ts

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  dayName: string;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

export interface ClinicSettings {
  schedule: DaySchedule[];
  appointmentInterval: number;
}

export const getClinicSettings = (): ClinicSettings => {
  const savedSettings = localStorage.getItem("clinicHoursSettings");
  
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  
  // Default settings if none exists
  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  
  return {
    schedule: DAYS_OF_WEEK.map((day) => ({
      dayName: day,
      isOpen: !["Saturday", "Sunday"].includes(day),
      timeSlots: !["Saturday", "Sunday"].includes(day)
        ? [{ start: "10:00", end: "17:00" }]
        : [],
    })),
    appointmentInterval: 30,
  };
};

export const getClinicSchedule = (): DaySchedule[] => {
  return getClinicSettings().schedule;
};

export const getAppointmentInterval = (): number => {
  return getClinicSettings().appointmentInterval;
};

export const getAvailableTimeSlotsForDate = (date: Date): string[] => {
  const settings = getClinicSettings();
  const schedule = settings.schedule;
  const interval = settings.appointmentInterval;
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[date.getDay()];
  
  const daySchedule = schedule.find(d => d.dayName === dayName);
  
  if (!daySchedule || !daySchedule.isOpen) {
    return [];
  }
  
  const allSlots: string[] = [];
  
  daySchedule.timeSlots.forEach(timeSlot => {
    const [startHour, startMinute] = timeSlot.start.split(':').map(Number);
    const [endHour, endMinute] = timeSlot.end.split(':').map(Number);
    
    // Convert to total minutes for easier calculation
    let currentTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    // Generate time slots
    while (currentTotalMinutes <= endTotalMinutes) {
      const hour = Math.floor(currentTotalMinutes / 60);
      const minute = currentTotalMinutes % 60;
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      allSlots.push(timeString);
      
      currentTotalMinutes += interval;
      
      // Safety check to prevent infinite loop
      if (currentTotalMinutes > 24 * 60) break;
    }
  });
  
  // Filter out past times if the selected date is today
  const today = new Date();
  const selectedDateOnly = new Date(date);
  selectedDateOnly.setHours(0, 0, 0, 0);
  const todayOnly = new Date(today);
  todayOnly.setHours(0, 0, 0, 0);
  
  if (selectedDateOnly.getTime() === todayOnly.getTime()) {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    return allSlots.filter((timeSlot) => {
      const [hour, minute] = timeSlot.split(':').map(Number);
      if (hour > currentHour) return true;
      if (hour === currentHour && minute > currentMinute) return true;
      return false;
    });
  }
  
  return allSlots;
};