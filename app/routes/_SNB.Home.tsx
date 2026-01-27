import React, { useState, useMemo, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "@remix-run/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button, Card, Input, SectionHeading } from "~/presentation/designSystem";
import { useGetAppointmentList } from "~/presentation/hooks/appointment/useGetAppointmentList";
import { Appointment } from "~/domain/entities/Appointment";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import AddAppointmentDialog from "./components/appointment/AddAppointmentDialog";
import EditAppointmentDialog from "./components/appointment/EditAppointmentDialog";
import { useGetDoctorList } from "~/presentation/hooks/staff/useGetDoctorList";
import { useGetPatientList } from "~/presentation/hooks/patient/useGetPatientList";
import { useCreateAppointment } from "~/presentation/hooks/appointment/useCreateAppointment";
import { useUpdateAppointment } from "~/presentation/hooks/appointment/useUpdateAppointment";
import { useCancelAppointment } from "~/presentation/hooks/appointment/useCancelAppointment";
import ConfirmDialog from "./components/common/ConfirmDialog";
import AppointmentTable from "./components/appointment/AppointmentTable";



const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const { appointments: appointmentList, loading, error } = useGetAppointmentList();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [specificDate, setSpecificDate] = useState<Date | null>(null);
  const [monthFilter, setMonthFilter] = useState<Date | null>(null);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reason, setReason] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const { doctors } = useGetDoctorList();
  const { patients } = useGetPatientList();
  const { createAppointment, loading: createAppointmentLoading, error: createAppointmentError } = useCreateAppointment();
  const { updateAppointment, loading: updateAppointmentLoading, error: updateAppointmentError } = useUpdateAppointment();
  const { cancelAppointment, loading: cancelAppointmentLoading, error: cancelAppointmentError} = useCancelAppointment();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editReason, setEditReason] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value);
    if (e.target.value !== "specific" && e.target.value !== "month") {
      setSpecificDate(null);
      setMonthFilter(null);
    }
  };

  const handleSpecificDateChange = (date: Date | null) => {
    setSpecificDate(date);
    if (date) {
      setDateFilter("specific");
      setMonthFilter(null);
    }
  };

  const handleMonthFilterChange = (date: Date | null) => {
    setMonthFilter(date);
    if (date) {
      setDateFilter("month");
      setSpecificDate(null);
    }
  };

  const handleUpdateAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditDate(new Date(appointment.appointmentDateTime));
    setEditReason(appointment.reason || "");
    setFormError("");
    setShowEditDialog(true);
  };

  const handleSubmitUpdateAppointment = async () => {
    if (!selectedAppointment) return;

    setFormError("");

    // Validation
    if (!editDate) {
      setFormError("Please select an appointment date");
      return;
    }
    if (!editReason.trim()) {
      setFormError("Please provide a reason for the appointment");
      return;
    }

    const appointmentDate = editDate.toISOString();

    const result = await updateAppointment({
      appointmentId: selectedAppointment.appointmentId,
      appointmentDateTime: appointmentDate,
      patientId: selectedAppointment.patientId,
      doctorId: selectedAppointment.doctorId,
      reason: editReason.trim(),
      status: selectedAppointment.status,
      patientName: selectedAppointment.patientName,
      doctorName: selectedAppointment.doctorName,
    });

    if (result.success) {
      handleCloseDialog();
      window.location.reload(); // Refresh the appointment list
    } else {
      setFormError(result.error || "Failed to update appointment");
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    setFormError("");

    const result = await cancelAppointment({
      appointmentId: selectedAppointment.appointmentId,
      appointmentDateTime: selectedAppointment.appointmentDateTime,
      patientId: selectedAppointment.patientId,
      doctorId: selectedAppointment.doctorId,
      reason: selectedAppointment.reason,
      status: "canceled",
      patientName: selectedAppointment.patientName,
      doctorName: selectedAppointment.doctorName,
    });

    if (result.success) {
      handleCloseDialog();
      window.location.reload(); // Refresh the appointment list
    } else {
      setFormError(result.error || "Failed to cancel appointment");
    }
  };

  const handleAddAppointment = () => {
    setShowAddDialog(true);
    // Reset form
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setReason("");
    setFormError("");
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setReason("");
    setSelectedAppointment(null);
    setEditDate(null);
    setEditReason("");
    setFormError("");
  };

  const handleSubmitAppointment = async () => {
    setFormError("");

    // Validation
    if (!selectedPatient) {
      setFormError("Please select a patient");
      return;
    }
    if (!selectedDoctor) {
      setFormError("Please select a doctor");
      return;
    }
    if (!selectedDate) {
      setFormError("Please select an appointment date");
      return;
    }
    if (!reason.trim()) {
      setFormError("Please provide a reason for the appointment");
      return;
    }

    const patient = patients.find(p => p.patientId === selectedPatient);
    const doctor = doctors.find(d => d.staffId === selectedDoctor);

    const result = await createAppointment({
      appointmentDateTime: selectedDate.toISOString(),
      patientId: selectedPatient,
      doctorId: selectedDoctor,
      reason: reason,
      status: "scheduled",
      patientName: patient?.nameSurname || "",
      doctorName: doctor?.nameSurname || "",
    });

    if (result.success) {
      handleCloseDialog();
      window.location.reload(); // Refresh the appointment list
    } else {
      setFormError(result.error || "Failed to create appointment");
    }
  };

  const filterByDate = (appointment: Appointment) => {
    if (dateFilter === "all") return true;

    const appointmentDate = new Date(appointment.appointmentDateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        return appointmentDate >= today && appointmentDate <= todayEnd;
      case "upcoming":
        return appointmentDate >= today;
      case "past":
        return appointmentDate < today;
      case "specific":
        if (!specificDate) return true;
        const selectedDateFilter = new Date(specificDate);
        selectedDateFilter.setHours(0, 0, 0, 0);
        const selectedDateEnd = new Date(selectedDateFilter);
        selectedDateEnd.setHours(23, 59, 59, 999);
        return appointmentDate >= selectedDateFilter && appointmentDate <= selectedDateEnd;
      case "month":
        if (!monthFilter) return true;
        const selectedMonth = new Date(monthFilter);
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth() + 1;
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
        return appointmentDate >= monthStart && appointmentDate <= monthEnd;
      default:
        return true;
    }
  };

  const filteredAppointments = useMemo(() => {
    const now = new Date();

    // First filter the appointments
    const filtered = appointmentList.filter((appointment) => {
      const matchesSearch =
        appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.appointmentId?.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        appointment.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate = filterByDate(appointment);

      return matchesSearch && matchesStatus && matchesDate;
    });

    // Then sort by status priority, then by appointment date
    return filtered.sort((a, b) => {
      // Status priority: scheduled (1) > completed (2) > cancelled/canceled (3) > others (4)
      const getStatusPriority = (status: string | undefined): number => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'scheduled') return 1;
        if (statusLower === 'completed') return 2;
        if (statusLower === 'cancelled' || statusLower === 'canceled') return 3;
        return 4;
      };

      const statusA = getStatusPriority(a.status);
      const statusB = getStatusPriority(b.status);

      // First sort by status priority
      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // If same status, sort by appointment date (closest to now first)
      const dateA = new Date(a.appointmentDateTime).getTime();
      const dateB = new Date(b.appointmentDateTime).getTime();
      const nowTime = now.getTime();

      // Calculate absolute difference from now
      const diffA = Math.abs(dateA - nowTime);
      const diffB = Math.abs(dateB - nowTime);

      return diffA - diffB;
    });
  }, [appointmentList, searchTerm, statusFilter, dateFilter, specificDate, monthFilter]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }

  if (!appointmentList) {
    return (
      <ErrorPage message={"No appointment data found"} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <main className="flex-1 p-8">
        <AddAppointmentDialog
          isOpen={showAddDialog}
          doctors={doctors.map(doctor => ({ id: doctor.staffId, nameSurname: doctor.nameSurname }))}
          patients={patients.map(patient => ({ id: patient.patientId, nameSurname: patient.nameSurname }))}
          selectedPatient={selectedPatient}
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          reason={reason}
          formError={formError}
          onPatientChange={setSelectedPatient}
          onDoctorChange={setSelectedDoctor}
          onDateChange={setSelectedDate}
          onReasonChange={setReason}
          onAddAppointment={handleSubmitAppointment}
          onClose={handleCloseDialog}
          isLoading={createAppointmentLoading}
        />

        <EditAppointmentDialog
          isOpen={showEditDialog}
          onEditAppointment={handleSubmitUpdateAppointment}
          onCancelAppointment={() => setShowConfirmDialog(true)}
          onClose={handleCloseDialog}
          selectedPatientName={selectedAppointment?.patientName || ""}
          selectedDoctorName={selectedAppointment?.doctorName || ""}
          selectedDate={editDate}
          reason={editReason}
          formError={formError}
          onDateChange={setEditDate}
          onReasonChange={setEditReason}
          isLoading={updateAppointmentLoading}
        />

<ConfirmDialog
            isOpen={showConfirmDialog}
            title={"Cancel Appointment"}
            message="Do you really want to cancel this appointment?"
            cancelText="No"
            confirmText="Yes"
            isLoading={updateAppointmentLoading}
            onConfirm={handleCancelAppointment}
            onCancel={() => setShowConfirmDialog(false)}
          />
        <Card>
          <div className="flex items-center justify-between mb-6">
            <SectionHeading title="Appointment List" />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddAppointment}
              className="flex items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <FontAwesomeIcon icon={faCalendarPlus} />
              </span>
              Add Appointment
            </Button>
          </div>

          <div className="mb-4 flex gap-4 items-end">
            <div className="w-80">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Search
              </label>
              <Input
                type="text"
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <select
                value={dateFilter}
                onChange={handleDateFilter}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="specific">Specific Date</option>
                <option value="month">By Month</option>
              </select>
            </div>

            {dateFilter === "specific" && (
              <div className="w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Date
                </label>
                <DatePicker
                  selected={specificDate}
                  onChange={handleSpecificDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none"
                  placeholderText="Select a date"
                  isClearable
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
              </div>
            )}

            {dateFilter === "month" && (
              <div className="w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Month
                </label>
                <DatePicker
                  selected={monthFilter}
                  onChange={handleMonthFilterChange}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none"
                  placeholderText="Select a month"
                  isClearable
                />
              </div>
            )}
          </div>

          <div className="mb-2 text-sm text-slate-600">
            Showing {filteredAppointments.length} of {appointmentList.length} appointments
          </div>

          <AppointmentTable
            appointments={filteredAppointments}
            onEdit={handleUpdateAppointment}
            allowEditStatuses={["scheduled"]}
            emptyMessage="No appointments found matching your filters"
          />
        </Card>
      </main>
    </div>
  );
};

export default AppointmentList;