export class AppointmentValidationService {
    static validateAppointmentDate(appointmentDate: string): boolean {
      if (!appointmentDate) return false;
  
      const appointment = new Date(appointmentDate);
      const now = new Date();
  
      // Invalid date check
      if (isNaN(appointment.getTime())) return false;
  
      // Must not be in the past
      return appointment >= now;
    }
  }
  